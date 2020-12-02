/* eslint-disable prettier/prettier */
/**服务数据请求 模块  2019/6/21 张首尚 */
import axios from "axios";
import subscription from "./subscription";
export default class Service {
  constructor() {
    this.instance = null; //单例实例
    this.httpIns = []; //用来存放http实例的数组
    this.reqIndex = 0; //累计htt请求次数
    this.preData = new Date();
    this.time = setInterval(() => {
      let now = new Date();
      if (now.getTime() - this.preData.getTime() > 60000 * 60) {
        subscription.getInstance().notify({ dataType: "loginout" });
        this.preData = new Date();
        console.log("120分钟无操作，跳转到登陆");
      } else {
        console.log("检测中。。。");
      }
    }, 60000);
    axios.defaults.timeout = 12000; //超时时间
    axios.defaults.baseURL =
      process.env.NODE_ENV === "production"
        ? config.url
        : "http://manage.officeqb.com"; //''; 
    axios.defaults.headers["Content-Type"] = "application/json;charset=UTF-8";
  }

  /**获取单例实例 */
  static getInstance() {
    if (!this.instance) {
      this.instance = new Service();
      console.log(`创建通讯单例实例对象`);
    }
    return this.instance;
  }

  setToken(value) {
    axios.defaults.headers["token"] = value;
  }

  /**
   * 发送一次请求
   * httpRequest 访问web服务接口
   * reqData 请求参数
   * tagData 标记数据
   * url 服务地址
   * action 请求行为 默认值0-1随机数
   * reqcounts 允许的最大请求次数 默认值1
   * isLook 是否循环使用 默认值 false 比如心跳 需要设置此值为true 持续发送数据到服务器
   * */
  req(
    reqData,
    tagData,
    url,
    action = Math.random(),
    reqcounts = 1,
    isLook = false
  ) {
    // reqData.Authorization =  axios.defaults.headers["Authorization"];
    let time = parseInt(new Date().getTime() / 1000) + "";
    let sin = md5(
      md5(config.secretKey) + time
    );
    (reqData["sign"] = sin),
      (reqData["ts"] = time),
      (this.preData = new Date());
    for (var pro in reqData) {
      if (reqData[pro] === undefined || reqData[pro] == null) {
        reqData[pro] = "";
      }
    }
    let isSame = false,
      http = null,
      i = 0;
    for (i = this.httpIns.length - 1; i >= 0; i--) {
      http = this.httpIns[i];
      if (http.action == action) {
        isSame = true; //发现一样的请求
        break;
      }
    }
    if (isSame) {
      if (!http.isLook) {
        //不是循环请求 则干掉已经存在的请求
        http.destory();
        this.httpIns.splice(i, 1);
      } else {
        http.tag = tagData; //发现一样的请求 并且是循环请求 则循环使用
        http.isLook = isLook;
        http.sendData(reqData);
        return;
      }
    }
    this.reqIndex += 1;
    http = new httpIns(url, action, reqcounts, this.reqIndex);
    http.httpIns = this.httpIns;
    http.tag = tagData;
    http.isLook = isLook;
    http.sendData(reqData);
    this.httpIns.push(http);
  }

  /**销毁一个http*/
  destoryHttp(http) {
    for (let i = 0; i < this.httpIns.length; i++) {
      if (this.httpIns[i] == http) {
        this.httpIns[i].destory();
        this.httpIns.splice(i, 1);
        break;
      }
    }
  }

  /**销毁所有http*/
  destoryAllHttp() {
    for (let i = 0; i < this.httpIns.length; i++) {
      this.httpIns[i].destory();
    }
    this.httpIns.length = 0;
  }
}

class httpIns {
  constructor(_url, _action, _reqcounts, _reqIndex) {
    this.url = _url; //请求服务地址
    this.reqdata = {}; //请求所需参数
    this.curReqCounts = 0; //当前请求次数
    this.maxReqCounts = _reqcounts; //最大允许请求次数
    this.reqIndex = _reqIndex; //在所有请求中的唯一索引
    this.falutdaly = 0; //触发计时器的时间间隔
    this.faulttimer = null; //触发重复请求的计时器
    this.action = _action; /**行为标志*/
    this.tag = null; /**前端标记*/
    this.isLook = false; /**是否轮询web 如果轮询则此web一旦创建就不会销毁，除非请求失败达到最大请求数后自动销毁*/
    this.isDes = false; //是否已经销毁 用来拦截数据接收（可能会收到已经干掉的请求数据，则根据isDes标志来拒收）
    this.httpIns = [];
  }

  /**发送请求*/
  sendData(value, type = this.reqIndex) {
    if (!this.isDes) {
      this.curReqCounts += 1; //请求次数+1；
      this.reqdata = value; //请求参数
      this.reqdata.reqcounts = type + "_" + this.curReqCounts; //将请求次数加到参数里

      // let _reqdata = JSON.stringify(this.reqdata);
      axios({ url: this.url, method: "post", data: this.reqdata })
        .then(this.resultOK.bind(this))
        .catch(this.resultFault.bind(this));
    } else {
      console.log("此http实例已经销毁，禁止向服务器发送任何请求");
    }
  }

  /**请求成功 */
  resultOK(data) {
    if (!this.isDes) {
      data.tag = this.tag;
      if (data.data.ret !== 0) {
        // console.log("请求成功---------------------------");
        if (data.data.ret == 606) {
          // Router.push("/login")
          subscription.getInstance().notify({ dataType: "loginout" });
        } else {
          subscription
            .getInstance()
            .notify({ dataType: "httperrornot200" }, data.data);
        }
      } else {
        data.data.msg = "操作成功";
      }
      subscription.getInstance().notify(this.tag, data.data);
      this.remove();
      this.destory();
    } else {
      console.log("此http实例已经销毁，禁止接收请求返回的任何数据");
    }
  }

  /**请求失败 */
  resultFault(error) {
    if (!this.isDes) {
      if (this.curReqCounts < this.maxReqCounts) {
        if (this.faulttimer != null) clearTimeout(this.faulttimer);
        this.falutdaly += 500;
        this.faulttimer = setTimeout(
          this.sendData.bind(this, this.reqdata),
          this.falutdaly
        );
      } else {
        if (this.faulttimer != null) clearTimeout(this.faulttimer);
        this.isLook = false;
        this.tag.result = false;
        // subscription.getInstance().notify(this.tag,error);
        // console.log("------------io错误");
        subscription
          .getInstance()
          .notify(
            { dataType: "httperror" },
            { msg: "请求超时，请稍后再试" }
          );
        this.remove();
        this.destory();
      }
    } else {
      console.log("此http实例已经销毁，禁止接收请求触发的任何错误");
    }
  }

  /**从httpIns移除 */
  remove() {
    for (let i = 0; i < this.httpIns.length; i++) {
      if (this.httpIns[i] == this) {
        this.httpIns.splice(i, 1);
        break;
      }
    }
  }

  /** 销毁*/
  destory() {
    this.isDes = true;
    this.tag = null;
    this.isLook = false;
    this.reqdata = null;
    this.httpIns = null;
    if (this.faulttimer != null) clearTimeout(this.faulttimer);
  }
}
