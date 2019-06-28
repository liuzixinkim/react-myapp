import React, { Component } from 'react';
import { ljApi } from '../../api/server.js';
import "./index.scss";
import AnliInfoBigImg from "../../widget/AnliInfoBigImg";
import AnliFooterBar from "../../widget/AnliFooterBar";
import UserBaseInfor from "../../widget/UserBaseInfor";
import Loading from '../../widget/Loading/index';
import DialogAlert from "../../widget/DialogAlert";
import Utils from "../../utils/utils";
import LazyImage from "../../widget/LazyImage";
import BackBtn from "../../widget/backBtn";

let spaceObj = {
    "餐厅": 'restaurant',
    '衣帽间': 'cloakroom',
    '户型图': 'graphics',
    '客厅': 'livingRoom',
    '卧室': 'bedroom',
    '玄关': 'porch',
    '阳台': 'balcony',
    '厨房': 'kitchen',
    '卫生间': 'toilet',
    '书房': 'studyroom',
    '儿童房': 'childrenroom',
    '楼梯': 'stairs',
    '其他': 'other'
}
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
            loading: false,//加载中
            needFixed: false,
            fixedAreaHeight: []
        };
        this.lazyLoad = null;

    }
    componentDidMount() {
        this.requireAnliDetail();
        window.addEventListener("scroll", this.scrollFixedNav, false);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.scrollFixedNav, false);
    }

    //fixedNav
    scrollFixedNav = () => {
        //let top = (document.getElementById("tabBox") && document.getElementById("tabBox").offsetTop);
        let { fixedAreaHeight } = this.state;
        fixedAreaHeight.length <= 0 && this.getAreas();
        let scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
        this.getAreaIndex(scrollTop);
        //console.log(scrollTop, this.state.needFixed)
        if (scrollTop === 0 && this.state.needFixed) {
            this.setState({
                needFixed: false
            })

        }
        if (scrollTop !== 0 && !this.state.needFixed) {
            this.setState({ needFixed: true })
        }

    }

    //横向scroll位置重置
    resetTabLeft = () => {
        let { tabIdx } = this.state;
        let docWidth = document.documentElement.clientWidth || document.body.clientWidth;
        //左侧按钮所占位置parseInt(docWidth*100/750*0.74)
        let left = document.getElementById("tabIdx" + tabIdx) && document.getElementById("tabIdx" + tabIdx).offsetLeft - parseInt(docWidth / 750 * 74);
        //console.log("left", left);
        if (document.getElementById("anliDetailFixedNavScroll")) {
            document.getElementById("anliDetailFixedNavScroll").scrollTo(left, 0);
        }

    }

    //当前选中第几个tab
    getAreaIndex = (scrollTop) => {
        let { fixedAreaHeight, tabIdx } = this.state;
        for (let i = 0; i < fixedAreaHeight.length; i++) {
            if (scrollTop > fixedAreaHeight[i].start && scrollTop < fixedAreaHeight[i].end) {
                if (i === tabIdx) { return; }
                this.setState({
                    tabIdx: i
                })
                this.resetTabLeft();
            }
        }
    }

    //竖向滚动每个区域临界点
    getAreas = () => {
        let { anliDetailData } = this.state,
            navTop = document.getElementById("tabBox") && document.getElementById("tabBox").offsetHeight;

        //console.log("navTop", navTop)

        if (anliDetailData && anliDetailData.pics) {
            if (anliDetailData.pics.length <= 0) return;
            this.setState({
                fixedAreaHeight: anliDetailData.pics.concat(["介绍"]).map((item, index) => {
                    let start = document.getElementById("module" + index) && document.getElementById("module" + index).offsetTop - navTop,
                        end = document.getElementById("module" + index) && document.getElementById("module" + index).offsetHeight + start;
                    return {
                        start: start,
                        end: end
                    }
                })
            })
        }
    }

    //请求案例数据
    requireAnliDetail(fn) {
        this.setState({
            loading: true
        })
        let _id = this.state.id;

        ljApi.anliInfo.get({ cacheKey: true,  cacheHours: 2,id: _id },
            (state, datas, msg) => {
                let _pics = []
                datas.pics.map((v, k, items) => _pics.push(items[k]))
                if (state && state === 1) {
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

    //锚点滚动
    scrollToAnchor = (k) => {
        document.getElementById("module" + k).scrollIntoView();
        this.setState({
            tabIdx: k
        })
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
            bigImg: { list: data, item: item }
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

    tabRenderItem = (anliDetailData, tabIdx, needId) => {
        return (
            anliDetailData.pics.length > 0 ? [{ name: '介绍' }].concat(anliDetailData.pics).map((v, k) => (
                <li id={needId ? 'tabIdx' + k : ''} className={tabIdx === k ? "active" : ''} key={k}><span onClick={() => this.scrollToAnchor(k)}>{v.name}</span></li>
            )) : null
        )
    }



    render() {
        let { showCompany, showBigImg, bigImg, anliDetailData, companyInfo, loading, showMoreAnliIntro, tabIdx, needFixed } = this.state;

        return (
            loading ? <Loading /> : (
                anliDetailData ? (<div className="anliDetailPage">
                    {/* fixedTabbar */}
                    <div className={needFixed ? "anliDetailFixedNav" : "anliDetailFixedNav hidden"}>
                        <div className="tabBox">
                            <img className='backBtn' onClick={()=>this.goBack()} src='http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/arrow2@2x.png' alt="img" />
                            <ul id="anliDetailFixedNavScroll">
                                {this.tabRenderItem(anliDetailData, tabIdx, true)}
                            </ul>
                        </div>
                    </div>

                    {/* 封面图 */}
                    <div className="coverBox">
                        <LazyImage
                            srcset={anliDetailData.cover ? anliDetailData.cover : 'http://src.leju.com/imp/imp/deal/86/ec/3/9767be68fc489a0491a5235ec4f_p24_mk24.png'}
                            src="http://src.leju.com/imp/imp/deal/86/ec/3/9767be68fc489a0491a5235ec4f_p24_mk24.png" />
                            <img className='backBtn' onClick={()=>this.goBack()} src='http://src.leju.com/imp/imp/deal/1d/47/6/a0adfbdda3817683717ef36c7af_p24_mk24.png' alt="img" />
                        <div className="coverText">
                            <div className="label">
                                {anliDetailData.house_style_name ? <span className="label">{anliDetailData.house_style_name}/</span> : null}
                                {anliDetailData.style_name ? <span className="label">{anliDetailData.style_name}/</span> : null}
                                {anliDetailData.area && anliDetailData.area !== 0.00 ? (<span className="label">{anliDetailData.area}㎡</span>) : null}

                            </div>
                            <div className="name">{anliDetailData.name}</div>
                        </div>
                    </div>

                    {/* 公司 */}
                    <div className="company" onClick={() => this.showCompanyInfo(anliDetailData.user_id)}>
                        <img className="icon" src='http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/decoration2@3x.png' alt="img" />
                        <p>{anliDetailData.user_name}</p>
                        <img className="button" src={showCompany ? 'http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/Intro@3x.png' : 'http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/Intro_down@3x.png'} alt="img" />
                    </div>
                    {
                        (showCompany && companyInfo) ? (<UserBaseInfor className="companyBorder" detailData={companyInfo} type={anliDetailData.agent_type} />) : null
                    }
                    {/* 价格工期 */}
                    <div className="price">
                        {anliDetailData.price !== 0.00 ?
                            (<div>
                                <img className="icon" src='http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/money@3x.png' alt="img" />
                                <p className="desc">金额</p>
                                <p className="number">{anliDetailData.price}万</p>
                            </div>) : null
                        }
                        {anliDetailData.time_limit ?
                            (<div className="time">
                                <img className="icon" src='http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/calendar@3x.png' alt="img" />
                                <p className="desc">工期</p>
                                <p className="number">{this.getDays(anliDetailData.time_limit[0], anliDetailData.time_limit[1])}天</p>
                            </div>) : null
                        }
                    </div>

                    {/* tabBox */}
                    <div className="tabBox" id="tabBox">
                        <ul>
                            {this.tabRenderItem(anliDetailData, tabIdx)}
                        </ul>
                    </div>

                    {/* 案例介绍 */}
                    <div className="moduleTitle" id="module0">
                        <div className="title">
                            <img src='http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/anli@3x.png' alt="img" />
                            <div>案例介绍</div>
                        </div>
                        {
                            anliDetailData.description.length <= 90 ? <div className="info infoDesc">{anliDetailData.description}</div> : (
                                <div className="info infoDesc">{showMoreAnliIntro ? anliDetailData.description : this.LimitNumber(anliDetailData.description, 90)}<img onClick={() => this.showMoreAnliIntroCon()} className="button" src={showMoreAnliIntro ? 'http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/Intro@3x.png' : 'http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/Intro_down@3x.png'} alt="img" /></div>)
                        }
                    </div>

                    {/* 其他空间 */}
                    {anliDetailData.pics.length > 0 ? anliDetailData.pics.map((v, k) => (
                        <div ref={v.name} key={k} id={'module' + parseInt(k + 1)} className="moduleTitle">
                            <div className="title">
                                {spaceObj.hasOwnProperty(v.name) ? <img src={`http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/${spaceObj[v.name]}@3x.png`} alt="img" /> : null}
                                <div>{v.name}</div>
                            </div>

                            <div className="info ">
                                <div className="imgInfo">
                                    {
                                        v.data.map((item, key) => (
                                            <LazyImage key={key} onClick={() => this.onShowBigImg(anliDetailData.pics, item)} classes="img"
                                                srcset={item.url ? item.url : 'http://src.leju.com/imp/imp/deal/86/ec/3/9767be68fc489a0491a5235ec4f_p24_mk24.png'}
                                                src="http://src.leju.com/imp/imp/deal/86/ec/3/9767be68fc489a0491a5235ec4f_p24_mk24.png" />
                                        ))
                                    }
                                </div>
                                <div className="infoDesc">{v.data[0].description}</div>
                            </div>
                        </div>
                    )) : null}

                    {/* 大图轮播 */}
                    {showBigImg ? <AnliInfoBigImg data={bigImg} parentFn={() => this.hideShowBigImg()} /> : null}

                    {/* 底部bar */}
                    <AnliFooterBar anliDetailData={anliDetailData} share />
                </div>) : null))
    }

}

export default AnliInfo;
