import * as home from './actionTypes';

// 保存数据
export const setHomeData= (value, datatype) => {
  return {
    type: home.SET_HOME_DATA,
    value,
    datatype,
  }
}


// 保存列表数据
export const setHomeList= (value, datatype) => {
  return {
    type: home.SET_HOME_LIST,
    value,
    datatype,
  }
}
