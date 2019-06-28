/********
 * 获取当前监测页面的level2_page和custom_id
 ************/
let getNameId = () => {
    //console.log("url", window.location.href)
    let tjUrl = window.location.pathname,
        tjUrlArr = tjUrl.split("/"),
        tjUrlArrLen = tjUrlArr.length,
        tjName = '',
        tjId = '';

    //console.log("len", tjUrlArrLen - 1)
    if (tjUrl.indexOf('tuku') !== -1) {
        tjName = '';
        //console.log(tjUrlArr, tjUrl)
        if (tjUrl.indexOf('anli') !== -1) {
            tjName = "tuku_eginfo";
            tjId = tjUrlArr[tjUrlArrLen - 1];
        }else if (tjUrl.indexOf('city') !== -1) {
            tjName = "tuku_citylist";
            tjId = '';
        }else if (tjUrl.indexOf('pic') !== -1) {
            tjName = "tuku_picinfo";
            tjId = tjUrlArr[tjUrlArrLen - 1];
        }else if (tjUrl.indexOf('order') !== -1) {
            tjName = "tuku_order";
            tjId = '';
        }else if (tjUrl.indexOf('designer') !== -1) {
            tjName = "tuku_disign";
            tjId = tjUrlArr[tjUrlArrLen - 2];
        }else{
            tjName = 'tuku_eglist';
            tjId = '';
        }  
    }
    return {
        name: tjName,
        id: tjId
    }
};

/*
 *自定义方法，主动触发hisotryChange
 *调用history.pushState()或者history.replaceState()不会触发popstate事件
 */
let historyReWrite = (type) => {
    let orig = history[type];
    return function () {
        let rv = orig.apply(this, arguments);
        let e = new Event(type);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
    };
};


//当切换路由时改变统计配置参数
let resetTjConfig = () => {
    level2_page = getNameId().name;
    custom_id = getNameId().id;
    try {
        config.init();
        gather.event();
        "undefined" != typeof level1_page && gather.init();
    
        console.log(level1_page,level2_page,custom_id)
    } catch (e) {
        console.log(e)
    }
}


history.pushState = historyReWrite('pushState');
history.replaceState = historyReWrite('replaceState');

var city = 'quanguo'; //有城市属性传city_en，无则传quanguo
var level1_page = 'jiaju'; //传左侧维表对应值
var level2_page = getNameId().name; //传左侧维表对应值
var custom_id = getNameId().id; //取对应页面的id
var news_source = '石榴美图'; //传左侧维表对应值
var news_origin = ''; //传左侧维表对应值
console.log(level1_page,level2_page,custom_id)


/**********
https://developer.mozilla.org/zh-CN/docs/Web/API/Window/onpopstate

popstate事件只会在浏览器某些行为下触发, 比如点击后退、前进按钮(或者在JavaScript中调用history.back()、history.forward()、history.go()方法).

调用history.pushState()或者history.replaceState()不会触发popstate事件. ！！！通过自定义方法主动触发

当网页加载时,各浏览器对popstate事件是否触发有不同的表现,Chrome 和 Safari会触发popstate事件, 而Firefox不会.
***************/
window.addEventListener('popstate', function (event) {
    //console.log("event1", event);
    resetTjConfig();

});
window.addEventListener('replaceState', function (e) {
    //console.log("event2", event);
    resetTjConfig();
});
window.addEventListener('pushState', function (e) {
    //console.log("event3", event);
    resetTjConfig();
});