import { Injectable } from '@nestjs/common';
import { makeQueryString } from 'src/utils/common';

@Injectable()
export class TourService {
  async getFestivalsInfo() {
    const params = {
      listYN: 'Y',
      arrange: 'A',
      eventStartDate: '20240624',
      // areaCode: null,
      // sigunguCode: null,
      // modifiedtime: null,
    };
    const queryString = makeQueryString(params);
    const url =
      'https://apis.data.go.kr/B551011/KorService1/searchFestival1' +
      queryString;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  }

  async getPetTourInfo() {
    const queryString = makeQueryString();
    const url =
      'https://apis.data.go.kr/B551011/KorService1/detailPetTour1' +
      queryString;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  }

  async getBigdataInfo() {
    const queryString = makeQueryString({
      startYmd: '20210601',
      endYmd: '20210630',
    });
    const url =
      'https://apis.data.go.kr/B551011/DataLabService/metcoRegnVisitrDDList' +
      queryString;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  }

  async getTourInfo(id: string, type: string) {
    const queryString = makeQueryString({ contentId: id, contentTypeId: type });
    const url =
      'https://apis.data.go.kr/B551011/KorService1/detailInfo1' + queryString;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  }

  async getAccommodationInfo() {
    const queryString = makeQueryString();
    const url =
      'https://apis.data.go.kr/B551011/KorService1/searchStay1' + queryString;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  }

  async getEcoTourInfo() {
    const queryString = makeQueryString();
    const url =
      'https://apis.data.go.kr/B551011/GreenTourService1/areaBasedList1' +
      queryString;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  }

  async getGoCampingInfo() {
    const queryString = makeQueryString();
    const url =
      'https://apis.data.go.kr/B551011/GoCamping/basedList' + queryString;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  }

  async getDisabilityTourInfo() {
    const queryString = makeQueryString();
    const url =
      'https://apis.data.go.kr/B551011/KorWithService1/areaBasedList1' +
      queryString;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  }
}
