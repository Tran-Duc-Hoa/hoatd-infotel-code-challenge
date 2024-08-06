import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BookingService } from './booking.service';
import { BookingInfoDto } from './dto/booking-info.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get(':confirmation_no')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Retrieves booking data',
    description:
      'Retrieves booking data based on the confirmation number provided in the path.',
  })
  @ApiResponse({
    status: 200,
    description: 'Get booking information successfully.',
    type: BookingInfoDto,
  })
  @ApiCookieAuth('access_token')
  async getBooking(@Param('confirmation_no') confirmationNo: string) {
    return this.bookingService.getBookingInfo(confirmationNo);
  }
}
