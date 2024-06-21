import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  async getFestvalInfo() {
    const params = {
      numOfRows: 10,
      pageNo: 1,
      MobileOS: 'ETC',
      MobileApp: 'AppTest',
      _type: 'json',
      listYN: 'Y',
      arrange: 'A',
      eventStartDate: '20240601',
      areaCode: null,
      sigunguCode: null,
      modifiedtime: null,
      serviceKey:
        'yOKfglgPtpI4epdJjSnd1qOxl%2BbgcmrZXYIaFaK8TrHDLXeBT%2F5fNnrWt6%2Bwrez%2BhZWRhbek6l1YOQsaapnE2w%3D%3D',
    };

    // const url = 'https://apis.data.go.kr/B551011/KorService1/searchFestival1';
    const queryString =
      '?' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
    const url =
      'http://api.visitkorea.or.kr/openapi/service/rest/KorService/searchFestival' +
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
