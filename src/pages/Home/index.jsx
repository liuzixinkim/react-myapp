import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ljApi } from '../../api/server.js';
import * as Enums from '../../utils/enums';
import { setHomeData, setHomeList } from '../../reducers/Home/action';
import { setCityData } from '../../reducers/Citys/action';
import MyHeaderBar from '../../widget/MyHeaderBar/index';
import AnliListImgText from '../../widget/AnliListImgText/index';
import TabBarItem from '../../widget/TabBarItem/index';
import TabRowItem from '../../widget/TabRowItem/index';
import Loading from '../../widget/Loading/index';
import NoAnli from '../../widget/EmptyList/NoAnli.jsx';
import BottomBar from "../../widget/BottomBar";
import './index.scss';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            itemInfo: {}//点击头像显示详情内容
        };
    }

    //挂载前
    componentWillMount() {
        if (this.props.homeData.anliList.length == 0 ||
            this.props.citysData.currentCity.id != 99) {

            this.requestData();
        }
    }
    //会在组件挂载后
    componentDidMount() {
        window.addEventListener('scroll', this.getMoreHand, false)
    }


    //会在调用 render 方法之前调用, 并且在初始挂载及后续更新时都会被调用
    // static getDerivedStateFromProps(props, state){
    //   return state;
    // }
    //会在渲染执行之前被调用
    //shouldComponentUpdate(nextProps, nextState){}
    //会在更新后会被立即调用
    //componentDidUpdate(prevProps, prevState, snapshot){}
    //会在组件卸载及销毁之前直接调用
    componentWillUnmount() {

        window.removeEventListener("scroll", this.getMoreHand, false);
    }

    getMoreHand = () => {
        //滚动条距离顶部的高度
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
            //当前页面的总高度
            scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight,
            //当前可视的页面高度
            clientHeight = document.body.clientWidth || document.documentElement.clientWidth;

        //页面滑动加载更多
        //距离顶部+当前高度 >=文档总高度 即代表滑动到底部 count++;
        if (scrollTop + clientHeight + 500 >= scrollHeight) {//每次滑动count加1
            this._onEndReached();
        } else if (scrollTop <= 0) {
            //alert("下拉刷新");
        }
    }

    //获取页面数据
    requestData = () => {
        this.requestAnliList();

        //获取案例首页导航信息接口
        this.requestAnliTabData();

        this.requestCityList();
    }

    //获取所有城市列表数据 
    async requestCityList() {
        ljApi.city.get({ cacheKey: true },
            (state, datas, msg) => {
                //console.log('city::'+JSON.stringify(datas))
                if (state && state == 1 && datas) {

                    this.props.setCityData({
                        allCityList: datas.all,
                        hotCityList: datas.hot
                    });
                } else {
                    //this.serverErrorAlert( '获取城市信息失败' )
                }
            },
            (res) => {
                //this.serverErrorAlert(  )
            })

    }

    //获取案例列表数据
    async requestAnliList() {
        //var url =`http://zx.jiaju.sina.com.cn/index.php?app=App&mod=Anli&act=list&c=99&s=99&h=99&p=99&a=99&page=2`;
        let pages = Object.assign({}, this.props.homeData.anliPages);

        //alert('PAGES22:'+JSON.stringify( this.props.homeData.anliPages ));

        //console.log('PAGES22:'+JSON.stringify( pages ));

        for (let p in pages) {
            if (Number(pages[p]) == 99 && p != 'page') {
                delete pages[p]
            }
        }


        let opts = { cacheKey: 'anliList', cacheHours: 2, 'opts': pages };
        if (this.props.homeData.refreshing) { opts.refresh = true; };

        this.setState({ loading: true });

        ljApi.anliList.get(opts,
            (state, datas, msg) => {
                //console.log('anliList1::'+JSON.stringify(datas))
                this.setState({ loading: false });
                if (state && state == 1) {
                    let anliData = []
                    let data = datas || []

                    if (this.props.homeData.loadingMore) {
                        anliData = this.props.homeData.anliList.concat(data)
                    } else {
                        anliData = data
                    }

                    //数组空 没有案例数据
                    let noAnli = false;
                    if (anliData && anliData.length == 0) { noAnli = true }

                    //加载到 底部没有更多数据了
                    let loadend = false;
                    if (data && data.length == 0 && pages.page > 1) { loadend = true; }

                    // let states = Object.assign({}, this.props.homeData, {
                    //             anliList:anliData,
                    //             refreshing: false, 
                    //             loadingMore:false, 
                    //             pageLoading:false,
                    //             noAnli:noAnli,
                    //             loadend:loadend,
                    //             //anliPages:pages
                    //           });

                    this.props.setHomeData({
                        anliList: anliData,
                        refreshing: false,
                        loadingMore: false,
                        pageLoading: false,
                        noAnli: noAnli,
                        loadend: loadend
                    });


                } else {
                    //this.serverErrorAlert( msg )
                    this.setState({ noAnli: true })
                }
            },
            (res) => {
                //alert('error:'+JSON.stringify( res ))
                this.setState({ noAnli: true });
                this.setState({ loading: false });
            })

    }

    //获取案例首页导航信息接口
    requestAnliTabData = () => {
        this.requestAnliTabDataServer();
    }

    //获取案例首页导航信息接口
    async requestAnliTabDataServer() {

        ljApi.anliTab.get({ cacheKey: true },
            (state, data, msg) => {
                if (state && state == 1) {
                    // console.log('anliTab::'+JSON.stringify(data))
                    this.setAnliTabData(data);
                } else {
                    //this.serverErrorAlert( msg )
                }
            },
            (res) => {
                //this.serverErrorAlert( )
            })
    }

    //更新案例 tab 数据到 state 
    setAnliTabData = (data) => {
        let defaultTab = this.props.homeData.defaultTab;
        //let {house_style, style, price, area} = data
        let house_style = data['house_style'] || []
        let style = data.style || []
        let price = data.price || []
        let area = data.area || []

        //加入 全部 到数组 头部
        house_style.unshift(defaultTab)
        style.unshift(defaultTab)
        price.unshift(defaultTab)
        area.unshift(defaultTab)

        this.props.setHomeData({
            house_style: house_style,
            style: style,
            price: price,
            area: area,
        }, 'modalTabData');

    }

    tabOnPress(p) {
        let { types, text, focused } = p;
        let tabBarItem = Object.assign([], this.props.homeData.tabBarItem)
        let newtabBarItem = tabBarItem.map((v, k, items) => (
            items[k] = Object.assign(v, {
                focused: (v.types == types ? !focused : false)
            })
        ))

        let currModalTab = this.props.homeData.modalTabData[types]

        if (!currModalTab || currModalTab.length == 0) {
            currModalTab = []
        }

        this.props.setHomeData({
            activeTab: types,
            showTabItem: !focused,
            tabBarItem: newtabBarItem,
            activeModalTabData: currModalTab
        });

    }

    //tab弹层中 筛选条件被选中
    tabItemOnPress = (p, activeTab) => {
        // alert( JSON.stringify( p ) );
        let enumText = this.props.homeData.defaultTabfocused;
        let pages = Object.assign({}, this.props.homeData.anliPages);
        let active = activeTab || this.props.homeData.activeTab; //当前选中的tab 选项
        let { id, name } = p;

        let tabBarItem = Object.assign([], this.props.homeData.tabBarItem)
        let newtabBarItem = tabBarItem.map((v, k, items) => (
            items[k] = Object.assign(v, {
                text: (v.types == active ? name == '全部' ? enumText[active].text : name : v.text)
            })
        ))

        if (active == 'house_style') { pages = Object.assign({}, pages, { h: id }) }
        if (active == 'style') { pages = Object.assign({}, pages, { s: id }) }
        if (active == 'price') { pages = Object.assign({}, pages, { p: id }) }
        if (active == 'area') { pages = Object.assign({}, pages, { a: id }) }
        pages = Object.assign({}, pages, { page: 1 })

        let defaultTabfocused = Object.assign({}, this.props.homeData.defaultTabfocused)
        let currentTab = Object.assign({}, defaultTabfocused[active])
        currentTab.focusedLabel = p

        defaultTabfocused[active] = currentTab

        // let states = Object.assign({}, this.props.homeData, { 
        //                                   tabBarItem: newtabBarItem, 
        //                                   defaultTabfocused:defaultTabfocused, 
        //                                   anliPages:pages,
        //                                   refreshing: true
        //                                 });

        // this.props.setHomeData( states );

        //console.log('PAGES1111111:'+JSON.stringify( pages ));


        //alert('PAGES2211:'+JSON.stringify( pages ));


        newtabBarItem = newtabBarItem.map((v, k, items) => (
            items[k] = Object.assign(v, { focused: false })
        ))
        //alert( JSON.stringify( pages))
        this.props.setHomeData({
            tabBarItem: newtabBarItem,
            defaultTabfocused: defaultTabfocused,
            anliPages: pages,
            showTabItem: false//关闭过滤层
            //refreshing: true
        });


        this.props.homeData.anliPages = pages;//修复页面不刷新 不得以办法
        //alert('PAGES22:'+JSON.stringify( this.props.homeData.anliPages ));

        this._onRefresh();

        //this.closeTabModal();

    }
    //关闭tab 弹层
    closeTabModal() {
        let tabBarItem = Object.assign([], this.props.homeData.tabBarItem)
        let newtabBarItem = tabBarItem.map((v, k, items) => (
            items[k] = Object.assign(v, { focused: false })
        ))

        this.props.setHomeData({ showTabItem: false, tabBarItem: newtabBarItem });
    }

    //根据筛选添加刷新数据
    _onRefresh = (refresh) => {
        //正在请求数据 避免多次发送请求
        if (this.state.loading || this.props.homeData.loadingMore || this.props.homeData.refreshing) { return false }
        if (refresh) {
            let pages = Object.assign({}, this.props.homeData.anliPages, { page: 1 });
            this.props.setHomeData({
                anliPages: pages,
                refreshing: true
            });
        }

        this.requestAnliList()
    }

    //列表 滑动加载更多
    _onEndReached = () => {
        //正在请求数据 避免多次发送请求
        if (this.props.homeData.loadingMore || this.props.homeData.refreshing || this.props.homeData.loadend) { return false }
        let pages = Object.assign({}, this.props.homeData.anliPages)
        //页码 + 1
        pages.page = pages.page + 1;

        this.props.setHomeData({ anliPages: pages, loadingMore: true });

        this.requestAnliList()
    }


    //点击案例详情头像 跳转到详情页面：id
    pressToInfo = (item, infoItem) => {
        //agent_type
        this.props.history.push({ pathname: '/info/', state: item })
        //this.props.history.push('/info/'+item.id)
        //this.props.history.push({ pathname : '/info', query : { id: item.id} })

    }

    //点击首页 城市 跳转 城市列表
    indexLeftBtnOnPress = () => {
        //this.props.navigation.navigate('CityList', {
        //city:'全国',
        //indexToCityBack:this.refreshAboutCitys
        //})
        //this.context.router('/citys');
        this.props.history.push('/citys/')
    }
    //导航栏 左侧按钮
    backBtnRender = () => {
        return (
            <div className="city-btn-wrap" onClick={() => this.indexLeftBtnOnPress()}>
                <label className="city-txt" >
                    {this.props.citysData.currentCity.name}
                </label>
            </div>
        )
    }


    render() {
        let { tabBarItem, anliList, loadend, loadingMore } = this.props.homeData;
        return (
            
            this.state.loading && !loadingMore ? <Loading /> : <div className="index-list-wrap">
                {/* <MyHeaderBar
                    titleText="石榴美图"
                    backBtn={this.backBtnRender} /> */}

                <div className="header-bar-wrap">

                    <div className="city-btn-wrap" onClick={() => this.indexLeftBtnOnPress()}>
                        <label className="city-txt" >
                            {this.props.citysData.currentCity.name}
                        </label>
                    </div>
                    <div className="tagsMenu">
                        <a href="http://jiaju.leju.com">推荐</a>
                        <span>/</span>
                        <a className="active" href="javascript:;">美图</a>
                        <span>/</span>
                        <a href="http://jiaju.leju.com/shipin">视频</a>
                    </div>
                </div>

                {/*案例筛选tab start */}
                <div className="tabWrap">
                    {tabBarItem.map((v, k) => (
                        <TabBarItem
                            key={k}
                            tabOnPress={() => this.tabOnPress(v)}
                            focused={v.focused}
                            tabText={v.text}
                        />
                    ))}
                </div>
                {/*案例筛选tab end */}

                {/*案例筛选标签弹层 start */}
                {this.props.homeData.showTabItem ? (
                    <div className="modalWrap" >
                        <div className="modalMask" onClick={() => this.closeTabModal()}></div>
                        <div className="modalInner">
                            <TabRowItem
                                modalData={this.props.homeData.activeModalTabData}
                                activeTab={this.props.homeData.activeTab}
                                tabLabelItemOnPress={this.tabItemOnPress}
                                focused={this.props.homeData.defaultTabfocused[this.props.homeData.activeTab].focusedLabel} />
                        </div>

                    </div>
                ) : ''}

                {/*案例筛选标签弹层 end */}

                {/*案例列表start*/}
                {anliList && anliList.length > 0
                    ? anliList.map((item, index) => {
                        return (
                            <AnliListImgText
                                key={index}
                                itemData={item}
                                itemInfo={this.state.itemInfo}
                                pressInfo={this.pressInfo}
                                pressToInfo={this.pressToInfo}>
                            </AnliListImgText>
                        )
                    })
                    : ''}
                {loadingMore ? <div className="load-state">加载中...</div> : null}
                {loadend ? <div className="load-state">暂无更多</div> : null}

                {/*没有案例 start */}
                {anliList && anliList.length == 0 ? <NoAnli /> : ""}
                {/*没有案例 end */}
                <BottomBar />
            </div>

        )
    }
}


export default connect(state => ({
    homeData: state.homeData,
    citysData: state.citysData
}), {
        setHomeData,
        setHomeList,
        setCityData
    })(Home);

