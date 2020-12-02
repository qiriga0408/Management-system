<!--用户信息详情-->
<template>
  <div class="userinfo">
    <div class="w_menu">
      <el-date-picker
        v-model="time"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="选择日期"
        @change="pickchange"
      ></el-date-picker>

      <el-button type="primary" class="buttons" @click="search">搜索</el-button>
    </div>
    <div class="dc1">
      <div class="dc1_left">
        <Label
          :title="'代理UID:'"
          :value="userdata?userdata.uid:'--'"
          titleWidth="200px"
          valueWidth="250px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <!-- <Label :title="'我的账号:'"         :value="userdata?userdata.realname:''" titleWidth="200px" 
          valueWidth="250px" labelContainer = "defaultLabelC" labelTitle = "defaultLabelt" 
        labelContext = "defaultLabelv" ></Label>-->

        <Label
          :title="'代理用户名:'"
          :value="userdata?userdata.name:'--'"
          titleWidth="200px"
          valueWidth="250px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'代理邀请码:'"
          :value="userdata?userdata.invitecode:'--'"
          titleWidth="200px"
          valueWidth="250px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
      </div>
      <div style="width:100%;display:flex;text-align:left">
        <span style="width:200px">清算时间：</span>
        <span>每日02:00:00以后 (当日清算前一日金额，时区UTC+8)</span>
      </div>
      <div style="width:100%;display:flex;text-align:left">
        <span style="width:200px">结算时间：</span>
        <span>每日14:00:00以后 (当日结算前一日金额，时区UTC+8)</span>
      </div>
      <!-- </div> -->
    </div>
    <div class="dc1">
      <div style="width:100%;text-align:left;height:30px;font-weight:600">
        <span style="width:200px">总计结算佣金奖励：</span>
        <span style="text-align:left">{{userdata?userdata.total:'--'}}</span>
      </div>
      <div class="dc1_left">
        <Label
          :title="'代理佣金返佣比例：'"
          :value="userdata?userdata.agentrebateratio+'%':'--'"
          titleWidth="200px"
          valueWidth="250px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'当日清算直推佣金：'"
          :value="userdata?userdata.dayinvitedauditcommission:'--'"
          titleWidth="200px"
          valueWidth="250px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'累计清算直推佣金：'"
          :value="userdata?userdata.invitedauditcommission:'--'"
          titleWidth="200px"
          valueWidth="250px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>

        <Label
          :title="'累计清算邀请直推人数：'"
          :value="userdata?userdata.invitednumbers:'--'"
          titleWidth="200px"
          valueWidth="250px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
      </div>
      <div class="dc1_left">
        <Label
          :title="'当日清算代理佣金：'"
          :value="userdata?userdata.dayagentrebatecommission:'--'"
          titleWidth="200px"
          valueWidth="250px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'累计清算代理佣金：'"
          :value="userdata?userdata.agentrebatecommission:'--'"
          titleWidth="200px"
          valueWidth="250px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'累计子节点数：'"
          :value="userdata?userdata.agentnumbers:'--'"
          titleWidth="200px"
          valueWidth="250px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
      </div>
    </div>
    <div class="dc1">
      <div class="dc1_left">
        <Label
          :title="'当月清算直推业绩成交额：'"
          :value="userdata?userdata.monthachievement:'--'"
          titleWidth="200px"
          valueWidth="250px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'当月清算获得所有佣金：'"
          :value="userdata?userdata.monthcommission:'--'"
          titleWidth="200px"
          valueWidth="250px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>

        <Label
          :title="'当月清算新增直推邀请人数：'"
          :value="userdata?userdata.monthinvitedaudit:'--'"
          titleWidth="200px"
          valueWidth="250px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'当月清算交易人数：'"
          :value="userdata?userdata.monthtradernumber:'--'"
          titleWidth="200px"
          valueWidth="250px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
      </div>
    </div>
  </div>
</template>
<script>
import Label from "@/components/label";
import { GETMYCOMMISSION } from "@/constant";
export default {
  data() {
    return {
      time: null, //默认时间选择控件
      userdata: null,
      uid: this.$route.query.userid
    };
  },
  components: {
    Label: Label
  },
  mounted() {
    this.time = this.getNowDate();
    this.$register(this);
    this.msg = [GETMYCOMMISSION];
    this.search();
  },
  computed: {},
  methods: {
    pickchange() {
      this.search();
    },
    getNowDate() {
      //获取当前时间
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      return year + "-" + month + "-" + day;
    },
    search() {
      //日期快照搜索按钮
      let day = null;
      if (this.time) {
        day = this.time;
      } else {
        console.log("没有选择任何时间");
      }
      this.$api.getAgentDetail({
        tag: {
          tdate: day,
          uid: this.uid,
          dataType: GETMYCOMMISSION
        }
      });
    },

    message(tag, data) {
      for (var pro in data.data) {
        if (data.data[pro] === undefined || data.data[pro] == null) {
          data.data[pro] = "--";
        }
      }
      switch (tag.dataType) {
        case GETMYCOMMISSION:
          if (data.ret === 0) {
            this.userdata = data.data;
            this.userdata.total = Number(
              Number(this.userdata.invitedauditcommission) +
                Number(this.userdata.agentrebatecommission)
            );
          }
          break;
      }
    }
  },
  beforeDestroy() {
    this.$unRegister(this);
  }
};
</script>

<style lang="less" scoped>
.userinfo {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dc(@h: 28px) {
  display: flex;
  padding: 20px 0px;
  box-sizing: border-box;
  border-bottom: 1px solid#F0F2F5;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
}
.dc1 {
  .dc(100px);
  justify-content: flex-start;
  .dc1_left {
    padding-right: 100px;
  }
}

.w_menu {
  width: 100%;
  flex-shrink: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding-bottom: 10px;
}

.buttons {
  margin-left: 30px;
}
</style>
