import React, { PureComponent } from 'react';
import './index.scss';
import Share from "../../widget/Share";
import fetchJsonp from "fetch-jsonp";
import { Link } from 'react-router-dom';



class AnliFooterBar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            share: false
        };
    }
    

    showShareModalBox() {

        if(!this.state.share){
            //添加用户检测行为
            var _id = this.props.anliDetailData.id || this.props.anliDetailData.album_id,
                user_id = this.getCookie('gatheruuid');
            var url = `http://jiaju.bch.leju.com/index/api/userevent?user_id=${user_id}&event=SHARE&news_id=${_id}&topcolumn=图片`;
            
            fetchJsonp(url,{
                jsonpCallbackFunction: 'custom_callback'
            })
            .then(function () {})
            .catch(function () {});
        }

        
        this.setState({
            share: !this.state.share
        })

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




    render() {
        let { share } = this.state;
        let anliDetailData = this.props.anliDetailData;
        //console.log("anliDetailData",anliDetailData)
        return (
            <div id="footerBar">
                <div className="footerBar">
                    <a className="item" href={"tel:" + anliDetailData.tel} style={{ backgroundColor: '#3cbea0' }}>
                        <img src='http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/button_tel@3x.png' alt="img" />
                        <span>立即电话沟通</span>
                    </a>
                    <Link className="item" to={{ pathname: '/price/order/' , state : anliDetailData}} style={{ backgroundColor: '#ffb668' }} >
                        <img src='http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/button_design@3x.png' alt="img" />
                        <span>免费预约设计</span>
                    </Link>
                    {this.props.share ? <div className="item" style={{ backgroundColor: '#fa566f' }} onClick={() => this.showShareModalBox()}>
                        <img src='http://src.leju.com/imp/imp/deal/51/71/c/80648aa1cc1cb9fcf569e46b506_p24_mk24.png' alt="img" />
                        <span>分享</span>
                    </div> : null}
                </div>

                {(share && this.props.share) ? <Share anliDetailData={anliDetailData} parentFn={() => this.showShareModalBox()} /> : null}
            </div>

        )
    }
}

export default AnliFooterBar;
