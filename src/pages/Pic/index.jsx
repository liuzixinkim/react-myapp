import React, { Component } from 'react';
import { ljApi } from '../../api/server.js';
import "./index.scss";
import AnliInfoBigImg from "../../widget/AnliInfoBigImg";
import AnliFooterBar from "../../widget/AnliFooterBar";
import UserBaseInfor from "../../widget/UserBaseInfor";
import Loading from '../../widget/Loading/index';
import DialogAlert from "../../widget/DialogAlert";
import Utils from "../../utils/utils";
import BackBtn from "../../widget/backBtn";
import LazyImage from "../../widget/LazyImage";

class AnliInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showCompany: false,//是否显示公司详情
            showBigImg: false,//是否显示大图
            bigImg: null,//大图信息
            id: this.props.match.params.id,//当前案例ID
            anliDetailData: null,//案例详情
            companyInfo: null,//公司/设计师详情
            showMoreIntro: false, //显示全部公司介绍
            showMoreAnliIntro: false,//显示全部案例介绍
            tabIdx: 0,//tab选中
            loading: false,
            needFixed: false
        };

    }
    componentDidMount() {
        this.requireAnliDetail();
        window.addEventListener("scroll", this.scrollFixedNav, false);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.scrollFixedNav, false);
    }

    scrollFixedNav = () => {
        let scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
        if (scrollTop === 0 && this.state.needFixed) {
            this.setState({
                needFixed: false
            })
        }
        if (scrollTop !== 0 && !this.state.needFixed) {
            this.setState({ needFixed: true })
        }

    }

    //请求案例数据
    requireAnliDetail() {
        this.setState({
            loading: true
        })
        let _id = this.state.id;

        ljApi.anliInfo.get({ cacheKey: true, cacheHours: 2, id: _id },
            (state, datas, msg) => {
                let _pics = []
                datas.pics.map((v, k, items) => _pics.push(items[k]));
                if (state && state === 1) {
                    //console.log(this.state.shareImgUrl);
                    let url = window.location.href;
                    let shareUrl = encodeURIComponent(`http://supports.jiaju.sina.com.cn/app/haibao/2?text=${datas.name.length > 14 ? datas.name.slice(0, 14) : datas.name}&number=${datas.pi_num}&cover=${datas.cover}&url=${url}`);

                    //*****分享==》海报加载过慢，提前加载******
                    Utils.preLoadImg(`https://src.leju.com/api/resource/htmlToImage?width=750&url=${shareUrl}`, (url) => {
                        //console.log("url")
                        this.setState({
                            anliDetailData: Object.assign(datas, { shareHaibao: url }),
                            loading: false
                        })
                    })
                } else {
                    this.setState({
                        loading: false
                    })
                    DialogAlert.open({
                        alertTip: "加载失败，是否重新加载?",
                        confirmText: '重新加载',
                        cancelCallbackFn: () => {
                            this.props.history.goBack();
                        },
                        confirmCallbackFn: () => {
                            this.requireAnliDetail()
                        }
                    })
                }
            },
            (res) => {
                this.setState({
                    loading: false
                })
                DialogAlert.open({
                    alertTip: "加载失败，是否重新加载?",
                    confirmText: '重新加载',
                    cancelCallbackFn: () => {
                        this.props.history.goBack();
                    },
                    confirmCallbackFn: () => {
                        this.requireAnliDetail()
                    }
                })
            }
        )
    }

    //请求公司数据
    requireCompanyDetail(id, callback) {
        ljApi.designerDetail.get({ cacheKey: true, cacheHours: 2, id: id },
            (state, datas, msg) => {
                if (state && state === 1) {
                    this.setState({
                        companyInfo: datas
                    })
                    callback && callback();
                } else {
                    DialogAlert.open({
                        alertTip: "加载失败，是否重新加载?",
                        confirmText: '重新加载',
                        cancelCallbackFn: () => {
                            this.props.history.goBack();
                        },
                        confirmCallbackFn: () => {
                            this.requireAnliDetail()
                        }
                    })
                }
            },
            (res) => {
                DialogAlert.open({
                    alertTip: "加载失败，是否重新加载?",
                    confirmText: '重新加载',
                    cancelCallbackFn: () => {
                        this.props.history.goBack();
                    },
                    confirmCallbackFn: () => {
                        this.requireAnliDetail()
                    }
                })
            }
        )

    }

    //工期 日期 -> 天
    getDays = (s1, s2) => {
        var d1 = new Date(s2.replace(/-/g, '/'));
        var d2 = new Date(s1.replace(/-/g, '/'));
        var ms = Math.abs(d2.getTime() - d1.getTime());//毫秒
        var d = ms / 1000 / 60 / 60 / 24;//转为天
        return parseInt(d);
    }

    //展示公司/设计师信息
    showCompanyInfo = (id) => {
        let _this = this,
            { showCompany, companyInfo } = _this.state;
        //console.log(showCompany, companyInfo)
        if (!companyInfo) {
            _this.requireCompanyDetail(id, () => {
                _this.setState({
                    showCompany: true
                })
            })
        } else {
            _this.setState({
                showCompany: !showCompany
            })
        }

    }

    //展示大图
    onShowBigImg = (data, item) => {
        //console.log(data, item);
        this.setState({
            showBigImg: true,
            bigImg: { list: data, item: item, type: "pic" }
        })
    }

    //隐藏大图
    hideShowBigImg = () => {
        this.setState({
            showBigImg: false
        })
    }

    //限制文字长度
    LimitNumber = (txt, len) => {
        let str = txt
        if (str.length > len) {
            str = str.substr(0, len) + '... ';
        }
        return str
    }
    //显示更多公司介绍
    showMoreIntroCon = () => {
        this.setState({
            showMoreIntro: !this.state.showMoreIntro
        })
    }
    //显示更多案例介绍
    showMoreAnliIntroCon = () => {
        this.setState({
            showMoreAnliIntro: !this.state.showMoreAnliIntro
        })
    }

     //返回
     goBack = () => {
        if(this.props.history.length > 1){
            this.props.history.goBack();
        }else{
            this.props.history.push('/tuku');
        }
    }


    render() {
        let { showCompany, showBigImg, bigImg, anliDetailData, companyInfo, loading, showMoreAnliIntro, needFixed } = this.state;

        return (
            loading ? <Loading /> : anliDetailData ? (<div className="picDetailPage">
                {/* fixedBar */}
                <div className={needFixed ? "picDetailFixedNav" : "picDetailFixedNav hidden"}>
                    <img className='backBtn' onClick={()=>this.goBack()} src='http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/arrow2@2x.png' alt="img" />
                    <span className="title">{anliDetailData.name}</span>
                </div>

                {/* 封面图 */}
                <div className="coverBox">
                    <LazyImage
                        srcset={anliDetailData.cover ? anliDetailData.cover : 'http://src.leju.com/imp/imp/deal/86/ec/3/9767be68fc489a0491a5235ec4f_p24_mk24.png'}
                        src="http://src.leju.com/imp/imp/deal/86/ec/3/9767be68fc489a0491a5235ec4f_p24_mk24.png" />
                        <img className='backBtn' onClick={()=>this.goBack()} src='http://src.leju.com/imp/imp/deal/1d/47/6/a0adfbdda3817683717ef36c7af_p24_mk24.png' alt="img" />
                    <div className="coverText">
                        <div className="name">{anliDetailData.name}</div>
                    </div>
                </div>

                {/* 公司、设计师 */}
                <div className="company" onClick={() => this.showCompanyInfo(anliDetailData.user_id)}>
                    <img className="icon" src='http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/decoration2@3x.png' alt="img" />
                    <p>{anliDetailData.user_name}</p>
                    <img className="button" src={showCompany ? 'http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/Intro@3x.png' : 'http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/Intro_down@3x.png'} alt="img" />
                </div>
                {
                    (showCompany && companyInfo) ? (<UserBaseInfor className="companyBorder" detailData={companyInfo} type={anliDetailData.agent_type} />) : null
                }

                {/* 专辑介绍 */}
                {
                    anliDetailData.description ? <div className="moduleTitle" id="module0">
                        <div className="title">
                            <img src='http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/anli@3x.png' alt="img" />
                            <div>专辑介绍</div>
                        </div>
                        {
                            anliDetailData.description.length <= 90 ? <div className="info infoDesc">{anliDetailData.description}</div> : (
                                <div className="info infoDesc">{showMoreAnliIntro ? anliDetailData.description : this.LimitNumber(anliDetailData.description, 90)}<img onClick={() => this.showMoreAnliIntroCon()} className="button" src={showMoreAnliIntro ? 'http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/Intro@3x.png' : 'http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/Intro_down@3x.png'} alt="img" /></div>)
                        }
                    </div> : null
                }

                {/* 专辑美图 */}
                <div className="moduleTitle">
                    <div className="title">
                        <img src='http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/album@3x.png' alt="img" />
                        <div>专辑美图</div>
                    </div>
                    {
                        anliDetailData.pics && anliDetailData.pics.map((item, key) => {
                            return (
                                <div key={key} className="info " onClick={() => this.onShowBigImg(anliDetailData.pics, item)}>
                                    <div className="imgInfo">
                                        <LazyImage
                                            srcset={item.url ? item.url : 'http://src.leju.com/imp/imp/deal/86/ec/3/9767be68fc489a0491a5235ec4f_p24_mk24.png'}
                                            src="http://src.leju.com/imp/imp/deal/86/ec/3/9767be68fc489a0491a5235ec4f_p24_mk24.png" />
                                    </div>
                                    <div className="infoDesc">{item.description}</div>
                                </div>
                            )
                        })
                    }
                </div>

                {/* 大图轮播 */}
                {showBigImg ? <AnliInfoBigImg data={bigImg} parentFn={() => this.hideShowBigImg()} /> : null}

                {/* 底部bar */}
                <AnliFooterBar anliDetailData={anliDetailData} share />
            </div>) : null
        )
    }

}

export default AnliInfo;
