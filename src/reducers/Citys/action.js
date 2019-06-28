import * as city from './actionTypes';

// 保存数据
export const setCityData= (value, datatype) => {
  return {
    type: city.SET_CITY_DATA,
    value,
    datatype,
  }
}

