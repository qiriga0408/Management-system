<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import Service from "./http.js";
import {HTTPERRORnot200,HTTPERROR} from "./constant";
export default {
  data(){
    return{   
      llqk:new Date().getTime(),
    }
  },
  beforeCreate(){
    let _time = localStorage.getItem('ot')
    if(_time){
      if(new Date().getTime()-_time>30*60000){
        localStorage.clear()
      }
    }
  },
  mounted(){
    this.$register(this);
    this.msg = [ HTTPERRORnot200, HTTPERROR];
    let that = this;
   
    window.onbeforeunload=function(event){  
      localStorage.setItem('ot',new Date().getTime())
    }
  },
  methods:{
    message(tag,data){
      switch(tag.dataType){
        case HTTPERRORnot200:
          this.$msg.error({ title: '失败',message:data.msg});
          break;
        case HTTPERROR:
          this.$msg.error({ title: '失败',message:data.msg});
          break;
      }
    }
  },
}
</script>

<style lang="less">
 @import './style/label.less';
//-----------------------------------------------全局滚动条样式-----------------------


#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  height: 100%;
  position: absolute;
  left: 0;right: 0;top: 0;bottom: 0;
   .el-dialog {
    width: 510px;
    border-radius: 6px;
    .el-dialog__header {
      padding: 0;
      padding-left: 16px;
      line-height: 49px;
      height: 49px;
      border-bottom: 1px solid #e4e5e8;
      text-align: left;
      .el-dialog__title{
        font-size: 16px;
      }
    }
    .el-dialog__headerbtn {
      height: 49px;
      top: 0px;
      right: 16px;
    }
    .el-dialog__body {
      width: 80%;
      margin: 0 auto;
      padding: 40px 0;
      .el-form-item{
        // margin-bottom: 0;
        .el-form-item__label{
          text-align: left;
        }
      }
      // .el-form-item__content{
      //   margin-left: 50px;
      // }
    }
    .el-dialog__footer {
      padding: 0px;
      height: 49px;
      line-height: 49px;
      padding-right: 16px;
      border-top: 1px solid #e4e5e8;
    }
  }
}

.el-main{
  height: 100%;
  
}

//穿梭框左对齐
.el-transfer-panel{
  text-align: left; 
}


.icon-xingxing1{
  color: #f90;
}

.searchTitle{
  padding-right: 8px;
}

//表格通用样式
.t_table{
  width: 100%;
  border: 1px solid #c0c4cc;
  border-collapse: collapse;
  margin-bottom: 15px;
  font-size: 14px;
  .t_trh{
    width: 100%;text-align: center;height: 35px;
    .t_th{
      border: 1px solid #c0c4cc;font-size: 16px;height: 40px;
    }
  }
  .t_tr{
    width: 100%;text-align: center;height: 35px;
    .t_td{
      border: 1px solid #c0c4cc;
    }
  }
}
</style>
