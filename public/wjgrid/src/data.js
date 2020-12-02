
export function getData() {
    var ary = [];
    var bz = ['btc','usdt','eth','ecx','qb','qwe','ser','csd','dfr','rfs','kyw','poj','ewd','xdw','qer','sdw','dsd','sdf','ews','fwe'];
    // var tt = ['2020-01-06 10:47:13','2020-01-07 11:47:13','2020-01-08 10:10:13','2020-01-09 10:20:10','2020-01-10 15:02:13','2020-01-11 16:35:13','2020-01-12 13:47:13','2020-01-13 03:47:13','2020-01-14 14:13:13','2020-01-15 13:25:16','2020-01-16 16:25:02','2020-01-17 13:25:16','2020-01-18 15:24:13','2020-01-19 04:24:13','2020-01-20 15:16:13','2020-01-21 15:23:14','2020-01-22 15:23:45','2020-01-23 11:13:15','2020-01-24 16:14:13','2020-01-25 05:25:13'];
    var today = Date.now()
    for(var _zeqi = 0;_zeqi<bz.length;_zeqi++){
        var _zeqd = {
            status: Math.random()>0.5?1:2,
            amount: Math.floor(Math.random()*100),//数量
            to_addr: bz[_zeqi]+"XmaHojarv"+bz[_zeqi]+"dbmGiC3p3JKZNEzd"+bz[_zeqi],//接收地址
            date: new Date(today- Math.random() * 365 * 3), //充币时间
            current_avail: Math.floor(Math.random()*1000),//剩余可用
            current_lock: Math.floor(Math.random()*100),//剩余冻结
            fee: Math.floor(Math.random()*10),//手续费
            uid: bz[_zeqi]+"361163759709855744"+bz[_zeqi], //UID
            price: Math.floor(Math.random()*20),//USDT汇率
            coiname: bz[_zeqi]//币种
        }
        ary.push(_zeqd);
    }
    return ary;
}