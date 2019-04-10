!function(){
    var xs = {
        '斗罗大陆':{
            bsUrl: './data/douluodalu/',
            def:'./data/douluodalu/data0.json'
        },
        '星辰变' : {
            bsUrl: './data/xingchenbian/',
            def:'./data/xingchenbian/data0.json'
        }
    }
    var skip = [...document.querySelectorAll('.skip input')]
    var pre = [...document.querySelectorAll('.pre')]
    var next = [...document.querySelectorAll('.next')]
    var open = [...document.querySelectorAll('.openmulu')]
    var xsJson = []
    
    // name: n page: p
    var Search = getAppSearch()
    if (!Search.n || !Search.p) {
        Search = {n:'星辰变',p:0}
       setSearch(Search)
    }
    var xsKey = decodeURI(Search.n);
    var dataBaseUrl = xs[xsKey].bsUrl
    qqOnce(Search)
    
    
    window.onhashchange = function(){
        var s = getAppSearch();
        if(s.p&&xsJson.length){
            qqOnce(s)
        }
    }

    function qqOnce(Search){
        if(xsJson[Search.p]){
            render(xsJson[Search.p]);
            window.scrollTo(0,0)
                mulu(0);
                return false;
        }
        var xsKey = decodeURI(Search.n)
        var _json = Search.p == undefined?xs[xsKey].def:`${dataBaseUrl}data${Search.p}.json`
        fetch(_json).then((res)=>{
            if(res.status == 404){
                alert('章节不存在！');
                window.history.back(-1);
                return false;
            }
            res.json().then(data=>{
                if(!data || Search.p<0){
                    alert('章节不存在！');
                    window.history.back(-1);
                    return false;
                }
                xsJson[Search.p] = data
                var page = xsJson[Search.p];
                window.scrollTo(0,0)
                mulu(0);
                if(page){
                    render(page)
                }
                open.forEach(v=>{
                    v.onclick = function(){
                            mulu(1,data);
                            v.isOpen = true
                    }
                })
            })
        }).catch(e=>{
            alert('章节不存在！');
            window.history.back(-1)
        })
    }

    function render(data){
        var t = document.getElementById('title')
        var c = document.getElementById('content')
        t.innerText = data.title
        c.innerHTML = data.html
        c.innerHTML = c.innerHTML.replace(new RegExp("&nbsp;&nbsp;&nbsp;&nbsp;","gi"),"")
        skip.forEach(v=>{v.value = parseInt(getAppSearch().p) +1})
    }

    pre.forEach(v=>{
        v.onclick = function(){
            var Search = getAppSearch()
            setSearch({p:parseInt(Search.p)-1})
        }
    })
    next.forEach(v=>{
        v.onclick = function(){
            var Search = getAppSearch()
            setSearch({p:parseInt(Search.p)+1})
        }
    })
    skip.forEach(v=>{
        v.onchange = function(){
            var p = parseInt(this.value)-1
            setSearch({p: p<0?0:p})
        }
    })
    
    function getAppSearch(){
        var r = {}
        var s = location.href.split("#")
        if(s.length<2||!s[1]) return r;

        s = s[1].split('&')
        s.forEach(v=>{
            var kv = v.split('=')
            if(kv.length == 2){
                r[kv[0]] = kv[1]
            }
        })
        return r
    }

    function setSearch(obj,flag){
        var s = getAppSearch()
        for(var k in obj){
            s[k] = obj[k]
        }
        var r = []
        for (var k in s) {
            r.push(`${k}=${s[k]}`)
        }
        var link = `#${r.join('&')}`;
        if(flag) return link;
        location.href = link;
    }
    function mulu(o,data){
        var dom = document.querySelector('.mulu');
        if(!o){
            dom && (dom.className = 'mulu');
            return false;
        }
        if (!dom) {
            dom = document.createElement('DIV');
            dom.className = 'mulu'
            // dom.innerHTML = createMulu(data);
            document.querySelector('body').appendChild(dom);
            
        }
        if(!dom.innerHTML){

            fetch(`${dataBaseUrl}mulu.json`).then((res)=>{
                res.json().then(data=>{
                    dom.innerHTML = createMulu(data);
                    dom.querySelector('.close').onclick = function(){
                        mulu(0);
                    }
                    setTimeout(()=>{
                        dom.className = 'mulu show'
                    },0)
                })
            })
        }else{
            setTimeout(()=>{
                dom.className = 'mulu show'
            },0)
        }
        
    }
    function createMulu(data){
        console.log(data.length);
        var str = ['<i class="close">X</i><ul>'];
        data.forEach((x,i)=>{
            str.push('<li><a href="'+setSearch({p:i},true)+'">'+x.title+'</a></li>')
        })
        str.push('</ul>');
        return str.join('');
    }
}()