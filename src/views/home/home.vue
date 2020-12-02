<template>
  <div class="homeweb">
    <el-container>
      <el-aside style="width:auto">
        <!-- 侧栏头部logo -->
        <div class="logo">
          <span :style="$store.state.isCollapse?'padding-left:0px;':'padding-left: 20px;'">EX.OP.DM</span>
          
          <!-- <img :style="$store.state.isCollapse?'width:64px;padding-left:0px;':'width:auto;padding-left: 20px;'" src="@/assets/logo.png" alt /> -->
        </div>
        <!-- 侧栏菜单 -->
        <ElMenu />
      </el-aside>
      <!-- 右侧部分 -->
      <el-container class="main_con">
        <!-- 头部 -->
        <el-header class="header" style="height:auto">
          <Head v-if="!$store.state.isfull" id="Top" class="isFixed"></Head>
        </el-header>
        <!-- 内容 -->
        <el-main>
          <router-view class="router">
            <three-view></three-view>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
    <!-- <Foot v-if="!$store.state.isfull && !$store.state.isFootHide"></!-->
  </div>
</template>
<script>
import Head from "./Head";
import Foot from "./Foot";
import threeView from "./threeView";
import ElMenu from "@/components/sidebar";
export default {
  data() {
    return {
      isCollapse: this.$store.state.isCollapse,
    };
  },
  components: {
    Head,
    Foot,
    ElMenu,
    threeView
  },
  mounted() {},
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  }
};
</script>
<style lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 220px;
  // min-height: 400px;
}
// 左侧菜单导航
.el-aside {
  color: #333;
  text-align: left;
  // 左侧头部logo
  .logo {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color:#fff;
    font-weight: 600;
    span{
      transition: 0.375s;
    }
  }
}
// 内容部分
.el-main {
  width: 100%;
  color: #333;
  text-align: center;
  padding-left: 49px;
  box-sizing: border-box;
}

body > .el-container {
}
// 顶级div
.homeweb {
  height: 100%;
  .el-container {
    width: 100%;
    height: 100%;
    .el-aside {
      background: #20222a;
    }
    .header {
      padding: 0;
    }
  }
}
</style>
