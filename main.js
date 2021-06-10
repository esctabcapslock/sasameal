function csv2arr(data){
        data=data.split('');
        var f=0;
        for(var i=0; i<data.length; i++){
           // console.log(data[i],i,f)
            if(data[i]=='"' && data[i+1]!='"') data[i]='', f+=1;
            else if(data[i]=='\n' && f%2) data[i]='↵';
            else if(data[i]==',' && f%2) data[i]='.';
            //console.log('->',data[i])
        }
        data=data.join('')
        //console.log(data)
        data = data.replaceAll(`""`,`"`).replaceAll('\r','');
        var x=data.trim().split('\n');
        var arr = new Array(x.length);
        x.forEach((v,i,ar)=>{arr[i] = v.split(',')})
        return arr;
}
var rice={
    niceapi:function(x,callback){
        var ar = this.get_date(x).split(" ")
        ar[0]=ar[0].length==2?'0'+ar[0].substr(0,1):ar[0].substr(0,2);
        ar[1]=ar[1].length==2?'0'+ar[1].substr(0,1):ar[1].substr(0,2);
        var url = `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=I10&SD_SCHUL_CODE=9300181&MLSV_YMD=${(new Date()).getFullYear()}${ar[0]}${ar[1]}`;
       // console.log(url)
        fetch(url).then((response) => {
            return response.text('ansi');
        }).then((data) => {
            if(!data) rice.get(()=>{rice.show(rice.today_menu(x))});
          //console.log(data);
            this.apivalue=data;
            var oParser = new DOMParser();
            var oDOM = oParser.parseFromString(data, "text/xml");
            var k=oDOM.querySelectorAll('DDISH_NM')
            var l=oDOM.querySelectorAll('NTR_INFO')
            console.log(k,l)
            if(!k || !l) rice.get(()=>{rice.show(rice.today_menu(x))});
            console.log([...k], typeof [...k]);
            callback(
                [...k].map((value) => value.childNodes[0].data), 
                [...l].map((value) => value.childNodes[0].data)
            );
            
//                [k[0].childNodes[0].data, k[1].childNodes[0].data, k[2]||k[2].childNodes[0].data],
//                [l[0].childNodes[0].data, l[1].childNodes[0].data, l[2]||l[2].childNodes[0].data],
        });
    },
    get: function (callback) {
        fetch('rice.csv').then((response) => {
            return response.text('ansi');
        }).then((data) => {
            var arr=csv2arr(data)
            //console.log(arr)
            this.table=arr;
        }).then(callback)
    },
    gmt:false,
    get_date:function(plus){
        var gmt=this.gmt
        var x=new Date(Number(new Date())+1000*3600*24*plus)
        var d=x.getDate(), m=x.getMonth(), h = x.getHours();
        if (gmt && (h+9)>=24){ //gmt라면,,,
            x=new Date(Number(x)+32400000)
            var d=x.getDate(), m=x.getMonth();
        }
        var tx = `${m+1}월 ${d}일`;
        document.getElementById('date').innerHTML=tx;
        return tx;
    },
    today_menu:function(x){
        if (!this.table) return false;
        if (!x) x=0;
        var ind = this.table[1].indexOf(this.get_date(x));
        
        return [this.table[2][ind],  this.table[3][ind],  this.table[4][ind]]
    },
    show:function(arr, cal){
        console.log(arr)
        var f=str=>str.replaceAll('↵','\n').replaceAll('\n','<br>')
        var k = document.getElementById('시간').children
        var n = document.getElementById('영양').children
        k[0].innerHTML=k[1].innerHTML=k[2].innerHTML=''
        n[0].innerHTML=n[1].innerHTML=n[2].innerHTML=''
        
        if(!cal.length) return;
        k[0].innerHTML=arr[0].replaceAll('↵','\n').replaceAll('\n','<br>')
        k[1].innerHTML=arr[1].replaceAll('↵','\n').replaceAll('\n','<br>')
        !arr[2]||(k[2].innerHTML=arr[2].replaceAll('↵','\n').replaceAll('\n','<br>'))
        
        n[0].innerHTML=cal[0].replaceAll('↵','\n').replaceAll('\n','<br>')
        n[1].innerHTML=cal[1].replaceAll('↵','\n').replaceAll('\n','<br>')
        !cal[2]||(n[2].innerHTML=cal[2].replaceAll('↵','\n').replaceAll('\n','<br>'))
    },
    oneclick:function(){
        //console.log(location.hash)
        if(location.hash=='#gmt')  rice.gmt=true;//document.getElementById('gmt').click()
        else if(location.hash=='#kst') rice.gmt=false;//document.getElementById('kst').click()
        //rice.get(()=>{rice.show(rice.today_menu(0))});
        rice.niceapi(0,rice.show)
    },
    내일:function(ele){
        var o=document.getElementById('today_tom')
        if(ele.innerHTML=='내일?'){
            ele.innerHTML='오늘?';
            o.innerHTML='내일'
            //rice.show(rice.today_menu(1))
            rice.niceapi(1,rice.show)
        }else if(ele.innerHTML=='오늘?'){
            ele.innerHTML='내일?';
             o.innerHTML='오늘'
            //rice.show(rice.today_menu(0))
            rice.niceapi(0,rice.show)
        }
    }
}
//https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=I10&SD_SCHUL_CODE=9300181&MLSV_YMD=202103