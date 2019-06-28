import React, { Component } from 'react';
import "./index.scss";
import MyHeaderBar from "../../widget/MyHeaderBar";
import { cityCode } from "../../api/cityCode";
import DialogAlert from "../../widget/DialogAlert";
import Utils from "../../utils/utils";

class PriceOrder extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userName: '',//联系人
            mobile: '',//联系方式
            village: '',//小区名称
            selectProvince: '',
            selectCity: '',
            provinceList: [],
            cityList: [],
            showSucessBox: false
        };
    }


    componentWillMount() {
        let currnetCityObj = window.currCityJson || (localStorage && localStorage.currCityJson);
        let cityName = currnetCityObj.name || '',
            indexArr = Utils.getStrInArrIndex(cityCode, cityName);

        if (indexArr) {
            /* 
             * 如果是直辖市，省市重复，做特殊处理
            */
            let first = indexArr[0],
                second = indexArr.length == 2 ? 2 : indexArr[1],
                third = indexArr.length == 2 ? 0 : indexArr[2],
                fourth = indexArr.length == 2 ? 0 : indexArr[3];
            this.setState({
                selectProvince: cityCode[first][second - 1],//根据城市定位得到的省份numberCode
                selectCity: cityCode[first][second][third][fourth + 1],//根据城市定位得到的城市numberCode
                cityList: cityCode[first][second]//根据城市定位得到的需要渲染的城市列表数据
            })
        } else {
            this.setState({
                selectProvince: cityCode[0][1],//默认省/市
                selectedCity: cityCode[0][2][0][1],//默认市/地区
                cityList: cityCode[0][2]//默认渲染的市/地区列表数据
            })
        }
    }

    //渲染省份或者直辖市
    renderProvince = () => {
        return cityCode.map(function (item, key) {
            return <option key={key} value={item[1]}>{String(item[0])}</option>
        });
    }
    //渲染城市或者直辖市地区
    renderCity = () => {
        return this.state.cityList.map(function (item, key) {
            return <option key={key} value={item[1]}>{String(item[0])}</option>
        })
    }

    //切换省份或者直辖市
    changeProvince = (e) => {
        let _this = this;
        cityCode.map((item) => {
            if (e.target.value == item[1]) {
                _this.setState({
                    selectProvince: e.target.value,
                    selectCity: item[2][0][1],
                    cityList: item[2]
                })
            }
        })

    }
    //切换城市或者直辖市地区
    changeCity = (e) => {
        this.setState({
            selectCity: e.target.value
        })
    }

    changeUserName = (e) => {
        this.setState({
            userName: e.target.value
        })
    }
    changeMobile = (e) => {
        this.setState({
            mobile: e.target.value
        })
    }

    changeVillage = (e) => {
        this.setState({
            village: e.target.value
        })
    }
    //验证表单
    validateFn = () => {
        let errMsg = '', {
            userName, mobile, village, selectProvince, selectCity
        } = this.state;

        if (!userName) {
            errMsg = '姓名不可为空';
        } else if (!mobile) {
            errMsg = '手机号码不可为空';
        } else if (!(/1[3|4|5|6|7|8|9]\d{9}/g.test(mobile))) {
            errMsg = '请输入正确手机号码';
        } else if (!village) {
            errMsg = '请填写小区名称'
        } else if (!selectProvince) {
            errMsg = '请选择省市'
        } else if (!selectCity) {
            errMsg = '请选择市/地区'
        } else {
            errMsg = ''
        }

        if (errMsg === '') {
            return true
        } else {
            alert(errMsg);
            return false
        }
    }

    //提交表单
    submitForm = () => {
        let _this = this,
            {
                userName, mobile, village, selectProvince, selectCity
            } = _this.state;

        let params = _this.props.location.state;
        if (_this.validateFn()) {
            let dataOpts = Utils.formDataFn({
                "id": params.user_id ? params.user_id : "",//被预约人/公司 id
                "name": params.user_name ? params.user_name : "",//被预约人/公司 name
                "album_id": params.id ? params.id : "",// 案例/美图id
                "album_name": params.name ? params.name : "",//案例/美图名称
                "source": 8,//来源
                "agent_type": params.agent_type ? params.agent_type : "",//用户类型
                "contact_way": mobile,//联系方式
                "contact_man": userName,//联系人
                "pro": selectProvince,//省份
                "city": selectCity,//城市
                "village": village//小区名称
            });



            /* ljApi.freeApply.post({
                formData: dataOpts
            }, (state, data, msg) => {
                if (state && state == 1) {
                    _this.setState({
                        showSucessBox: true
                    })
                } else {
                    DialogAlert.open({
                        alertTip: "预约失败，请稍后重试",
                        isShowCancel: false
                    })
                }
            }, (res) => {
                DialogAlert.open({
                    alertTip: "预约失败，请稍后重试",
                    isShowCancel: false
                })
            }) */

            fetch("http://zx.jiaju.sina.com.cn/index.php?app=App&mod=Bespoke&act=appBespoke", {
                method: 'post',
                body: dataOpts,
            }).then(function (res) {
                return res.json();
            }).then(function (json) {
                if (json.success == 1) {
                    _this.setState({
                        showSucessBox: true
                    })
                } else {
                    DialogAlert.open({
                        alertTip: "预约失败，请稍后重试",
                        isShowCancel: false
                    })
                }
            })

        }
    }

    goBack = () => {
        this.props.history.goBack();
    }

    closeSucessBox = () => {
        this.setState({
            showSucessBox: false
        })
    }


    render() {
        //console.log(this.props.location.state)
        let { showSucessBox } = this.state;
        return (
            <div className="priceOrder">
                <MyHeaderBar titleText="装修报价" backBtnOnPress={() => { this.goBack() }} />
                <img className="banner" src='http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/price/banner@3x.png' alt="img" />
                <div className="form">
                    <input type="text" placeholder="姓名" value={this.state.userName} onChange={e => this.changeUserName(e)} />
                    <input type="text" placeholder="请输入手机号码" value={this.state.mobile} onChange={e => this.changeMobile(e)} />
                    <input type="text" placeholder="小区" value={this.state.village} onChange={e => this.changeVillage(e)} />
                    <div className="address">
                        <select value={this.state.selectProvince} onChange={e => this.changeProvince(e)}>
                            {this.renderProvince()}
                        </select>
                        <select value={this.state.selectCity} onChange={e => this.changeCity(e)}>
                            {this.renderCity()}
                        </select>
                    </div>
                    <button className="submit" onClick={() => this.submitForm()}>立即报价</button>
                </div>

                {
                    showSucessBox ? <div className="sucessBox">
                        <div className="msg">
                            <div className="text">
                                <div className="close" onClick={() => this.closeSucessBox()}></div>
                                <h3>恭喜您</h3>
                                <p>免费报价已经提交，稍后会有工作人员联系您！</p>
                            </div>
                            <div className="button" onClick={() => this.goBack()}>确定</div>
                        </div>
                    </div> : null
                }
            </div>
        );
    }

}

export default PriceOrder;
