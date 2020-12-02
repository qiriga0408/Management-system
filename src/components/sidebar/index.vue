<template>
  <el-menu
    mode="vertical"
    unique-opened
    class="el-menu-vertical-demo"
    style="border-right:none;"
    @open="handleOpen"
    @close="handleClose"
    :collapse="this.$store.state.isCollapse"
    :default-active="$route.path"
    background-color="#20222a"
    text-color="#fff"
    active-text-color="#00A0FF"
    :router="false"
  >
    <template v-for="item in routes.filter(v=>!v.hidden&&v.children)">
      <router-link
        v-if="item.children.length===1 && !item.children[0].children && !item.alwaysShow"
        :to="item.path+'/'+item.children[0].path"
        :key="item.children[0].name"
      >
        <el-menu-item
          :index="item.path+'/'+item.children[0].path"
          :class="{'submenu-title-noDropdown':!isNest}"
        >
          <i
            v-if="item.children[0].meta&&item.children[0].meta.icon"
            :class="item.children[0].meta.icon"
          ></i>
          <span
            v-if="item.children[0].meta&&item.children[0].meta.title"
            slot="title"
          >{{item.children[0].meta.title}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <i v-if="item.meta&&item.meta.icon" :class="item.meta.icon"></i>
          <span
            v-if="item.meta&&item.meta.title"
          >{{item.meta.title}}</span>
        </template>

        <template v-for="child in item.children.filter(v=>!v.hidden)">
          <sidebar-item
            :is-nest="true"
            class="nest-menu"
            v-if="child.children&&child.children.length>0"
            :routes="[child]"
            :key="child.path"
          ></sidebar-item>
          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </el-menu>
</template>

<script>
import sidebarItem from "./sidebarItem";

export default {
  data() {
    return {
      // isCollapse: this.$store.state.isCollapse,
      routes: this.$store.state.routerData
    };
  },
  components: { sidebarItem },
  computed: {
    // routes() {
    //   return global.antRouter;
    // }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 220px;
  // min-height: 400px;
  
}
a {
    text-decoration: none;
  }
</style>

