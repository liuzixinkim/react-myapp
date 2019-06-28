import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { ljApi } from '../../api/server.js';


import MyHeaderBar from '../../widget/MyHeaderBar/index';
import AnliListImgText from '../../widget/AnliListImgText/index';

import UserBaseInfor from '../../widget/UserBaseInfor/index';

import PicListImgText from '../../widget/PicListImgText/index';

import AnliFooterBar from '../../widget/AnliFooterBar/index';

import DialogAlert from '../../widget/DialogAlert/index';

import Loading from '../../widget/Loading/index';

import Utils from "../../utils/utils";

import './index.scss';

import BackBtn from "../../widget/backBtn";

export default class Designer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agent_type: this.props.match.params.agenttype, //agent_type == "3" 设计师， 其他装修公司

            id: this.props.match.params.id,

            // 10022 设计师
            // 10104 装修公司

            detailData: null, //详情

            showList: false,//是否显示 列表

            currentTab: 'anli', //当前tab

            showCaseTab: false, //是否显示 装修案例 tab
            showPicTab: false, //是否显示 装修美图 tab

            anliNim: 0, //装修案例 条数
            picNum: 0, //装修美图 条数

            casePage: 1,//装修案例 page
            picPage: 1, //装修美图 page

            anliList: [],//装修案例 数据
            picList: [],//装修美图 数据

            isLoadingMore: true, //是否正在加载

            loadingBoole: false, //是否显示 '加载中...' 文字
            noMoreBoole: false, //是否显示 '暂无更多' 文字

            showAllDes: false, //是否展开'个人简介'

            loading: false

        };
    }

    componentDidMount() {
        //请求详情页面
        this.requireDesignerDetail()
        // 加载更多
        this._scrollLoadMore()
    }

    componentWillUnmount() {

        window.removeEventListener("scroll", this.loadMoreFn, false);
    }


    //请求详情页面
    requireDesignerDetail = () => {

        this.setState({
            loading: true
        })
        let _id = this.state.id;

        ljApi.designerDetail.get({ id: _id, cacheKey: true, cacheHours: 2 }, (state, datas, msg) => {

            this.setState({
                loading: false,
            })

            if (state && state == 1) {

                this.setState({
                    detailData: datas
                })

                let option = { currentTab: this.state.currentTab };

                if (datas.anli_num == 0 && datas.album_num == 0) {

                    option.showList = false;
                    option.showAllDes = true;

                } else {

                    option.showList = true;
                    option.showAllDes = false;
                    option.anliNum = datas.anli_num;
                    option.picNum = datas.album_num;

                    if (datas.anli_num == 0) {
                        option.showCaseTab = false;
                        option.showPicTab = true;
                        option.currentTab = 'pic';
                    } else if (datas.album_num == 0) {
                        option.showCaseTab = true;
                        option.showPicTab = false;
                        option.currentTab = 'anli';
                    } else {
                        option.showCaseTab = true;
                        option.showPicTab = true;
                    }

                    this.requireListData(option.currentTab, 1)

                }

                this.setState({
                    ...option
                })

            } else {
                DialogAlert.open({
                    alertTip: "加载失败，是否重新加载?",
                    confirmText: '重新加载',
                    cancelCallbackFn: () => {
                        window.history.back();
                    },
                    confirmCallbackFn: () => {
                        this.requireDesignerDetail()
                    }
                })

            }
        }, (res) => {
            let _this = this;
            DialogAlert.open({
                alertTip: "加载失败，是否重新加载?",
                confirmText: '重新加载',
                cancelCallbackFn: () => {
                    window.history.back();
                },
                confirmCallbackFn: () => {
                    this.requireDesignerDetail()
                }
            })
        }
        )
    }

    //获取列表数据
    requireListData(type, page) {

        let pages = {
            id: this.state.id,
            page: page
        }
        let _cacheKey = type == 'anli' ? 'designerDetailAnli' : 'designerDetailPic';

        let opts = { cacheKey: true, cacheHours: 2, opts: pages };

        this.setState({
            loadingBoole: true
        })

        ljApi[_cacheKey].get(opts, (state, datas, msg) => {
            if (state && state == 1) {

                this.setState({
                    isLoadingMore: false,
                    loadingBoole: false
                })

                if (datas.length == 0) {
                    this.setState({
                        noMoreBoole: true
                    })
                    return;
                }

                let _dataList = type == 'anli' ? this.state.anliList : this.state.picList

                if (type == 'anli') {
                    this.setState({
                        anliList: _dataList.concat(datas)
                    })
                } else {
                    this.setState({
                        picList: _dataList.concat(datas)
                    })
                }

            } else {
                this.setState({
                    isLoadingMore: false,
                    loadingBoole: false,
                    noMoreBoole: false
                })
            }
        }, (res) => {
            this.setState({
                isLoadingMore: false,
                loadingBoole: false,
                noMoreBoole: false
            })
        }
        )
    }

    loadMoreFn = () => {
        //获取可视区高度
        let _clientHeight = document.documentElement.clientHeight;
         //如果没显示列表 或者 正在加载中 就return
         if (!this.state.showList || this.state.loadingBoole) { return; }

         let _scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
         //获取页面高度
         let _bodyHeight = document.body.scrollHeight || document.documentElement.scrollHeight;

         if (!this.state.isLoadingMore && _clientHeight + _scrollTop >= _bodyHeight - 500 && !this.state.noMoreBoole) {

             this.setState({
                 loadingBoole: true
             })

             let _type = this.state.currentTab;
             let _page = 1;

             if (_type == 'anli') {
                 _page = this.state.casePage + 1;
                 this.setState({
                     casePage: _page,
                     isLoadingMore: true
                 })

             } else if (_type == 'pic') {
                 _page = this.state.picPage + 1;
                 this.setState({
                     picPage: _page,
                     isLoadingMore: true
                 })
             }

             this.requireListData(_type, _page)

         } else {
             return false;
         }
    }
    //滚动加载更多
    _scrollLoadMore() {
        
        window.addEventListener('scroll', this.loadMoreFn, false)
    }


    // tab切换
    toggleTab(e) {



        if (this.state.isLoadingMore) return;

        let _type = e.currentTarget.getAttribute('data-type');

        this.setState({
            noMoreBoole: false,
            loadingBoole: true,
            casePage: 1,
            picPage: 1,
            anliList: [],
            picList: [],
            currentTab: _type
        })

        this.requireListData(_type, 1)

    }

    //导航栏 左侧按钮
    backBtnRender = () => {
        return (
            <img className='backBtn' onClick={()=>this.goBack()} src='http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/arrow2@2x.png' alt="img" />
        )
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
        return (
            this.state.loading ? <Loading /> : (this.state.detailData ? (<div className="App designDetailBox">

                {<MyHeaderBar
                    titleText={this.state.detailData.real_name}
                    backBtn={this.backBtnRender} />}

                {/*设计师基本信息 s */}
                <UserBaseInfor detailData={this.state.detailData} type={this.state.agent_type} showAllDes={this.state.showAllDes}></UserBaseInfor>
                {/*设计师基本信息 e */}

                {/*装修案例 装修美图 s */}
                {
                    this.state.showList ?
                        <div className="list-wrap">

                            <div className="list-tab">
                                {
                                    this.state.showCaseTab ?
                                        <span onClick={(e) => this.toggleTab(e)} data-type='anli' className={this.state.currentTab == 'anli' ? 'point' : ''} >装修案例({this.state.anliNum})</span>
                                        :
                                        null
                                }
                                {
                                    this.state.showPicTab ?
                                        <span onClick={(e) => this.toggleTab(e)} data-type='pic' className={this.state.currentTab == 'pic' ? 'point' : ''} >装修美图({this.state.picNum})</span>
                                        :
                                        null
                                }
                            </div>


                            <div className="list-content">
                                {
                                    this.state.currentTab == 'anli' ?
                                        this.state.anliList.map((item, index) => (
                                            <AnliListImgText
                                                key={index}
                                                itemData={item}>
                                            </AnliListImgText>
                                        ))
                                        :
                                        this.state.picList.map((item, index) => (
                                            <PicListImgText
                                                key={index}
                                                itemData={item}>
                                            </PicListImgText>
                                        ))
                                }

                                {this.state.loadingBoole ? <div className="load-state">加载中...</div> : null}
                                {this.state.noMoreBoole ? <div className="load-state">暂无更多</div> : null}

                            </div>
                        </div>
                        :
                        null
                }

                {/*装修案例 装修美图 e */}


                <AnliFooterBar anliDetailData={this.state.detailData}></AnliFooterBar>

            </div>) : null)
        );
    }

}


