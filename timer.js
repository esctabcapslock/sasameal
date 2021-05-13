class Timer{
    constructor(){
        this.zone = (new Date()).getTimezoneOffset();
        this.day = document.getElementById('day')
        this.time = document.getElementById('time')
        this.일 = document.getElementById('일')
        this.endtime = document.getElementById('endtime')
        this.week_n = document.getElementById('week_n')
        this.end_time = new Date(2021,6-1,21,9-9,0);
        this.endtime.innerHTML=`<span class='tfont'>2021-06-21</span> &nbsp; <span class='tfont'>09:00</span> 완료`
        this.interval();
    }
    interval(){
        this.a = setInterval(()=>{
            var now = new Date();
            var dis = (this.end_time - now - this.zone*60*1000 );
            var flag=false;
            if (dis<0){flag=true;dis*=-1;}
            var w2=(x)=>(x>=10)?x: '0'+x.toString()
            var 일 = Math.floor(dis/24/3600/1000);
            if (flag) 일 = '+'+일.toString()
            var 시 = Math.floor(dis/1000/3600-일*24);
            var 분 = Math.floor(dis/1000/60 - 일*24*60-시*60);
            var 초 = Math.floor(dis/1000 - 일*24*3600 - 시*3600 - 분*60)
            this.week_n.innerHTML = Math.floor(일/7)
            this.day.innerHTML = 일
            this.time.innerHTML = `${w2(시)}:${w2(분)}:${w2(초)}`;
            this.일.innerHTML = '일'
        }, 100)
    }
}