/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router/router";
import store from "./store";
import Api from "./api.js";
import Subscription from './subscription.js';
import VueI18n from "vue-i18n";
import "./assets/iconfont/iconfont.css";
import './promission' //这里进行路由后台获取的模拟
import { Notification } from 'element-ui';
import echarts from 'echarts';
import VueClipboard from 'vue-clipboard2' //复制功能的插件

import JsonBig from 'json-bigint';

// 重写JSON.stringify 以兼容 js大数丢失精度的问题
JSON.stringify = (...parmas) => JsonBig.stringify(...parmas)

// 重写JSON.stringify 以兼容 js大数丢失精度的问题
JSON.parse = (...parmas) => JsonBig.parse(...parmas)


Vue.use(VueClipboard)

Vue.use(ElementUI);

Vue.use(VueI18n);


Vue.config.productionTip = false;

Vue.prototype.$api = new Api();

Vue.prototype.$msg = Notification;

Vue.prototype.$echarts = echarts;
//注册
Vue.prototype.$register = function(ob) { Subscription.getInstance().add(ob); }

//取消注册
Vue.prototype.$unRegister = function(ob) { Subscription.getInstance().remove(ob); }

//发通知
Vue.prototype.$notify = function(tag, data) { Subscription.getInstance().notify(tag, data); }

//数组内容--处理
Vue.prototype.$pro_ = function(list, str){
    //--处理
    if (!list) return;
    for (let i = 0, il = list.length; i < il; i++) {
        for (let pro in list[i]) {
            if (!list[i][pro] && list[i][pro] != 0)
                list[i][pro] = str || '--';
        }
    }
}

//输入内容验证
Vue.directive('valid', {
    bind: function(el, binding) {
        binding.value.input = el.querySelector('input');
        binding.value.type = binding.value.type || 1;
        el.f = function(e) {
            Vue.prototype.$_vaild(binding.value);
            if (binding.value.type === 2 && e.keyCode == 229) { //中文输入法 回车后 延时触发input事件 再次通知v-model
                let st = setTimeout(() => {
                    binding.value.input.value = "";
                    binding.value.input.dispatchEvent(new Event('input'));
                    clearTimeout(st);
                }, 10);
            }
        }
        if (binding.value.type === 1) {
            el.addEventListener('change', el.f)
        } else {
            el.addEventListener('keydown', el.f)
        }
    },
    unbind: function(el, binding) {
        //移除键盘抬起事件
        el.removeEventListener('change', el.f);
        //移除中文输入结束事件
        el.removeEventListener('keydown', el.f)
            //清空处理函数引用
        el.f = null;
    }
})

//禁止输入 （替换空）  还是 验证  正则  
//type 1 验证输入 2禁止输入  默认1 
//reg 执行的正则 必填
//repstr 替换的字符串 默认 ""
//msg 验证错误提示 默认不弹出
//-----------------非指令方式直接调用$_vaild 方式 验证某个对象里的某个属性是否合法或者替换某些字符串
//data 宿主对象 pro 宿主里的某个属性  非input标签使用 必填 比如验证 a = {"b":123} a.b  data = a pro = b
//func 方法 默认 test  非input标签使用 必填
Vue.prototype.$_vaild = function(data) {

    let reg = {
        "num": /[^\d]/g, //只能是0-9数字
        "num.": /[^\d]/g, //只能是0-9数字和.
        "num+-": /[^\d]/g, //只能是0-9数字和+- 符号
        "num+-.": /[^\d]/g, //只能是0-9数字和+-.符号
        "numAa": /[^\d]/g, //只能是0-9数字和英文大小写字母
        "phone": /^1[34578]\d{9}$/, //必须符合手机号格式
    }
    data.take = data.take || "test"; //执行方法 替换  还是 检测 还是...
    if (data.input) {
        let input = data.input,
            value = input.value;
        if (data.type === 1) {
            if (!new RegExp(reg[data.reg]).test(value)) {
                input.value = "";
                input.dispatchEvent(new Event('input'));
                data.msg && this.$message({ message: data.msg, type: "error" })
            }
        } else if (data.type === 2) {
            input.value = value.replace(reg[data.reg], data.repstr || "");
            input.dispatchEvent(new Event('input'));
        }
    } else {
        //非指令方式  data 宿主对象 pro 宿主里的某个属性 func 方法 replace | test 例：  {"data":{},"pro":"xxx","reg":"xxx","msg":"xxx"} 
        data.func = data.func || "test";
        let value = data.data[data.pro];
        if (data.func === "replace") {
            data.repstr = data.repstr || ""; //替换的字符串
            data.data[data.pro] = value.replace(reg[data.reg], data.repstr || ""); //直接替换
        } else if (data.func === "test") {
            let re = new RegExp(reg[data.reg]);
            let b = re.test(value);
            !b && data.msg && this.$message({ message: data.msg, type: "error" }) //如果有msg 则弹出msg提示
            return b; //返回验证结果
        }
    }
};


const i18n = new VueI18n({
    locale: 'zh', //默认中文
    messages: {
        'zh': require('@/assets/languages/zh.json'),
        'en': require('@/assets/languages/en.json')
    }
})

window.v = new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
}).$mount("#app");