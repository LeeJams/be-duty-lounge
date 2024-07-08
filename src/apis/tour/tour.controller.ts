import { Controller, Get, Query } from '@nestjs/common';
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

  @Get('tour')
  async getTourInfo(@Query() query) {
    return await this.tourService.getTourInfo(query.id, query.type);
  }

  @Get('accommodation')
  async getAccommodationInfo() {
    return await this.tourService.getAccommodationInfo();
  }

  @Get('eco-tour')
  async getEcoTour() {
    return await this.tourService.getEcoTourInfo();
  }

  @Get('go-camping')
  async getGoCamping() {
    return await this.tourService.getGoCampingInfo();
  }

  @Get('disability')
  async getDisability() {
    return await this.tourService.getDisabilityTourInfo();
  }
}
