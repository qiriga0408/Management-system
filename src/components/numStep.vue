<template>
  <div class="d1" :style="styleMain">
    <div
      :class="disNumMin? 'downbtn disDownBg':'downbtn'"
      :style="'width:'+height+'px;height:'+height+'px;'"
      @click="click(-1)"
    ></div>
    <div class="num">
      <span>{{num}}</span>
      <span></span>
      <div class="nuit_div">{{unitName}}</div>
    </div>
    <div
      :class="disNumMax? 'upbtn disUpBg':'upbtn'"
      :style="'width:'+height+'px;height:'+height+'px;'"
      @click="click(1)"
    ></div>
  </div>
</template>
<script>
export default {
  props: {
    max: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: 1
    },
    step: {
      type: Number,
      default: 1
    },
    width: {
      type: Number,
      default: 1
    },
    height: {
      type: Number,
      default: 1
    },
    unitName: {
      type: String,
      default: ""
    },
    //此处一定要用value 用来跟踪外面v-model 的改变
    value: {
      type: Number
    }
  },
  data() {
    return {
      num: this.value, //声明新的值 指向prop属性 就不会出现修改造成的警告了

      // 换disable背景图
      disNumMin: false,
      disNumMax: false
    };
  },
  computed: {
    //内联样式
    styleUl: function() {
      return {
        width: this.width + "px",
        zIndex: this.z
      };
    },

    styleMain: function() {
      return {
        width: this.width + "px",
        height: this.height + "px"
      };
    }
  },
  mounted() {
    this.check(this.num);
  },
  watch: {
    value(newVal) {
      this.check(newVal);
    },
    num: function(val) {
      this.$emit("input", this.num);
      this.$emit("change", this.num);
    }
  },
  methods: {
    click(dic) {
      let _num = this.num;
      _num += dic * this.step;
      this.check(_num);
    },
    check(_num) {
      if (_num <= this.min) {
        this.disNumMin = true;
        _num = this.min;
      } else if (_num >= this.max) {
        this.disNumMax = true;
        _num = this.max;
      }
      if (_num != this.num) {
        this.num = _num;
        this.disNumMin = false;
        this.disNumMax = false;
      }
    }
  }
};
</script>
<style scoped>
.d1 {
  border: 1px solid rgba(230, 231, 232, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.num {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  font-size: 14px;
  font-family: DIN-Bold;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.nuit_div {
  position: absolute;
  right: 0;
  width: 40px;
  font-size: 12px;
  font-family: DIN-BlackItalic;
  font-weight: normal;
  color: rgba(153, 153, 153, 1);
  text-align: left;
}
.upbtn {
  background: url("~@/assets/plus.png") no-repeat center center, #f5f5f5;
  cursor: pointer;
  border-left: 1px solid rgba(230, 231, 232, 1);
  margin: 0;
  padding: 0;
}
.downbtn {
  background: url("~@/assets/reduce.png") no-repeat center center, #f5f5f5;
  cursor: pointer;
  border-right: 1px solid rgba(230, 231, 232, 1);
}
.disUpBg {
  background: url("~@/assets/plusNo.png") no-repeat center center, #f5f5f5;
}
.disDownBg {
  background: url("~@/assets/reduceNo.png") no-repeat center center, #f5f5f5;
}
</style>


