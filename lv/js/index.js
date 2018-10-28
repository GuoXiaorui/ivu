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
$(function(){
    var hdre = ["img/p1.jpg", "img/p2.jpg", "img/p3.jpg", "img/p4.jpg", "img/p5.jpg" ]
    var picsShow = null;
    var jilu = 0;
    var sliderImag = new Swiper(".app", {
        speed: 500,
        slidesPerView: 1,
        direction: "vertical",
        on:{
            slideChangeTransitionEnd: function (swp) {
                if (sliderImag.activeIndex == 1 && jilu !== sliderImag.activeIndex) {
                    var pics = hdre.join(",").replace(/img\//gi,"").split(",");
                    console.log(pics)
                    preload(pics, function () {
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
    console.log("zhixing",)
});

function HdPic(sel,resouce){
    var elm = $(sel);
    if(!elm.length || !resouce.length) return;
    var W = elm.width()
    var H = elm.height()
    var curIndex=0
    var ooi=1;
    var lock = false;
    var timeout={}
    this.init= function () {
        elm.html("")
        var sqrtN = Math.sqrt(resouce.length)
        var xN = Math.floor(sqrtN);
        var yN = xN == sqrtN ? xN : xN + 1;
        var pW = W / xN;
        var pH =H/yN;
        var ml = W - pW;
        var mt = H - pH;
        var inHtml = ""
        for (const i in resouce) {
            var deg = Math.random()*60+10+"deg";
            deg = Math.random()>0.5?deg:"-"+deg;
            inHtml+="<div style='transform:rotate("+deg+")'><img src='"+resouce[i]+"'/></div>"
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
            var l = Math.random() * ml + pW / 2
            var t = Math.random()*mt +pH/2
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
                lis.removeClass("show").addClass("init")
                timeout[2] =setTimeout(() => {
                    lock = false;
                    autoPlay()
                }, 900);
            }, 3500);
    }
    function events(){
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
                _lis.removeClass("show").addClass("init");
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
                 _lis.removeClass("show").addClass("init");
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
    mm.setAttribute("src", "media/bg.mp3");
    document.addEventListener("WeixinJSBridgeReady", function () { mm.play(); }, false);
    document.addEventListener('YixinJSBridgeReady', function () {
        mm.play();
    }, false);
    document.addEventListener('DOMContentLoaded', function () {
        mm.play();
    }, false);
    
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

preload(["1.jpg", "bg.jpg", "music.jpg", "2.jpg"], function () {
    var i = 0;
    var str = "记得班门弄斧和你说的第一句英语 'I can't lv u more'! 没有想到我真的永远成为了:The boy who couldn't lv u more.";

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
})
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