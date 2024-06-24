import { Controller, Get } from '@nestjs/common';
import { TourService } from './tour.service';

@Controller()
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Get('festivals')
  async getFestivals() {
    return await this.tourService.getFestivalsInfo();
  }

  @Get('pet-tour')
  async getPetTour() {
    return await this.tourService.getPetTourInfo();
  }

  @Get('bigdata')
  async getBigdata() {
    return await this.tourService.getBigdataInfo();
  }
}
