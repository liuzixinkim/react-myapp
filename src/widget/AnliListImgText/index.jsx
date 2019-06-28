import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import fetchJsonp from 'fetch-jsonp';
import './index.scss';
import LazyImage from "../LazyImage";
class Pages extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { itemInfo: {} };
    }

    //会在组件挂载后
    componentDidMount() {

    }

    //会在渲染执行之前被调用
    //shouldComponentUpdate(nextProps, nextState){}
    //会在更新后会被立即调用
    //componentDidUpdate(prevProps, prevState, snapshot){}
    //会在组件卸载及销毁之前直接调用
    componentWillUnmount() {

    }

    //添加用户检测行为
    bindUserEvent = (event) => {

        var _id = event.currentTarget.getAttribute('id'),
            user_id = this.getCookie('gatheruuid');
        var url = `http://jiaju.bch.leju.com/index/api/userevent?user_id=${user_id}&event=CLICK&news_id=${_id}&topcolumn=图片`;
        
        fetchJsonp(url,{
            jsonpCallbackFunction: 'custom_callback'
        })
        .then(function () {})
        .catch(function () {});
    
    }
    
    
    getCookie = (cookieName) => {
        var cookieArr = document.cookie.split('; '); //'a=1; b=2; c=3' -> [a=1,b=2,c=3]
        var result = '';
        cookieArr.forEach((item) => {
            if (item.split('=')[0] == cookieName) {
                result = item.split('=')[1]
            }
        })
        return result;
    }

    //点击案例 右侧名片头像 展开案例详情 
    /* pressInfo = (item) => {
        //alert(JSON.stringify( item ))
        let itemInfo = Object.assign({}, this.state.itemInfo);
        if ((itemInfo.id == item.user_id && itemInfo.showInfoId == item.id)) {
            //已经显示则清空 隐藏
            this.setState({
                itemInfo: {}
            });
        } else {
            //设计师
            //if(item.agent_type == 3){}else { //装修公司 }
            ljApi.designerDetail.get({ cacheKey: true,  cacheHours: 2,id: item['user_id'] },
                (state, datas, msg) => {
                    //alert(JSON.stringify( datas ))
                    if (state && state == 1) {
                        datas.showInfoId = item.id;
                        this.setState({
                            itemInfo: datas
                        });
                    }
                })
        }
    } */

    render() {
        let item = Object.assign({}, this.props.itemData),
            itemInfo = Object.assign({}, this.state.itemInfo);
        //console.log('itemInfo'+JSON.stringify(itemInfo));
        return (
            <section className="index-section-wrap clearfix">
                <Link to={`/anli/info/${item.id || item.album_id}`} onClick={this.bindUserEvent} id={item.id || item.album_id}>
                    <div className="imageWrap">
                        <div className="pic">
                        <LazyImage
                            srcset={item.cover}
                            src="http://src.leju.com/imp/imp/deal/86/ec/3/9767be68fc489a0491a5235ec4f_p24_mk24.png" />
                        </div>


                        <div className="label">
                            {item.area && item.area != 0
                                ? (<div className="labelItemWrap"><span className="labelItem">{parseInt(item.area)}㎡</span></div>)
                                : ''}
                            {item.house_style || item.house_style_name
                                ? (<div className="labelItemWrap"><span className="labelItem">{item.house_style_name || item.house_style}</span></div>)
                                : ''}
                            {item.style || item.style_name
                                ? (<div className="labelItemWrap"><span className="labelItem">{item.style_name || item.style}</span></div>)
                                : ''}
                        </div>
                    </div>
                </Link>
                <div className="msg">
                    <div className="tit-wrap">
                        <span className="title">{item.name}</span>
                        <span className="price2">{(item.price && item.price != 0.00) ? '报价:' + item.price + 'W' : ''}</span>
                    </div>
                    <div className="pv-wrap">
                        <div>
                            <label className="eye-icon"></label>
                            <span className="views">{item.pv}</span>
                        </div>
                        {/* {item.id&&item.user_id 
                    ? <div onClick={ ()=>{this.pressInfo( item )} }>
                        {item.agent_type && item.agent_type == 3
                            ? <label className="names-designer"></label>
                            : <label className="names-company"></label>}
                      </div>
                    :''} */}
                        {item.avaster
                            ? <Link className="avatar" to={{ pathname: `/designer/info/${item.user_id}/${item.agent_type}` }}>
                                <LazyImage
                                    srcset={item.avaster}
                                    src="http://src.leju.com/imp/imp/deal/6d/ac/9/23ec2e9328fb148e014bb10f433_p24_mk24.png" />
                            </Link>
                            : ''}
                    </div>
                </div>


                {/* {itemInfo.id && item.user_id && itemInfo.showInfoId == item.id && itemInfo.id == item.user_id
                    ? <div className="pop_box">
                        <i></i>
                        <div className="pop1">
                            <Link to={`/designer/info/${item.user_id}/${item.agent_type}`} >
                                <img className="tx" src={itemInfo.avaster} />
                            </Link>
            
                            <div className="gz">
                                <p onClick={() => { this.props.pressToInfo(item, itemInfo) }} >公司：{itemInfo.real_name}</p>
                                <Link to={{ pathname: '/info/', state: item }} >
                                    <p>城市：{itemInfo.city_name}</p>
                                </Link>
                            </div>
                        </div>
                        <div className="gz">
                            <p onClick={() => { this.props.pressToInfo(item, itemInfo) }} >公司：{itemInfo.real_name}</p>
                            <Link to={{ pathname: '/info/', state: item }} >
                                <p>城市：{itemInfo.city_name}</p>
                            </Link>
                        </div>
                    </div>
                    : ''} */}
            </section>
        )
    }
}

export default Pages;
