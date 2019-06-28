/**
 * KanTuZhuangXiu React Native App
 * @flow
 * enums: 
 * description: 
 * 页面所有常量值
 * 数据枚举值
 */

/*
	注：所有 window 全局 参数这里 备注：
	window.storage          			//初始化 数据仓库的 全局 名称
	window.currCityJson     			//当前 城市 JSON信息 {id:'', name:'',}
	window.currCityRefreshState   // 城市改变后 需要刷新 状态 { ompanyRefresh:false, designerRefsh:false }
  window.userInfoJson           //登录后 个人信息 全局可用
  window.appVersionJson					//当前软件的版本信息
  window.connectionInfo					//当前软件的网络状态
  window.deviceInfoJson         //当前设备信息 {deviceID:'',deviceUniqueID:'', bundleID:'', appVersion:'', phoneNumber:'', 'deviceName':'' }

*/

window.deviceInfoJson = {};
window.currCityRefreshState = { ompanyRefresh:false, designerRefsh:false };

//页面加载 通用提示文字 
export const LOADING_TEXT = {
    loading:'加载中...',
    loadend:"加载完成，没有更多数据",
    reload:'请求超时 请重新加载'
};

//本机 程序代码 APP版本号
export const appLocalVersion = window.appVersionJson = {
		    			localAndroid:{
								currentv:'1.0',//当前版本
								h5v:'1.0',     //当前h5版本
								desText:'大牌设计师为你做设计\t\n无论你在哪里, 设计都能进行到',
								downLoadUri:'http://jiaju.sina.com.cn/zt/zxxiazai',
							},
							localApple:{
								currentv:'1.0',//当前版本
								h5v:'1.0',     //当前h5版本
								desText:'大牌设计师为你做设计\t\n无论你在哪里, 设计都能进行到',
								downLoadUri:'http://jiaju.sina.com.cn/zt/zxxiazai',
							},
							//第三方登录
							divideLogin:{
								android:[],//['0','1'],//0：QQ 1: SINA  2: WEIXIN
								ios:[],//['0','1']
							},
							shareboard:{
								android:{
									text:'看图装修是新浪家居出品的一站式装修平台,海量装修案例等您来选.',//分享描述内容
									//img:'http://src.leju.com/imp/imp/deal/89/7e/5/eac5227f3ed2bfbbca35caa332f_p24_mk24.png',//分享图片
									//img:'http://src.leju.com/imp/imp/deal/1e/68/f/3dc30bb9a367fcb3463958429d6_p24_mk24.jpg',//分享图片
									img:'http://src.leju.com/imp/imp/deal/1d/6b/0/61f0fc46ac76e4b5749c869e207_p24_mk24.png',
									link:'http://jiaju.sina.com.cn/zt/zxxiazai',//分享链接
									title:'装修就来看图装修',//分享标题
									list:[],//[0,1,2,3], //0：QQ 1: SINA  2: WEIXIN 3:朋友圈 4: QQ空间
								},
								ios:{
									text:'看图装修是新浪家居出品的一站式装修平台,海量装修案例等您来选.',//分享描述内容
									//img:'http://src.leju.com/imp/imp/deal/89/7e/5/eac5227f3ed2bfbbca35caa332f_p24_mk24.png',//分享图片
									//img:'http://src.leju.com/imp/imp/deal/1e/68/f/3dc30bb9a367fcb3463958429d6_p24_mk24.jpg',//分享图片
									img:'http://src.leju.com/imp/imp/deal/1d/6b/0/61f0fc46ac76e4b5749c869e207_p24_mk24.png',
									link:'http://jiaju.sina.com.cn/zt/zxxiazai',//分享链接
									title:'装修就来看图装修',//分享标题
									list:[],//[0,1,2,3], 
								}
							}
}

//首页 常量参数
export const homeListParams = {
			defaultTab: {id:'99', name:'全部'},//如果tab 接口没有返回数据 默认给显示全部
			defaultTabfocused:{//每个tab 选中的label 
				house_style:{text:'户型', focusedLabel:{id:'99', name:'全部'}},
				style:{text:'风格', focusedLabel:{id:'99', name:'全部'}},
				price:{text:'价格', focusedLabel:{id:'99', name:'全部'}}, 
				area:{text:'面积', focusedLabel:{id:'99', name:'全部'}}
			},
			tabBarItem:[//tab栏数据与状态
				{ text:'户型', types:'house_style', 'focused':false},
				{ text:'风格', types:'style', 'focused':false},
				{ text:'价位', types:'price', 'focused':false},
				{ text:'面积', types:'area', 'focused':false},
			],
			anliPages:{// 案例请求 页码 参数
				c:window.currCityJson && window.currCityJson.id || 99, // 99: 默认是全 城市 编号
				s:99, // 风格
				h:99, // 户型
				p:99, // 价格
				a:99, // 面积
				page:1// 页数
			}
}


//装修公司 常量参数
export const companyListParams = {
			defaultTab: {id:'99', name:'全部'},//如果tab 接口没有返回数据 默认给显示全部
			defaultTabfocused:{//每个tab 选中的label 
				type:{text:'公司类型',focusedLabel:{id:'99',name:'全部'}},
				sevice_txt:{text:'服务内容',focusedLabel:{id:'99',name:'全部'}}
			},
			tabBarItem:[//tab栏数据与状态
				{ text:'公司类型',types:'type',focused:false},
				{ text:'服务内容',types:'sevice_txt',focused:false},
			],
			companyPages:{// 案例请求 页码 参数
				c:window.currCityJson && window.currCityJson.id || 99, //城市
				t:99, //公司类型
				st:99, //服务内容
				page:1, // 页数
			}
}

//设计师 常量参数
export const designerListParams = {
			defaultTab: {id:'99', name:'全部'},//如果tab 接口没有返回数据 默认给显示全部
			defaultTabfocused:{//每个tab 选中的label 
				service_items:{text:'服务',focusedLabel:{id:'99',name:'全部'}},
				levels:{text:'级别',focusedLabel:{id:'99',name:'全部'}},
				styles:{text:'风格',focusedLabel:{id:'99',name:'全部'}},
				charge_standards:{text:'收费',focusedLabel:{id:'99',name:'全部'}},
			},
			tabBarItem:[//tab栏数据与状态
				{text:'服务',types:'service_items',focused:false},
				{text:'级别',types:'levels',focused:false},
				{text:'风格',types:'styles',focused:false},
				{text:'收费',types:'charge_standards',focused:false},
			],
			designerPages:{// 案例请求 页码 参数
				c:window.currCityJson && window.currCityJson.id || 99, //城市
				s:99,// 设计风格
				si:99,// 设计服务
				l:99,// 设计级别
				cs:99,// 收费标准
				page:1// 页数
			}
}

/*
 * FlatList 组件 viewabilityConfig 属性 配置参数
*/
export const VIEWABILITY_CONFIG = {
	  minimumViewTime: 3000,
	  viewAreaCoveragePercentThreshold: 100,
	  waitForInteraction: true,
};

//北京地区经纬度
export const defaultPos = window.currCityJson = {
		"id": 99,
    "name": "全国",//'北京',
    "initial": "quanguo",
		"mocked":false,
		//timestamp:new Date().getTime(),
		"coords":{
	  	"longitude":"",//"116.3",
	  	"latitude":"",//"39.90",
		}
	};

//表单验证 常用正则
export const validateReg = {
			mobile : /^1\d{10}$/,
			//email : /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
			email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,

}

//页面所有监听事件 的 key  统一管理 方便查找
export const eventEmitterKeys = {
			//登录后个人中心 数据改变
			"userInfoJson":"userInfoJsonKey",
			//版本信息数据更新后 触发
			"appVersionJson":"appVersionJsonKey",
			//第三方显示与版本接口相关
			"appVersionJson2":"appVersionJsonKey2",

			//当前城市ID 更新 触发 页面依赖城市 ID 监听
      "currCityJson":"currCityJsonKey", 
      //装修公司和设计师列tab是否被点击
      "isCompanyClick":"isCompanyClickKey",
      "isDesignerClick":"isDesignerClickKey"
}

//页面所有 AsyncStorage 存储用到的 key 统一管理
export const storageKeys = {
	    //当前城市定位信息
			"currCityPosition":"geolocationPositionKey",

	    //当前城市ID信息
			"currCityJson":"currCityJsonKey", 

			//最近访问过的城市
			"lastVisitCity":"lastVisitCityKey",

			//城市列表接口返回所有城市数据
			"allCityJson":"allCityJsonKey",

			//登录后 个人信息 保存
			"userInfoJson":"userInfoJsonKey",
			
			//当前软件的版本信息
      "appVersionJson":"appVersionJsonKey",
      


};
