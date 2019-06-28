import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ljApi } from '../../api/server.js';
import { setCityData } from '../../reducers/Citys/action';
import { setHomeData } from '../../reducers/Home/action';
import MyHeaderBar  from '../../widget/MyHeaderBar/index';
import SearchBox from './SearchBox.jsx';

import SearchResult from './SearchResult.jsx';

import AllCityList from './AllCityList.jsx';

import './index.scss';

class Pages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //showSearchResult:true
    };
  }

 //挂载前
  componentWillMount(){
    if (this.props.citysData.allCityList.length == 0) {
      this.requestCityList();
    }
  }

  //会在组件挂载后
  componentDidMount() {

  }

  //获取所有城市列表数据 
  async requestCityList(){
    ljApi.city.get({cacheKey:true},
      (state, datas, msg)=>{

          if (state && state == 1 && datas) {

            this.props.setCityData({
              allCityList:datas.all,
              hotCityList:datas.hot
            });
          } else {
            //this.serverErrorAlert( '获取城市信息失败' )
          }
      }, 
      (res)=>{
        //this.serverErrorAlert(  )
    })

  }

  backBtnOnPress=()=>{
    //window.location.history.goBack();
    this.props.history.goBack()
  }

    //过滤关键字
    filtercitysData=(text)=> {
        let allCitys = Object.assign([], this.props.citysData.allCityList )
        let results = [];

        console.log(allCitys)
        
        for (let i = 0; i < allCitys.length; i++) {

            let item = allCitys[i];
            if (item.name.indexOf(text) > -1 
                || text.indexOf( item.name ) > -1 
                || item.initial.indexOf( text.toUpperCase() ) > -1
                || text.toUpperCase().indexOf(item.initial) > -1
                ) 
                {
                results.push(item);
            }

        }
        console.log(results)
        return results;
    }
    //过滤搜索结果
    onChangeTextKeyword=(newVal)=> {
        //alert(newVal);
        if (newVal == ""){
          this.props.setCityData( {showSearchResult: false});
        } else {
            // 在这里过滤数据结果
            let dataList = this.filtercitysData(newVal);

            this.props.setCityData(
                  {
                      keyword:newVal, 
                      showSearchResult: true, 
                      searchResultList: dataList
                  }
              );
        }
    }
  //清除输入框内容
  clearKeywordText=()=>{
      this.props.setCityData( {showSearchResult: false});
  }
  //城市标签选中被点击 
  onSelectCity=(cityJson)=> {
    // 保存当前城市 ID 
    //this.saveCurrCitys( cityJson )

    window.currCityJson = cityJson;
    if ( localStorage ) {
      localStorage.setItem('currCityJson', JSON.stringify( cityJson ) );
    }

    this.props.setCityData({
      currentCity:cityJson,
      showSearchResult: false
    });

    let anliPages = Object.assign({}, this.props.homeData.anliPages);
        anliPages.c = cityJson.id;
    this.props.setHomeData({
        anliPages:anliPages
      });


    //保存访问过的城市
    this.saveVisitCity( cityJson, ()=> {
        this.props.history.goBack()
    })
  }

    //保存最后访问过 的城市
    saveVisitCity=( cityObj, fun )=>{
        let lastVisit = [cityObj];

        let lastVisitCityList = this.props.citysData.lastVisitCityList || lastVisit;

        //去重复 如果有访问过 不在添加
        let findCityObj = lastVisitCityList.find( function( obj ){ return obj.name == cityObj.name })
        if ( !findCityObj ) { lastVisitCityList.unshift( cityObj ) }
        //取前面四个
        if (lastVisitCityList.length > 4) {
            lastVisitCityList = lastVisitCityList.slice(0,4)
        }

        this.props.setCityData({
          lastVisitCityList:lastVisitCityList
        });

        fun&&fun();

    }

  //保存当前城市 ID 
  saveCurrCitys=( cityJson )=>{
      window.currCityJson = cityJson;
      if ( localStorage ) {
        localStorage.setItem('currCityJson', JSON.stringify( cityJson ) );
      }
      this.props.setCityData({
        currentCity:cityJson
      });

  }

  render() {
    return (
        <div className="city-list-wrap">
          <MyHeaderBar
              { ...this.state }
              backBtnOnPress={ this.backBtnOnPress }
              titleText={'装修房屋所在城市'}
          />

            <SearchBox
                keyword={this.props.citysData.keyword}
                changeText={ this.onChangeTextKeyword }
                clearKeywordText = { this.clearKeywordText }
            />

            { this.props.citysData.showSearchResult
                ? (<SearchResult
                    keyword={this.props.citysData.keyword}
                    onSelectCity={ this.onSelectCity }
                    searchResultList={this.props.citysData.searchResultList}/>)
                : (
                  <AllCityList
                      onSelectCity={ this.onSelectCity }
                      allCityList={this.props.citysData.allCityList}
                      hotCityList={this.props.citysData.hotCityList}
                      lastVisitCityList={this.props.citysData.lastVisitCityList}
                      currentCity={this.props.citysData.currentCity}/>
                )}

        </div>
    )
  }
}

export default connect(state => ({
  citysData: state.citysData,
  homeData: state.homeData
}), {
  setCityData,
  setHomeData
})(Pages);


