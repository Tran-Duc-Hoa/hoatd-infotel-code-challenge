import { ApiProperty } from '@nestjs/swagger';

export class PaymentDto {
  @ApiProperty({
    example: '0000',
    description: 'Result code',
  })
  result_code: string;

  @ApiProperty({
    example: {
      checkout_url:
        'https://sandbox2.nganluong.vn/vietcombank-checkout/vcb/vi/checkout/version_1_0/index/177086-CO96AC4BBC19',
      token_code: '177086-CO96AC4BBC19',
    },
    description: 'Result code',
  })
  result_data: object;

  @ApiProperty({
    example: 'Success',
    description: 'Result Message',
  })
  result_message: string;
}
