<template>
  <div class="zq-drop-list" v-clickoutside="handleClose">
    <div class="select_div">
      <span @click="show = !show">
        {{dplLable}}
        <i :class="show?'rotate_i':''"></i>
      </span>
    </div>
    <ul v-show="show">
      <li
        v-for="(item, index) in dataList"
        :key="index"
        @click="onLiClick(index, $event)"
      >{{item[labelProperty1]}} {{item[labelProperty2]}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "DropDownList",
  data() {
    return {
      activeIndex: 0,
      show: false
    };
  },
  props: {
    dataList: {
      type: Array,
      default() {
        return [
          { name: "+86" },
          { name: "+53" },
          { name: "+23" },
          { name: "+123" },
          { name: "+657" },
          { name: "+8456" },
          { name: "+8456" },
          { name: "+8456" },
          { name: "+8456" }
        ];
      }
    },
    labelProperty1: {
      type: String,
      default() {
        return "city";
      }
    },
    labelProperty2: {
      type: String,
      default() {
        return "code";
      }
    }
  },
  directives: {
    // dpl: {
    //   bind(el) {
    //     el.style.display = "none";
    //   }
    // }
    clickoutside: {
      bind: function(el, binding, vnode) {
        function documentHandler(e) {
          if (el.contains(e.target)) {
            return false;
          }
          if (binding.expression) {
            binding.value(e);
          }
        }
        el._vueClickOutside_ = documentHandler;
        document.addEventListener("click", documentHandler);
      },
      unbind: function(el, binding) {
        document.removeEventListener("click", el._vueClickOutside_);
        delete el._vueClickOutside_;
      }
    }
  },
  methods: {
    handleClose() {
      this.show = false;
    },
    onLiClick(index) {
      this.show = false;
      this.activeIndex = index;
      this.$emit("change", {
        index: index,
        value: this.dataList[index]
      });
    }
  },
  computed: {
    dplLable() {
      return this.dataList[this.activeIndex][this.labelProperty2];
    }
  }
};
</script>


<style scoped lang="less">
.zq-drop-list {
  display: inline-block;
  //   min-width: 100px;
  position: relative;
  height: 100%;
  .select_div {
    width: 16.6%;
    height: 100%;
    display: flex;
    align-items: center;
    span {
      display: block;
      width: 100%;
      height: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      position: relative;
      border-right: 1px solid rgba(90, 100, 119, 1);
      z-index: 4;
      @media screen and (max-width: 1400px) {
        & {
          font-size: 14px;
        }
      }
      @media screen and (max-width: 992px) {
        & {
          font-size: 12px;
        }
      }

      i {
        width: 10px;
        height: 10px;
        background: url("~@/assets/littlepush.png") no-repeat center center;
        margin-left: 6px;
        display: inline-block;
        transition: 0.375s;
      }
      .rotate_i {
        transform: rotate(180deg);
      }
      &:hover {
        cursor: pointer;
      }
    }
  }
  ul {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: 340%;
    margin: 0;
    padding: 0;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    overflow: auto;
    z-index: 4;
    box-sizing: border-box;
    background: #010b1e;
    li {
      list-style: none;
      height: 46px;
      line-height: 46px;
      font-size: 14px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      padding-left: 6.1%;
      box-sizing: border-box;
      text-align: left;
      @media screen and (max-width: 1400px) {
        & {
          height: 40px;
          line-height: 40px;
        }
      }
      @media screen and (max-width: 992px) {
        & {
          height: 30px;
          line-height: 30px;
        }
      }
    }
    li:hover {
      background: rgba(255, 255, 255, 0.1041);
    }
    ::-webkit-scrollbar {
      width: 2px;
      background-color: #010b1e;
    }
    ::-webkit-scrollbar-thumb {
      width: 2px;
      background: rgba(255, 255, 255, 1);
      border-radius: 100px 3px 100px 100px;
      opacity: 0.39630000000000004;
    }
  }
}
</style>