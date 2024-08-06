import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaymentDto } from './dto/payment.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':confirmation_no')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Initiates a payment process',
    description:
      'Initiates a payment process for the booking associated with the confirmation number. This endpoint will redirect the client to the Vietcombank payment page. When the transaction is successful, the client will be redirected to a success-page on the frontend hosted in localhost:3000/payment-success. Else, if failed, the client will be redirected to localhost:3000 /payment-fail.',
  })
  @ApiCookieAuth('access_token')
  @ApiResponse({
    status: 201,
    description: 'Success.',
    type: PaymentDto,
  })
  createOrder(@Param('confirmation_no') confirmationNo: string) {
    return this.paymentService.createOrder(confirmationNo);
  }
}
