import * as home from './actionTypes';
import * as Enums from '../../utils/enums';

    let defaultState = {
          showSearchResult: false,
          keyword: '',
          searchResultList: [],
          currentCity: Object.assign({}, Enums.defaultPos),
          lastVisitCityList: Object.assign([], Enums.defaultPos),
          allCityList: Object.assign([], Enums.defaultPos),
          hotCityList: Object.assign([], Enums.defaultPos),

    };


export const citysData = (state = defaultState , action = {}) => {
  let states = state;
  //console.log(action.type+'::'+JSON.stringify( action ))
  switch(action.type){
    case home.SET_CITY_DATA:
      if (action.datatype && action.value){
        states ={...state, ...{[action.datatype]: action.value}};
      } else{
        states = {...state, ...action.value };
      }

      return states;

    default:
      return state;
  }
}


export default citysData