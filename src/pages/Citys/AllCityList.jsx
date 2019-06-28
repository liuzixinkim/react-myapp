import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setCityData } from '../../reducers/Citys/action';
import RowItem from './RowItem.jsx';

const key_now = '当前城市';
const key_last_visit = '最近访问';
const key_hot = '热门城市';

class Pages extends Component {
  constructor(props) {
    super(props);

        let currentCity = this.props.citysData.currentCity;
        let lastVisitCity = this.props.citysData.lastVisitCityList;
        let allCity = this.props.citysData.allCityList;
        let hotCity = this.props.citysData.hotCityList;
        
        let  letterBlob = {}

        //按字母 组合数据{A:{}, B:{}}
        allCity.map(cityJson => {
            let key = cityJson.initial.toUpperCase();

            if (letterBlob[key]) {
                let letters = letterBlob[key];
                    letters.push(cityJson);
            } else {
                let letters = [];
                    letters.push(cityJson);
                    letterBlob[key] = letters;
            }
        });

        //按照字母排序
        let letterBlobSort = {}
        let letterKeys = Object.keys(letterBlob)
            letterKeys =  letterKeys.sort()

        letterKeys.map((val, index, arrays)=>(
            letterBlobSort[val] = letterBlob[val] 
        )) 


        this.state = {
            letterKeys:letterKeys,
            letterBlob:letterBlobSort
        };

  }

  //会在组件挂载后
  componentDidMount() {

  }

  render() {
       return (
            <div className="citylist-wrap">
                {/*当前城市*/}
                <div className="sectionView">
                    <label className="sectionText">
                        {key_now} :&nbsp; 
                        <label> 
                            { this.props.currentCity.name }
                        </label>
                    </label>
                </div>

                {/*最近访问*/}
                <div className="sectionView">
                    <label className="sectionText">{key_last_visit}</label>
                    <RowItem
                        isLetterRow = { false }
                        itemData={ this.props.lastVisitCityList }
                        labelOnPress = { this.props.onSelectCity }/>
                </div>

                {/*热门城市*/}
                <div className="sectionView">
                    <label className="sectionText">{key_hot}</label>
                        <RowItem
                            isLetterRow = { false }
                            itemData={ this.props.hotCityList }
                            labelOnPress = { this.props.onSelectCity } />
                </div>
                
                {/*按照字母排序显示城市*/}
                {this.state.letterKeys.map((v, key) => (
                    <RowItem
                        key={key}
                        isLetterRow = { true }
                        letterBlob = { this.state.letterBlob }
                        letter={ v }
                        itemData2={ this.state.letterBlob[v] }
                        labelOnPress = { this.props.onSelectCity } />

                ))}
            </div>
        )
  }
}

export default connect(state => ({
  citysData: state.citysData
}), {
  setCityData
})(Pages);
