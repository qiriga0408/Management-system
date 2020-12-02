<!--注册-->
<template>
  <div class="container">
    <p class="height_set"></p>
    <div class="main">
      <ul>
        <li class="first_information">欢迎注册</li>
        <li v-if="false" class="tabs_li">
          <div
            @click="tabActiveIdx = 0"
            :class="tabActiveIdx==0?'tab_div tab_active':'tab_div'"
          >手机注册</div>
          <div>|</div>
          <div
            @click="tabActiveIdx = 1"
            :class="tabActiveIdx==1?'tab_div tab_active':'tab_div'"
          >邮箱注册</div>
        </li>
        <li :class="errorData?'input_li error_display':'input_li'">
          <input-move :pbText="'邮箱账号'" :errorText="errorData" :isVcode="false"></input-move>
          <!-- <div class="input_div">
            <div :class="isMove?'placeHolder_div move_ph_div':'placeHolder_div'">邮箱账号</div>
            <input @focus="inputFocus()" @blur="inputBlur()" type="text" />
          </div>-->
        </li>
        <li class="input_li">
          <input-move :pbText="'验证码'" :isVcode="true"></input-move>
        </li>
        <li class="input_li">
          <input-move :pbText="'邀请码（选填）'"></input-move>
        </li>
        <li>
          <div @click="checkedClick()" :class="isChecked?'check_div checked_div':'check_div'">
            <i v-show="isChecked" class="iconfont icon-check"></i>
          </div>
          <span class="clause_span">
            我已阅读并同意
            <a href="javascript:;">《服务条款》</a>
          </span>
        </li>
        <li class="res_btn_li">
          <button class="res_btn">注册</button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import inputMove from "@/components/inputMove.vue";
export default {
  data() {
    return {
      tabActiveIdx: 0, //切换方式
      isChecked: true, //是否已阅读服务条款

      errorData: null //'该号码未进行注册'
    };
  },
  components: {
    inputMove
  },
  created() {
    window.scrollTo(0, 0);
  },
  mounted() {},
  methods: {
    checkedClick() {
      if (this.isChecked) {
        this.isChecked = false;
      } else {
        this.isChecked = true;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  // height: 1080px;
  background-image: url("~@/assets/loginBg.svg");
  background-repeat: no-repeat;
  background-size: contain;
  // display: flex;
  // justify-content: space-around;
  // align-items: center;
  position: relative;
  .height_set {
    padding-bottom: 56.24%;
  }
  .main {
    position: absolute;
    width: 30.7%;
    top: 17.2%;
    left: 50%;
    margin-left: -16%;
    height: 47.3%;
    ul {
      width: 100%;
      height: 100%;
      li {
        width: 100%;
        margin: 3.1% 0;
        display: flex;

        .check_div {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 20px;
          height: 20px;
          margin-right: 9px;
          border-radius: 2px;
          border: 1px solid rgba(255, 255, 255, 1);
          &:hover {
            cursor: pointer;
          }
          .icon-check {
            font-size: 17px;
            color: #fff;
          }
        }
        .checked_div {
          background: #ff9900;
          border-color: #ff9900;
        }
        .clause_span {
          font-size: 14px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          a {
            color: #ff9900;
            text-decoration: none;
          }
        }
      }
      .tabs_li {
        display: flex;
        align-items: center;
        font-size: 16px;
        height: 18%;
        div {
          margin-right: 16px;
        }
        .tab_div:hover {
          cursor: pointer;
        }
        .tab_active {
          font-family: PingFangSC-Medium;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          font-size: 18px;
        }
      }
      .input_li {
        width: 100%;
        height: 13.3%;
      }
      .res_btn_li {
        width: 100%;
        height: 13.3%;
        .res_btn {
          width: 100%;
          height: 100%;
          background: rgba(255, 153, 0, 1);
          border-radius: 4px;
          border: none;
          font-size: 16px;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
          &:hover {
            cursor: pointer;
          }
        }
      }
      .first_information {
        font-size: 35px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
      }
      .error_display {
        margin-bottom: 30px;
      }
      @media screen and (max-width: 992px) {
        .first_information {
          font-size: 30px;
        }
        .tabs_li {
          font-size: 15px;
        }
        li {
          .check_div {
            width: 16px;
            height: 16px;
            .icon-check {
              font-size: 15px;
            }
          }
          .clause_span {
            font-size: 12px;
          }
        }
        .res_btn_li {
          .res_btn {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>



