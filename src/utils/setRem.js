(function(psdw){

  /*function fnResize(){
    var dpr=0 , rem=0 , scale=0;
    var htmlDOM=document.documentElement;
    dpr=window.devicePixelRatio;
    var currentWidth=htmlDOM.clientWidth;
    scale=currentWidth/psdw;
    rem=psdw/10;
    rem=rem*scale;
    htmlDOM.style.fontSize=rem+'px';
    htmlDOM.setAttribute('data-dpr',dpr);
  }*/

  function fnResize(){
      var psdSize = psdw/100, dpr=window.devicePixelRatio,//psd375像素
          docWidth = document.documentElement.clientWidth || document.body.clientWidth,
          body = document.getElementsByTagName('html')[0];
          
          docWidth = docWidth > psdw ? psdw : docWidth;
          
        body.style.fontSize = docWidth /psdSize + 'px';
        body.setAttribute('data-dpr',dpr);
  }

  fnResize();
  window.addEventListener("resize", function() {
      fnResize();
  }, false);

})(750);
