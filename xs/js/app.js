!function(){
    var xs = {
        '斗罗大陆':'./data/data.json',
        '星辰变' : './data/xingchenbian/1434458_1435000.json'
    }
    var skip = [...document.querySelectorAll('.skip input')]
    var pre = [...document.querySelectorAll('.pre')]
    var next = [...document.querySelectorAll('.next')]
    // name: n page: p
    var Search = getAppSearch()
    if (!Search.n || !Search.p) {
        setSearch({n:'星辰变',p:0})
    }
    var xsKey = decodeURI(Search.n)
    var _json = Search.d?`./data/${Search.d}.json`:xs[xsKey]
    fetch(_json).then((res)=>{
        
        res.json().then(data=>{
            console.log(data);
            var page = data[Search.p]
            if(page){
                render(page)
            } else{
                document.querySelector('body').innerHTML = '未有此章节';
                setTimeout(()=>{
                    window.history.back(-1)
                },1000)
            }
        })
        // var data = res
       
    })
    
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
            setSearch({p:parseInt(Search.p)-1})
        }
    })
    next.forEach(v=>{
        v.onclick = function(){
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
        var s = location.search
        if(!s || s.trim()=='?') return r;

        s = s.substring(1).split('&')
        s.forEach(v=>{
            var kv = v.split('=')
            if(kv.length == 2){
                r[kv[0]] = kv[1]
            }
        })
        return r
    }

    function setSearch(obj){
        var s = getAppSearch()
        for(var k in obj){
            s[k] = obj[k]
        }
        var r = []
        for (var k in s) {
            r.push(`${k}=${s[k]}`)
        }
        location.href = `?${r.join('&')}`;
    }
    }()