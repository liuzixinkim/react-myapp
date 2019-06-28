const getUrlParmas = (name) => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}


const preLoadImg = (url, callback) => {
    //console.log(url, callback)
    var img = new Image();
    img.src = url;
    if (img.complete) {
        //console.log("complete", url)
        callback && callback(url);
        return;
    }
    img.onload = function () {
        //console.log("loaded", url)
        callback && callback(url);
    };
};


/**
* @method formDataFn
* @desc post 提交格式化参数 
* @param { obj } objJson 传递参数 
*/
const formDataFn = (jsonData) => {
    let optKeys = Object.keys(jsonData)
    if (optKeys && optKeys.length > 0) {
        let formData = new FormData();
        optKeys.map( (key, val)=> {
            var value = jsonData[key];
            formData.append(key, value);
        });
        return formData;
    } else {
        return {};
    }
}


/**
* @method getStrInArrIndex
* @desc 获取某个字符在多维数组的位置 
* @param arr:数组  str:指定字符串  indexArr:返回下标数组
*/
const getStrInArrIndex = (arr, str, indexArr = []) => {
    for (let i = 0, len = arr.length; i < len; i++) {
        if (arr[i] == str) {
            indexArr.push(i);
            if(indexArr.length == 1){
                return indexArr;
            }else{
                return true;
            }
        }else if(arr[i] instanceof Array){
            indexArr.push(i);
            if(getStrInArrIndex(arr[i],str,indexArr)){
                return indexArr;
            }
        }
    }
    indexArr.pop();
}

//检测是否是微信浏览
const is_weixin = () => {
    var UA = navigator.appVersion;
    var a = UA.toLowerCase();
    if (a.match(/MicroMessenger/i) == "micromessenger") {
        return true
    } else {
        return false
    }
};


export default {
    getUrlParmas,
    preLoadImg,
    formDataFn,
    getStrInArrIndex,
    is_weixin
};