<template>
  <div class="foot">
    <div class="footer_center">
      <div class>
        <img src="@/assets/logo.png" alt />
      </div>
      <ul>
        <li>
          <h4>{{$t('footer.platformServe')}}</h4>
          <span @click="toRate">{{$t('footer.rateStandards.name')}}</span>
          <span @click="toCurrency">{{$t('footer.currencyIntroduce.name')}}</span>
          <span @click="toUpBApply">{{$t('footer.goUpApplication.name')}}</span>
        </li>
        <li>
          <h4>{{$t('footer.userSupport')}}</h4>
          <span @click="toSLA">{{$t('footer.serviceAgreement.name')}}</span>
          <span @click="toQuestion">{{$t('footer.FAQ.name')}}</span>
          <span @click="toNotice">{{$t('footer.newsCenter.name')}}</span>
          <span @click="toHelp">{{$t('footer.helpCenter.name')}}</span>
        </li>
        <li>
          <h4>{{$t('footer.contactUs')}}</h4>
          <span class="icon_div">
            <i class="iconfont icon-twitter"></i>
            <i class="iconfont icon-facebook"></i>
            <i class="iconfont icon-linkedin"></i>
            <i class="iconfont icon-telegram"></i>
            <i class="iconfont icon-xinlang"></i>
            <i class="iconfont icon-wechat"></i>
          </span>

          <span class="little">{{$t('footer.goUpApplication.name')}}：listing@QB.com</span>
          <span class="little">{{$t('footer.business')}}&{{$t('footer.mediaCooperation')}}：business@QB.</span>
          <span class="little">{{$t('footer.contactCustomerService')}}：support@QB.com</span>
        </li>
      </ul>
    </div>
    <p class="foot_bottom">© 2019 QB.com . All rights reserved</p>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  components: {},
  mounted() {},
  computed: {},
  methods: {
    toRate() {
      // 跳转打开新窗口到 费率标准
      const { href } = this.$router.resolve({
        name: "rate",
        params: { id: 0 }
      });
      window.open(href, "_blank");
    },
    toCurrency() {
      // 跳转打开新窗口到 币种介绍
      const { href } = this.$router.resolve({
        name: "currency",
        params: { id: 0 }
      });
      window.open(href, "_blank");
    },
    toUpBApply() {
      // 跳转打开新窗口到 上币申请
      const { href } = this.$router.resolve({
        name: "upBApply",
        params: { id: 0 }
      });
      window.open(href, "_blank");
    },
    toSLA() {
      // 跳转打开新窗口到 服务协议
      const { href } = this.$router.resolve({
        name: "SLA",
        params: { id: 0 }
      });
      window.open(href, "_blank");
    },
    toQuestion() {
      // 跳转打开新窗口到 常见问题
      const { href } = this.$router.resolve({
        name: "question",
        params: { id: 0 }
      });
      window.open(href, "_blank");
    },
    toNotice() {
      // 跳转打开新窗口到 公告中心
      const { href } = this.$router.resolve({
        name: "notice",
        params: { id: 0 }
      });
      window.open(href, "_blank");
    },
    toHelp() {
      // 跳转打开新窗口到 帮助中心
      const { href } = this.$router.resolve({
        name: "help",
        params: { id: 0 }
      });
      window.open(href, "_blank");
    },
  }
};
</script>

<style lang="less">
.foot {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 300px;
  background: linear-gradient(
    to left,
    rgba(1, 19, 55, 1) 0%,
    rgba(0, 0, 0, 1) 100%
  );

  .footer_center {
    width: 62.5%;
    box-sizing: border-box;
    padding-top: 58px;
    display: flex;
    justify-content: space-between;
    .logo_div > img {
      width: 121px;
    }

    ul {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      li {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 18%;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 14px;
        h4 {
          font-size: 16px;
          margin-bottom: 8px;
          white-space: nowrap;
        }
        span {
          display: inline-block;
          white-space: nowrap;
          margin: 10px 0;
          color: rgba(255, 255, 255, 0.5);
        }
        .icon_div > i {
          display: inline-block;
          margin-right: 30px;
        }
        .icon_div > i:hover {
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
        }
        &:first-of-type span:hover,
        &:nth-of-type(2) span:hover {
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
        }
        .little {
          font-size: 12px;
        }
      }
    }
  }
  .foot_bottom {
    font-size: 12px;
    margin-bottom: 16px;
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
