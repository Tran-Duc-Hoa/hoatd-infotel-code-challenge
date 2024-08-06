import { ApiProperty } from '@nestjs/swagger';

export class BookingInfoDto {
  @ApiProperty({
    example: '00326787',
    description: 'Confirmation no',
  })
  confirmation_no: string;

  @ApiProperty({
    example: '203153',
    description: 'Reservation name id',
  })
  resv_name_id: string;

  @ApiProperty({
    example: '2024-03-24',
    description: 'Arrival date',
  })
  arrival: string;

  @ApiProperty({
    example: '2024-03-25',
    description: 'Departure date',
  })
  departure: string;

  @ApiProperty({
    example: 3,
    description: 'No adults',
  })
  adults: number;

  @ApiProperty({
    example: '2',
    description: 'No children',
  })
  children: number;

  @ApiProperty({
    example: 'SSD',
    description: 'Room type',
  })
  roomtype: string;

  @ApiProperty({
    example: 'COMP',
    description: 'Rate code',
  })
  ratecode: string;

  @ApiProperty({
    example: {
      amount: 0,
      currency: 'VND',
    },
    description: 'Rate amount',
  })
  rateamount: object;

  @ApiProperty({
    example: '6PM',
    description: 'Guarantee',
  })
  guarantee: string;

  @ApiProperty({
    example: 'CA',
    description: 'Payment method',
  })
  method_payment: string;

  @ApiProperty({
    example: 'DUEIN',
    description: 'Computed reservation status',
  })
  computed_resv_status: string;

  @ApiProperty({
    example: 'Mr.',
    description: 'The title of customer',
  })
  title: string;

  @ApiProperty({
    example: 'Le',
    description: 'The last name of customer',
  })
  last_name: string;

  @ApiProperty({
    example: 'Phuoc Canh Quan',
    description: 'The first name of customer',
  })
  first_name: string;

  @ApiProperty({
    example: '0942803291',
    description: 'Phone number',
  })
  phone_number: string;

  @ApiProperty({
    example: 'example.com',
    description: 'Email',
  })
  email: string;

  @ApiProperty({
    example: '0',
    description: 'Booking balance',
  })
  booking_balance: number;

  @ApiProperty({
    example: '2024-03-19',
    description: 'Departure date',
  })
  booking_created_date: string;
}
