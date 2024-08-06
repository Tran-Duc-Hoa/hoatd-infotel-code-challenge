import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';

import { BookingService } from 'src/booking/booking.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly bookingService: BookingService,
  ) {}

  async createOrder(confirmationNo: string) {
    const merchantSiteCode =
      this.configService.getOrThrow('MERCHANT_SITE_CODE');
    const merchantPassCode = this.configService.getOrThrow('MERCHANT_PASSCODE');
    const orderDescription = 'Example order description';

    //* These default values are used for testing
    const {
      rateamount,
      first_name,
      last_name,
      email = 'test@gmail.com',
      phone_number = '0829493864',
      address,
    } = await this.bookingService.getBookingInfo(confirmationNo);

    const amount = String(rateamount?.amount || 100000);
    const currency = rateamount?.currency;
    const buyerFullname = `${first_name} ${last_name}`;
    const returnUrl = 'http://localhost:3000/payment-success';
    const cancelUrl = 'http://localhost:3000/payment-failed';
    const notifyUrl = 'http://localhost:3000/notify';
    const language = 'vi';
    const checksum = this.generateMd5Checksum(
      [
        merchantSiteCode,
        confirmationNo,
        orderDescription,
        amount,
        currency,
        buyerFullname,
        email,
        phone_number,
        address,
        returnUrl,
        cancelUrl,
        notifyUrl,
        language,
        merchantPassCode,
      ].join('|'),
    );

    const formData = new FormData();
    formData.append('function', 'CreateOrder');
    formData.append('merchant_site_code', merchantSiteCode);
    formData.append('order_code', confirmationNo);
    formData.append('order_description', orderDescription);
    formData.append('amount', amount);
    formData.append('currency', currency);
    formData.append('buyer_fullname', buyerFullname);
    formData.append('buyer_email', email);
    formData.append('buyer_mobile', phone_number);
    formData.append('buyer_address', address);
    formData.append('return_url', returnUrl);
    formData.append('cancel_url', cancelUrl);
    formData.append('notify_url', notifyUrl);
    formData.append('language', language);
    formData.append('checksum', checksum);
    const res = await axios.postForm(
      this.configService.getOrThrow('VIETCOMBANK_URL'),
      formData,
    );
    return res.data;
  }

  generateMd5Checksum(data: string): string {
    return crypto.createHash('md5').update(data).digest('hex');
  }
}
