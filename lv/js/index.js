var startTime = "Sat Oct 06 2018 14:30:00 GMT+0800 (中国标准时间)"
resizeW(750);
function preload(images, complete) {
    var total = new Array();
    for (var i = 0; i < images.length; i++) {
        var _img = new Image();
        _img.onload = function () {
            total.push(this);
            total.length === images.length && complete && complete();
        };
        _img.src = "img/" + images[i];
    }
}
function setAni(obj,elm,f){
    for (const i in obj) {
        var sel = "[ref=" + i + "]"
        var el = elm?elm.find(sel):$(sel)
        var cn = !f?obj[i]:""
        el.attr("class",cn)
    }
}
var souces1 = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', 'bg.jpg', 'music.jpg'],
    souces2 = ['p1.jpg', 'p2.jpg', 'p3.jpg', 'p4.jpg', 'p5.jpg', 'p6.jpg'];
preload(souces1, function () {
    console.log($(".loadding").length)
    
    setTimeout(() => {
        $(".loadding").addClass("hide").siblings().removeClass("hide");
        runP1();
        runP2(souces2)
    }, 200);
    
})

function runP2(hdre) {
    var picsShow = null;
    var jilu = 0;
    var sliderImag = new Swiper(".app", {
        speed: 500,
        slidesPerView: 1,
        direction: "vertical",
        on:{
            slideChangeTransitionEnd: function (swp) {
                if (sliderImag.activeIndex == 1 && jilu !== sliderImag.activeIndex) {
                     $(".loadding").removeClass('hide')
                     preload(souces2, function () {
                         $(".loadding").addClass('hide')
                         picsShow = new HdPic(".pic-app", hdre)
                         picsShow.init();
                     })
                } else if (sliderImag.activeIndex !== 1) {
                    console.log("滑动结束：",picsShow)
                    if (picsShow){
                        picsShow.clear();
                        picsShow=null;
                    }
                }
                jilu = sliderImag.activeIndex
            }
        }
    })
}

function HdPic(sel,resouce1){
    var elm = $(sel);
    if(!elm.length || !resouce1.length) return;
    var ss = JSON.parse(JSON.stringify(resouce1));
    var resouce = []
    for(var i=0;i<resouce1.length;i++){
        var n = Math.floor(Math.random()*ss.length);
        var pn = ss[n];
        resouce.push(pn);
        ss[n] = false;
        ss = ss.filter(v=>v)
    }
    console.log(resouce)
    var W = elm.width()
    var H = elm.height()
    var curIndex=Math.floor(Math.random()*resouce.length);
    var ooi=1;
    var lock = false;
    var timeout={}
    var ml = 0,mt = 0,pW = 0,pH = 0;
    this.init= function () {
        elm.html("")
        var sqrtN = Math.sqrt(resouce.length)
        var xN = Math.floor(sqrtN);
        var yN = xN == sqrtN ? xN : xN + 1;
        pW = W / xN;
        pH =H/yN;
        ml = W - 1.5*pW;
        mt = H - pH*1.5;
        var inHtml = ""
        for (var i=0;i<resouce.length;i++) {
            var deg = Math.random()*60+10+"deg";
            deg = Math.random()>0.5?deg:"-"+deg;
            inHtml+="<div style='transform:rotate("+deg+")'><img src='img/"+resouce[i]+"'/></div>"
        }
        elm.html(inHtml)
        init(pW, pH, ml, mt,function(){
            events();
            setTimeout(() => {
                autoPlay();
            }, 500);
        })
    }
    function init(pW,pH,ml,mt,cb){
        var tol = 0;    
        elm.find("div").css({width:pW,height:pH,marginLeft:-pW/2,marginTop:-pH/2}).each(function(){
            var l = Math.random() * ml + 0.8*pW
            var t = Math.random()*mt + 0.8*pH
            $(this).animate({left:l,top:t},600,function(){
                tol++;
                if(tol == resouce.length){
                    cb && cb()
                }
            })
        })
    }
    this.clear=function(){
        lock = true;
        elm.html("");
        for (var i in timeout) {
            clearTimeout(timeout[i]);
        }
    }
    function autoPlay(){
        if(lock)return;
        for (var i in timeout) {
            clearTimeout(timeout[i]);
        }
        lock = true
        ooi++;
        curIndex ++;
        if(curIndex>=resouce.length)curIndex=0;
        var lis = elm.find("div").eq(curIndex).css({zIndex:ooi})
            lis.addClass("show").siblings().removeClass("show init");
            timeout[1]=setTimeout(() => {
                var deg = Math.random()*60+10+"deg";
                deg = Math.random()>0.5?deg:"-"+deg;
                var l = Math.random() * ml + 0.8*pW
                var t = Math.random()*mt + 0.8*pH
                lis.css({left:l,top:t,transform:"rotate("+deg+")"}).removeClass("show").addClass("init")
                timeout[2] =setTimeout(() => {
                    
                    lock = false;
                    autoPlay()
                }, 900);
            }, 3500);
    }
    function events(){
        // var start = function(e){
        //     var _touch = e.originalEvent.targetTouches[0];
        //     var x= _touch.pageX;
        //     var y= _touch.pageY;
        //     console.log(x,y)
        // }
        // elm.find("div").on('touchstart',start)
        // return;
        elm.find("div").on("click",function(){
            for (var i in timeout) {
                clearTimeout(timeout[i]);
            }
            ooi++
            var _lis = $(this).css({
                zIndex: ooi
            });
            
            lock=true;
            if(_lis.is(".show")){
                var deg = Math.random()*60+10+"deg";
                deg = Math.random()>0.5?deg:"-"+deg;
                var l = Math.random() * ml + 0.8*pW
                var t = Math.random()*mt + 0.8*pH
                _lis.css({left:l,top:t,transform:"rotate("+deg+")"});_lis.removeClass("show").addClass("init");
                timeout[3] =setTimeout(() => {
                    curIndex = _lis.index();
                    lock = false;
                    autoPlay()
                }, 900);
                return;
            }
            
            _lis.addClass("show").siblings().removeClass("show init");
            curIndex = _lis.index();
            timeout[4] =setTimeout(() => {
                var deg = Math.random()*60+10+"deg";
                deg = Math.random()>0.5?deg:"-"+deg;
                var l = Math.random() * ml + 0.8*pW
                var t = Math.random()*mt + 0.8*pH
                _lis.css({left:l,top:t,transform:"rotate("+deg+")"});_lis.removeClass("show").addClass("init");
                 timeout[5] = setTimeout(() => {
                     curIndex = _lis.index();
                     lock = false;
                     autoPlay()
                 }, 900);
            }, 2500);
        })
    }
}



(function () {
    var str = ""
    for (let i = 1; i < 36; i++) {
        str +="<div class='rib"+i+"'></div>"
    }
    $(".heart3d").append(str)
    var mm = document.createElement("AUDIO");
    mm.setAttribute("autoplay", true);
    mm.setAttribute("loop", true);
    mm.setAttribute("src", "http://zhangmenshiting.qianqian.com/data2/music/c92448ac0ebf19032b0cfe86ff6a2c55/594742598/594742598.mp3?xcode=14a582ee54787d857ddf74b1a6ef6955");
    document.addEventListener("WeixinJSBridgeReady", function () { if(mm.paused) mm.play(); }, false);
    document.addEventListener('YixinJSBridgeReady', function () {
        if(mm.paused) mm.play();
    }, false);
    document.addEventListener('DOMContentLoaded', function () {
        if(mm.paused) mm.play();
    }, false);
    mm.addEventListener("canplay",function () {
        if(mm.paused) mm.play()
    })
    var btn = document.getElementById("music")
    btn.ontouchstart = function () {
        if (mm.paused) {
            mm.play()
            this.className = "run"
        } else {
            mm.pause()
            this.className = ""
        }
    }
    
})();

 function runP1() {
    var i = 0;
    var str = "如似卖弄的一句话 'I can't lv u more'! 却没有想到我真的永远成为了-The boy who couldn't lv u more, now and forever!";

    function typing() {
        var mydiv = document.getElementById("display");
        mydiv.innerHTML += str.charAt(i);
        var oBtn = document.getElementById('btn');
        i++;
        var id = setTimeout(typing, 100);
        if (i == str.length) {
            console.log("执行完毕")
            clearTimeout(id);
            mydiv.value = "";
            mydiv.innerHTML += ""
            var tt = document.getElementById("time");
            tsp = tt.getElementsByTagName("span")[0]
            tsp.innerHTML = jsst(startTime);
            tt.className = "shows"
            jsq(tsp, startTime)
        }
     }
     typing()
}
function jsq(el, startT) {
    setTimeout(function () {
        el.innerHTML = jsst(startT);
        jsq(el, startT)
    }, 1000)
}
function tr(n) {
    return n < 10 ? "<span>0" + n + "</span>" : "<span>" + n + "</span>";
}
function jsst(startT) {
    var _date = new Date(startT)
    var dur = (new Date().getTime() - _date.getTime()) / 1000;

    var d = Math.floor(dur / (24 * 60 * 60));
    var h = Math.floor((dur % (24 * 60 * 60)) / (60 * 60));
    var m = Math.floor(((dur % (24 * 60 * 60)) % (60 * 60)) / 60);
    var s = Math.floor(((dur % (24 * 60 * 60)) % (60 * 60)) % 60);
    return tr(d) + "天" + tr(h) + "小时" + tr(m) + "分钟" + tr(s) + "秒"
}   
function resizeW(W){
    function resize() {

        var ww = $(window).width(),
            wh = $(window).height();
        var _w = Math.min(ww, wh);
        var _h = Math.max(ww, wh);
        var ml = ww >= wh ? (ww - wh) / 2 : 0;
        var mt = ww >= wh ? -(ww - wh) / 2 : 0;
        var rotate = ww >= wh ? "90deg" : 0;
        var orientation = (window.innerWidth >= window.innerHeight) ? 'landscape' : 'portrait';
        $("html").css({
            fontSize: (_w / W) * 625 + "%"
        });
        $("body").removeClass("landscape portrait").addClass(orientation);
        $("body").css({
            width: _w,
            height: _h,
            marginLeft: ml,
            marginTop: mt,
            transform: "rotate(" + rotate + ")"
        });
    };
    resize();
    $(window).resize(resize);
    // window.addEventListener('orientationchange', resize, false);
}