/* eslint-disable prettier/prettier */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false, //登陆状态
    token: "", //登陆返回token
    isfull: false, //是否全屏
    isFootHide: false, //是否只隐藏底部
    theme: "white", //主题 默认白色  黑色 black
    userData: {}, //用户数据
    routerData: [], //侧边栏菜单存储
    isCollapse: false, //侧边栏菜单展开收缩
    iscg: false, //是否是超级管理员 拥有所有权限
    modelid: 0, //权限模板id
    qx: {} //权限列表
  },

  mutations: {
    /**设置路由存储 */
    setRouterData(state, data) {
      state.routerData = data;
    },
    /**设置侧边栏菜单展开收缩 */
    setIsCollapse(state, data) {
      state.isCollapse = data;
    },
    /**设置登陆状态 */
    setLogin(state, data){
      state.isLogin = data.login;
      state.token = data.token;
    },
    /**退出登陆 */
    setLoginOut(state){
      state.isLogin = false;
      state.token = "";
    },
    /**设置用户数据 */
    setUserData(state, data) {
      state.userData = data;
    },
    /**设置是否全屏 */
    setFull(state, value) {
      state.isfull = value;
    },

    /**设置主题色 */
    setTheme(state, value) {
      state.theme = value;
    },

    /**设置是否隐藏底部 */
    setFootHide(state, value) {
      state.isFootHide = value;
    },

    setModelId(state, value) {
      state.modelid = value;
    },
    /**设置权限 */
    setQx(state, value) {
      state.iscg = value.iscg; //是否是超级管理员 拥有所有权限
      state.qx = value.models; //权限列表
    }
  },
  actions: {}
});
