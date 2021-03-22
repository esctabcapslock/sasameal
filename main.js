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
    get: function (callback) {
        fetch('rice.csv').then((response) => {
            return response.text('ansi');
        }).then((data) => {
            var arr=csv2arr(data)
            console.log(arr)
            this.table=arr;
        }).then(callback)
    },
    gmt:false,
    get_date:function(){
        var gmt=this.gmt
        var x=new Date();
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
        var ind = this.table[1].indexOf(this.get_date()) + x;
        
        return [this.table[2][ind],  this.table[3][ind],  this.table[4][ind]]
    },
    show:function(arr){
        var k = document.getElementById('시간').children
        k[0].innerText=arr[0].replaceAll('↵','\n')
        k[1].innerText=arr[1].replaceAll('↵','\n')
        k[2].innerText=arr[2].replaceAll('↵','\n')

    },
    oneclick:function(){
        //console.log(location.hash)
        if(location.hash=='#gmt')  rice.gmt=true;//document.getElementById('gmt').click()
        else if(location.hash=='#kst') rice.gmt=false;//document.getElementById('kst').click()
        rice.get(()=>{rice.show(rice.today_menu(0))});
    }
    }