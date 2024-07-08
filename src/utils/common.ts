export const BASIC_PARAMS = {
  // serviceKey: process.env.SERVICE_KEY,
  _type: 'json',
  numOfRows: 100,
  pageNo: 1,
  MobileOS: 'ETC',
  MobileApp: 'AppTest',
};

export const makeQueryString = (obj?: object) => {
  console.log('process.env.SERVICE_KEY', process.env.SERVICE_KEY);
  const params = {
    serviceKey: process.env.SERVICE_KEY,
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
