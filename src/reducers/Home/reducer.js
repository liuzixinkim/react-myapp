import * as home from './actionTypes';
import * as Enums from '../../utils/enums';

    let defaultState = {
        currCityJson: window.currCityJson || Enums.defaultPos,
        anliPages:{// 案例请求 页码 参数
          c:99, // 99: 默认是全 城市 编号
          s:99, // 风格
          h:99, // 户型
          p:99, // 价格
          a:99, // 面积
          page:1// 页数
        },
        modalTabData:{//首页tab选项数据
          house_style:[],
          style:[],
          price:[],
          area:[]
        },
        anliList:[],
        activeTab:'house_style',//当前选中的tab
        activeModalTabData:[],//当前tab弹出框显示数据
        defaultTab: Object.assign({}, Enums.homeListParams.defaultTab),//如果tab 接口没有返回数据 默认给显示全部
        tabBarItem: Object.assign([], Enums.homeListParams.tabBarItem),//tab栏数据与状态
        defaultTabfocused: Object.assign({}, Enums.homeListParams.defaultTabfocused),//每个tab 选中的label 
        showTabItem:false,
        //anliPages:Object.assign({}, Enums.homeListParams.anliPages),// 案例请求 页码 参数
        refreshing:true,//请求网络 还是取缓存数据
    };


export const homeData = (state = defaultState , action = {}) => {
  let states = state;
  //console.log(action.type+'::'+JSON.stringify( action ))
  switch(action.type){
    case home.SET_HOME_DATA:
      
      if (action.datatype && action.value){
        states = Object.assign({}, {...state, ...{[action.datatype]: action.value}});
      } else{
        states =  Object.assign({}, {...state, ...action.value } );
      }

      //console.log('states===========::'+JSON.stringify( states ))

      return states;
    case home.SET_HOME_LIST:
      if (action.datatype && action.value){
        return {...state, ...{['anliList']: action.value}};
      } else{
        return {...state, ...action.value };
      }
    case home.GET_HOME_LIST:
      return state;
    default:
      return state;
  }
}


export default homeData