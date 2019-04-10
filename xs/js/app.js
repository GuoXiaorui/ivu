!function(){
    var xs = {
        '斗罗大陆':'./data/data.json',
        '星辰变' : './data/xingchenbian/1434458_1435000.json'
    }
    var skip = [...document.querySelectorAll('.skip input')]
    var pre = [...document.querySelectorAll('.pre')]
    var next = [...document.querySelectorAll('.next')]
    var open = [...document.querySelectorAll('.openmulu')]
    var xsJson = []
    // name: n page: p
    var Search = getAppSearch()
    if (!Search.n || !Search.p) {
        window.reload(setSearch({n:'星辰变',p:0}))
    }
    var xsKey = decodeURI(Search.n)
    var _json = Search.d?`./data/${Search.d}.json`:xs[xsKey]
    fetch(_json).then((res)=>{
        
        res.json().then(data=>{
            console.log(data);
            xsJson = data
            var page = data[Search.p]
            if(page){
                render(page)
            } else{
                document.querySelector('body').innerHTML = '未有此章节';
                setTimeout(()=>{
                    window.history.back(-1)
                },1000)
            }
            open.forEach(v=>{
                v.onclick = function(){
                        mulu(1,data);
                        v.isOpen = true
                }
            })
        })
        // var data = res
       
    })
    
    window.onhashchange = function(){
        var s = getAppSearch();
        if(s.p&&xsJson.length){
            render(xsJson[s.p]);
            mulu(0);
        }
    }

    function render(data){
        var t = document.getElementById('title')
        var c = document.getElementById('content')
        t.innerText = data.title
        c.innerHTML = data.html
        c.innerHTML = c.innerHTML.replace(new RegExp("&nbsp;&nbsp;&nbsp;&nbsp;","gi"),"")
        skip.forEach(v=>{v.value = parseInt(Search.p) +1})
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
            console.log(000)
            return false;
        }
        if (!dom) {
            dom = document.createElement('DIV');
            dom.className = 'mulu'
            dom.innerHTML = createMulu(data);
            document.querySelector('body').appendChild(dom);
            dom.querySelector('.close').onclick = function(){
                mulu(0);
            }
        }
        setTimeout(()=>{
            dom.className = 'mulu show'
        },0)
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