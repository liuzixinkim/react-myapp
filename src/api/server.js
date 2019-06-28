/**
 * 请求服务数据
 *
 */

//import { devApi }  from './devData'

let ljApi =  {}

//serviceName
let Api = function (opt) {
    if (!opt) return;
    if (!opt.url) {
        alert("url lost");
    } else {
        this.url = opt.url;
    }
};

 Api.prototype = {
    /**
     * http get 请求简单封装
     * @opts get 请求的URL 传递参数 没有参数默认{}
     * @param url 请求的URL
     * @param successCallback 请求成功回调
     * @param failCallback 请求失败回调
     */
    get: function (jsonData, successCallback, failCallback) {
        if (jsonData.cacheKey&&!jsonData.refresh){//如果缓存 先从本机获取
           // alert(3)
            this._getLoacalStorage(jsonData, successCallback, failCallback);
        } else {// 网络请求数据
            this._get(jsonData, successCallback, failCallback);
        }
    },
    //网络获取数据
    _get: function ( jsonData, successCallback, failCallback ) {

        let opts = jsonData.opts ? jsonData.opts : jsonData;
        let url = this.url;
        let optKeys = Object.keys(opts)

        if (optKeys && optKeys.length > 0){
            let uri = '&';
            optKeys.map(function(key) {
                if (key != 'cacheKey' && key != 'refresh' && key != 'cacheHours'){
                    uri = uri+key+'='+opts[key]+'&';
                }
            });
            uri=uri.substring(0,uri.length-1);
            url = url+uri;
        }

        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
            // Alert.alert( '提示', (JSON.stringify(responseJson)),
            //  [{text: '确定', onPress: () =>{} }])
                let res = responseJson//JSON.parse(responseJson);
                // 我们服务{success:{}, data:{}, msg:{} }
                //高德接口服务{status:{}, regeocode:{}, info:{} }
                //数据成功 并且 有 缓存要求  存储到本地
                if (jsonData.cacheKey && res && res.success == 1 && res.data && !this.isEmptyObject(res.data) ) {
                    if( localStorage ){
                        let keys = this._getKeys( jsonData ),
                            ts = new Date().getTime(),
                            str = JSON.stringify( {'ts':ts, 'data': res });
                        localStorage.setItem(keys, str );
                    }
                }
                successCallback(res.success||res.status,  res.data||res.regeocode, res.msg||res.info);
            })
            .catch((err) => {
                failCallback(err);
            });
    },
    //本地存储获取数据
    _getLoacalStorage: function( jsonData, successCallback, failCallback ){

        if ( localStorage ) {
            let keys = this._getKeys( Object.assign({}, jsonData)),
                localData = localStorage.getItem( keys ), 
                ts, 
                nowTs = new Date().getTime();
            if (localData) {
                try{
                    localData = JSON.parse(localData);
                    ts = localData.ts;
                    //缓存两小时
                    if (localData && localData.data && ((nowTs-ts) < 60*60*2*1000)){
                        var res = localData.data;
                        successCallback(res.success||res.status,  res.data||res.regeocode, res.msg||res.info);
                    } else{
                        this._get(jsonData, successCallback, failCallback);
                    }
                }catch(e){
                    this._get(jsonData, successCallback, failCallback);
                }

            } else{
                this._get(jsonData, successCallback, failCallback);
            }

        } else {
            this._get(jsonData, successCallback, failCallback);
        }
    },

    //根据请求参数获取 key
    _getKeys: function( jsonData ){
        let keys = this.url;//"[object Boolean]"
            if (Object.prototype.toString.call(jsonData.cacheKey) == "[object String]" ) { keys = jsonData.cacheKey }
            //jsonData.cacheKey 为 boolean 值, 不作为 key 生成的参数
            if (jsonData.cacheKey && Object.prototype.toString.call(jsonData.cacheKey) == "[object Boolean]" ) { delete jsonData.cacheKey}

        let opts = jsonData.opts ? jsonData.opts : jsonData;

        let optKeys = Object.keys(opts)

        if (optKeys && optKeys.length > 0 ){
                let uri = '&';
                optKeys.map(function(key) {
                    uri = uri+key+'='+opts[key]+'&';
                });
                uri=uri.substring(0,uri.length-1);
                keys = keys+uri;
        }

        return keys;
    },
    //判断对象是否为空
    isEmptyObject: function (obj) {
        if (obj && typeof(obj) == 'object') {
        　　for (var key in obj){ return false; }　　
        　　return true;
        }else {
            return true;
        } 
    },
    /**
     * http post 请求简单封装
     * @param url 请求的URL
     * @param jsonData post：{formData：formData, setHeaders}的数据 与 参数
     * @param successCallback 请求成功回调
     * @param failCallback failCallback 请求失败回调
     */
    // 参考资料： javaScript post 表单提交 
    // https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/Using_FormData_Objects
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
    // https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/Blob
    post: function(jsonData, successCallback, failCallback) {
        // alert(JSON.stringify( formData) + this.url )
        let formData = jsonData.formData;

        function transferComplete() {
            //console.log( '提示-login', JSON.stringify( this.responseText ) );
             // Alert.alert( '提示-login', (JSON.stringify( this.responseText )),
             //   [{text: '确定', onPress: () =>{} }])
            let resData = this.responseText
            if (typeof(resData) == 'string') {
                resData = JSON.parse( resData );
            }
            successCallback && successCallback( resData.success, resData.data, resData.msg )
        }

        function transferFailed(evt) {
          //console.log("An error occurred while transferring the file.");
          failCallback && failCallback( this.responseText )
        }

        function transferCanceled(evt) {
          //console.log("The transfer has been canceled by the user.");
        }

        var oReq = new XMLHttpRequest();

        //oReq.addEventListener("progress", updateProgress);
        oReq.addEventListener("load", transferComplete);
        oReq.addEventListener("error", transferFailed);
        oReq.addEventListener("abort", transferCanceled);


        oReq.open("POST", this.url, true );
        oReq.setRequestHeader("Content-Type", (jsonData.enctype || "application/x-www-form-urlencoded" || "multipart/form-data") );

        oReq.send( formData );
    },
    postImg: function(jsonData, successCallback, failCallback) {
        // alert(JSON.stringify( formData) + this.url )
        let formData = jsonData.formData;

        function transferComplete() {
            //console.log( '提示-login', JSON.stringify( this.responseText ) );
             // Alert.alert( '提示-login', (JSON.stringify( this.responseText )),
             //   [{text: '确定', onPress: () =>{} }])
            let resData = this.responseText;
            if (typeof(resData) == 'string') {
                resData = JSON.parse( resData );
            }
            successCallback && successCallback( resData.success, resData.data, resData.msg )
        }

        function transferFailed(evt) {
          //console.log("An error occurred while transferring the file.");
          failCallback && failCallback( this.responseText )
        }

        function transferCanceled(evt) {
          //console.log("The transfer has been canceled by the user.");
        }

        var oReq = new XMLHttpRequest();

        //oReq.addEventListener("progress", updateProgress);
        oReq.addEventListener("load", transferComplete);
        oReq.addEventListener("error", transferFailed);
        oReq.addEventListener("abort", transferCanceled);

        if (jsonData.uid) {
            this.url=this.url+jsonData.uid;
        }

        oReq.open("POST", this.url, true );
        oReq.setRequestHeader("Content-Type", (jsonData.enctype || "application/x-www-form-urlencoded" || "multipart/form-data") );
        oReq.send( formData );
    },



    /**
     * http post 请求简单封装
     * @param url 请求的URL
     * @param data post的数据
     * @param successCallback 请求成功回调
     * @param failCallback failCallback 请求失败回调
     */
    /*post: function(data, successCallback, failCallback) {
        let fetchOptions = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        };
        let url = this.url
        fetch(url, fetchOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                let result = responseJson
                successCallback(result.success,  result.data, result.msg);
            })
            .catch((err) => {
                failCallback(err);
            });  
    },*/

    /**
     * 日志打印
     * @param obj
     */
    log: (obj) => {
        var description = "";
        for(let i in obj){
            let property = obj[i];
            description += i + " = " + property + "\n";
        }
        alert(description);
    },

};

 //配置所有请求接口连接
const host = 'http://zx.jiaju.sina.com.cn/index.php?';
//高德地图host
const gaodeHost = 'http://restapi.amap.com/v3/geocode/regeo?';

ljApi = {
/**********访问正式 接口 示例*****************/
    //获取当前城市 根据经纬度
    currentCity: new Api({
        url: gaodeHost +'key=4f26d7a01d775d9c8d7799000f3ae51a',
    }),
    //获取软件版本信息
    getAppVersion: new Api({
        url : host +'app=App&mod=Vision',
    }),
    //获取城市接口
    city : new Api({
        url : host +'app=App&mod=City',
    }),
    //获取案例首页导航信息接口
    anliTab : new Api({
        url :  host +'app=App&mod=Anli',
    }),
    //获取案例列表接口
    anliList : new Api({
        url : host +'app=App&mod=Anli&act=list',
    }),
    //获取案例/美图详情接口
    anliInfo : new Api({
        url : host +'app=App&mod=Anli&act=detail',
    }),
    //免费报价
    freeApply : new Api({
        url : host +'app=App&mod=Bespoke&act=appBespoke',
    }),
    //我的预约
    myAppointment : new Api({
        url : host +'app=App&mod=User&act=myBespoke',
    }),
    // 我的反馈
    feedback : new Api({
        url : host + 'app=App&mod=User&act=feedback',
    }),
    //反馈图片上传
   upImages : new Api({
        url : host + 'app=Api&mod=Source&act=appUpload',
    }),
   //头像上传几口
   changeHeaderImg : new Api({
        url : host + 'app=App&mod=User&act=settingAvatar&uid=',
    }),
   changeUserName:new Api({
        url : host + 'app=App&mod=User&act=changeUser'
    }),
    //获取装修公司tab
    companyDataTab: new Api({
        url : host +'app=App&mod=Designer&act=company',
    }),
    //获取装修公司list
    companyDataList: new Api({
        url : host +'app=App&mod=Designer&act=companyList',
    }),
    //获取设计师tab
    designerDataTab: new Api({
        url :  host +'app=App&mod=Designer&act=designer',
    }),
    //获取设计师list
    designerDataList: new Api({
        url : host +'app=App&mod=Designer&act=designerList',
    }),
    //获取装修公司/设计师详情页detail
    designerDetail: new Api({
        url : host +'app=App&mod=Designer&act=designerDetail',
    }),
    //获取装修公司/设计师详情页anli
    designerDetailAnli: new Api({
        url : host +'app=App&mod=Designer&act=designerAnli',
    }),
    //获取装修公司/设计师详情页Pic
    designerDetailPic: new Api({
        url : host +'app=App&mod=Designer&act=designerAlbum',
    }),
    //获取我的收藏 type 类型：1案例0美图
    favoritesAnliData: new Api({
        url : host +'app=App&mod=User&act=likeAlbums',
    }),
    //收藏 取消收藏
    collectionData:new Api({
        url : host +'app=App&mod=User&act=collection',
    }),
    //判断用户是否收藏接口
    isCollection:new Api({
        url : host +'app=App&mod=User&act=isCollection',
    }),
    //记录拨打电话接口
    userCallData: new Api({
        url: host +'app=App&mod=User&act=callData'
    })

}

export { ljApi }