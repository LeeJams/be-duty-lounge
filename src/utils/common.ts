export const BASIC_PARAMS = {
  serviceKey:
    'yOKfglgPtpI4epdJjSnd1qOxl%2BbgcmrZXYIaFaK8TrHDLXeBT%2F5fNnrWt6%2Bwrez%2BhZWRhbek6l1YOQsaapnE2w%3D%3D',
  _type: 'json',
  numOfRows: 100,
  pageNo: 1,
  MobileOS: 'ETC',
  MobileApp: 'AppTest',
};

export const makeQueryString = (obj?: object) => {
  const params = {
    ...BASIC_PARAMS,
    ...obj,
  };

  console.log('params', params);

  return (
    '?' +
    Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&')
  );
};
