import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';
import fetchJsonp from 'fetch-jsonp';
import LazyImage from "../LazyImage";

class PicListImgText extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
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

    render() {
        let item = Object.assign({}, this.props.itemData)
        return (
            <div className="pic-item" >
                <Link to={`/pic/info/${item.id || item.album_id}`} id={item.id || item.album_id} onClick={this.bindUserEvent}>
                    <div className="cover">
                        <LazyImage
                            srcset={item.cover}
                            src="http://src.leju.com/imp/imp/deal/86/ec/3/9767be68fc489a0491a5235ec4f_p24_mk24.png" />
                    </div>
                    <div className="msg">
                        <h5>{item.name}</h5>
                        <div className="pv-wrap">
                            <label className="eye-icon"></label>
                            <span className="views">{item.pv}</span>
                        </div>
                    </div>
                </Link>
            </div>
        )
    }
}

export default PicListImgText;