import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';

@Injectable()
export class BookingService {
  async getBookingInfo(confirmationNo: string) {
    const filePath = path.join(
      __dirname,
      '../xml',
      `booking_${confirmationNo}.xml`,
    );
    if (!fs.existsSync(filePath)) {
      return { error: 'File not found' };
    }

    const xmlData = fs.readFileSync(filePath, 'utf8');

    const result = await this.parseXmlToJson(xmlData);
    const hotelReservation =
      result['soap:Envelope']['soap:Body'].FetchBookingResponse
        .HotelReservation;
    const resGuest =
      result['soap:Envelope']['soap:Body'].FetchBookingResponse
        .HotelReservation['r:ResGuests']['r:ResGuest'];
    let profile = resGuest?.['r:Profiles']?.Profile;
    if (profile instanceof Array) {
      profile = profile[0];
    }
    const arrival = resGuest?.['r:ArrivalTransport']?.$?.time;
    const departure = resGuest?.['r:DepartureTransport']?.$?.time;
    const guestCounts =
      hotelReservation?.['r:RoomStays']?.['hc:RoomStay']?.['hc:GuestCounts'][
        'hc:GuestCount'
      ];
    const bookingCreatedDate =
      result['soap:Envelope']['soap:Body'].FetchBookingResponse
        .HotelReservation['r:ReservationHistory'].$.insertDate;

    return {
      confirmation_no:
        result['soap:Envelope']['soap:Header'].OGHeader.$.transactionID,
      resv_name_id: result['soap:Envelope'][
        'soap:Body'
      ].FetchBookingResponse.HotelReservation['r:UniqueIDList'][
        'c:UniqueID'
      ]?.find((item) => item?.$?.source === 'RESVID')?._,
      arrival: arrival ? dayjs(arrival).format('YYYY-MM-DD') : undefined,
      departure: departure ? dayjs(departure).format('YYYY-MM-DD') : undefined,
      adults: guestCounts[0]?.$?.count,
      children: guestCounts[1]?.$?.count,
      roomtype:
        hotelReservation['r:RoomStays']['hc:RoomStay']['hc:RoomTypes'][
          'hc:RoomType'
        ].$?.roomTypeCode,
      ratecode:
        hotelReservation['r:RoomStays']['hc:RoomStay']['hc:RoomRates'][
          'hc:RoomRate'
        ].$.ratePlanCode,
      rateamount: {
        amount: Number(
          hotelReservation['r:RoomStays']['hc:RoomStay']['hc:RoomRates'][
            'hc:RoomRate'
          ]['hc:Rates']['hc:Rate']['hc:Base']._,
        ),
        currency:
          hotelReservation['r:RoomStays']['hc:RoomStay']['hc:RoomRates'][
            'hc:RoomRate'
          ]['hc:Rates']['hc:Rate']['hc:Base'].$.currencyCode,
      },
      guarantee:
        hotelReservation['r:RoomStays']['hc:RoomStay']['hc:Guarantee'].$
          .guaranteeType,
      method_payment:
        hotelReservation['r:RoomStays']['hc:RoomStay']['hc:Payment'][
          'hc:PaymentsAccepted'
        ]['hc:PaymentType']['hc:OtherPayment'].$.type,
      computed_resv_status:
        result['soap:Envelope']['soap:Body'].FetchBookingResponse
          .HotelReservation.$.computedReservationStatus,
      last_name: profile?.Customer?.PersonName?.['c:lastName'],
      first_name: profile?.Customer?.PersonName?.['c:firstName'],
      title: profile?.Customer?.PersonName?.['c:nameTitle'],
      phone_number: profile?.Phones?.NamePhone?.['c:PhoneNumber'],
      email: profile?.Emails?.NameEmail?.['c:Email'],
      booking_balance: Number(
        hotelReservation['r:RoomStays']['hc:RoomStay']['hc:CurrentBalance']._,
      ),
      booking_created_date: bookingCreatedDate
        ? dayjs(bookingCreatedDate).format('YYYY-MM-DD')
        : undefined,
      address: profile?.Addresses?.NameAddress?.['c:countryCode'],
    };
  }

  async parseXmlToJson(xml: string): Promise<any> {
    return new Promise((resolve, reject) => {
      xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
