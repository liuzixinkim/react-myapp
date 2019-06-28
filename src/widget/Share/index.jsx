import React, { PureComponent } from 'react';
import './index.scss';
import Utils from "../../utils/utils";

class AnliDetailSwiper extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            sharePic: false,
            shareWexinTip: false,
            shareWexinTip2: false
        };
    }

    //分享
    shareMsg = (type) => {
        let  anliDetailData = this.props.anliDetailData;
        /*QQ分享*/
        if (type === "qq") {
            window.location = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + encodeURIComponent(window.location.href) + '&title=' + encodeURIComponent(anliDetailData.name) + '&desc=' + encodeURIComponent(anliDetailData.description) + '&pics=' + encodeURIComponent(anliDetailData.cover);
        }


        /*微博分享*/
        if (type === "weibo") {
            window.location = 'http://service.weibo.com/share/share.php?url=' + encodeURIComponent(window.location.href) + '&title=' + encodeURIComponent(anliDetailData.name) + '&desc=' + encodeURIComponent(anliDetailData.description) + '&pic=' + encodeURIComponent(anliDetailData.cover);
        }
        /*微信分享*/
        if (type === "weixin") {
            if (Utils.is_weixin()) {
                this.setState({
                    shareWexinTip2: true,
                })
            } else {
                this.setState({
                    shareWexinTip: true
                })
            }

        }

        /*保存图片*/
        if (type === "pic") {
            this.setState({
                sharePic: true,
                shareWexinTip:false,
                shareWexinTip2:false
            }, () => {
                setTimeout(() => {
                    this.setState({
                        sharePic: false
                    })
                }, 1000)
            })
        }
    }



    render() {
        let { sharePic, shareWexinTip, shareWexinTip2 } = this.state;
        return (
            <div className="share-container">
                <div className="sharebg" onClick={() => this.props.parentFn()}></div>
                {
                    (shareWexinTip || shareWexinTip2) ? null : <div className="shareimg">
                        <img className="lejushare_img" alt="img" src={this.props.anliDetailData.shareHaibao}/>
                    </div>
                }
                <div className={shareWexinTip2 ? "shareTsihi" : "shareTsihi share-hide"} onClick={() => this.props.parentFn()}>
                    <img src="https://res.leju.com/resources/app/touch/share/images/dll_sharepop02.png" alt="img" />
                </div>
                <div className={shareWexinTip ? "shareTsihi" : "shareTsihi share-hide"}>
                    <img src="https://res.leju.com/resources/app/touch/share/images/dll_sharepop.png" alt="img"/>
                </div>
                <div className="sharedom">
                    <div className="weibo_sharedom dom">
                        <div onClick={() => this.shareMsg("weibo")}>
                            <i className="gg_s01"></i>
                            <p>新浪微博</p>
                        </div>
                    </div>
                    <div className="wx_sharedom dom">
                        <div onClick={() => this.shareMsg("weixin")}>
                            <i className="gg_s02"></i>
                            <p>微信好友</p>
                        </div>
                    </div>
                    <div className="QQ_sharedom dom">
                        <div onClick={() => this.shareMsg("qq")}>
                            <i className="gg_s05"></i>
                            <p>QQ空间</p>
                        </div>
                    </div>
                    <div className="pic_sharedom dom">
                        <div onClick={() => this.shareMsg("pic")}>
                            <i className="gg_s04"></i>
                            <p>分享图</p>
                        </div>
                    </div>
                    <div className="close" onClick={() => this.props.parentFn()}></div>
                </div>
                <div className={sharePic ? "simpleTips" : "simpleTips share-hide"}>长按保存分享图</div>
            </div>

        )
    }
}

export default AnliDetailSwiper;
