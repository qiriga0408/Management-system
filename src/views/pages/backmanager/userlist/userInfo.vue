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
      <el-button
        type="primary"
        v-if="$store.state.qx.bcuserpionts"
        class="buttons"
        @click="integralInfo"
      >积分信息</el-button>
    </div>
    <div class="dc1">
      <div class="dc1_left">
        <Label
          :title="'用户名：'"
          :value="userdata.username"
          titleWidth="150px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'UID:'"
          :value="userdata.userid"
          titleWidth="150px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'国家地区:'"
          :value="'+'+userdata.area_code+' '+userdata.country_cn"
          titleWidth="150px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'KYC实名:'"
          :value="userdata.real_name"
          titleWidth="150px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'KYC证件号:'"
          :value="userdata.card_no"
          titleWidth="150px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'邀请码:'"
          :value="userdata.invitecode"
          titleWidth="150px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'上级UID：'"
          :value="parentuid"
          titleWidth="150px"
          valueWidth="250px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'注册时间：'"
          :value="userdata.createdtime"
          titleWidth="150px"
          valueWidth="250px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'最新登陆时间：'"
          :value="userdata.lastlogintime"
          titleWidth="150px"
          valueWidth="250px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
      </div>
      <div class="dc1_right"></div>
    </div>
    <div class="dc2">
      <span class="dc2_title">资产账户</span>
      <el-table :data="assetData" style="width:100%">
        <el-table-column prop="coinname" label="币种" min-width="50"></el-table-column>
        <el-table-column prop="totalrecharge" label="累计充币" min-width="50">
          <template slot-scope="scope">
            <span>{{Number(scope.row.totalrecharge).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalwithdraw" label="累计成功提币" min-width="50">
          <template slot-scope="scope">
            <span>{{Number(scope.row.totalwithdraw).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalinto" label="累计转入" min-width="50">
          <template slot-scope="scope">
            <span>{{Number(scope.row.totalinto).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalout" label="累计转出" min-width="50">
          <template slot-scope="scope">
            <span>{{Number(scope.row.totalout).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totallegal" label="累计法币购买完成" min-width="50">
          <template slot-scope="scope">
            <span>{{Number(scope.row.totallegal).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalreturning" label="累计返佣金额" min-width="50">
          <template slot-scope="scope">
            <span>{{Number(scope.row.totalreturning).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalairdrop" label="累计空投数量" min-width="50">
          <template slot-scope="scope">
            <span>{{Number(scope.row.totalairdrop).toFixed(6)}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="dc3">
      <span class="dc3_title">交易账户</span>
      <el-table :data="tradeData" style="width:100%">
        <el-table-column prop="coinname" label="币种" min-width="60"></el-table-column>
        <el-table-column prop="totalprofit" label="累计已实现盈亏" min-width="120">
          <template slot-scope="scope">
            <span>{{Number(scope.row.totalprofit).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalclose" label="累计平仓盈亏" min-width="120">
          <template slot-scope="scope">
            <span>{{Number(scope.row.totalclose).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalfee" label="累计手续费" min-width="100">
          <template slot-scope="scope">
            <span>{{Number(scope.row.totalfee).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalinto" label="累计转入" min-width="80">
          <template slot-scope="scope">
            <span>{{Number(scope.row.totalinto).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalout" label="累计转出" min-width="80">
          <template slot-scope="scope">
            <span>{{Number(scope.row.totalout).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="账户资产" min-width="80">
          <template slot-scope="scope">
            <span>{{Number(scope.row.balance).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="floatprofit" label="账户权益" min-width="80">
          <template slot-scope="scope">
            <span>{{Number(scope.row.floatprofit).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="available" label="可用余额" min-width="80">
          <template slot-scope="scope">
            <span>{{Number(scope.row.available).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="margin" label="仓位保证金" min-width="100">
          <template slot-scope="scope">
            <span>{{Number(scope.row.margin).toFixed(6)}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="dc4">
      <span class="dc4_title">合约持仓</span>
      <el-table :data="positionData" style="width:100%">
        <el-table-column prop="contractcode" label="合约代码" min-width="80"></el-table-column>
        <el-table-column prop="coinname" label="保证金币种" min-width="100"></el-table-column>
        <el-table-column prop="accounttype" label="账户模式" min-width="80">
          <template slot-scope="scope">
            <span>{{scope.row.accounttype===1?'全仓':'逐仓'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lever" label="杠杆" min-width="60"></el-table-column>
        <el-table-column prop="forceprice" label="强平价格" min-width="80"></el-table-column>
        <el-table-column prop="side" label="持仓方向" min-width="80">
          <template slot-scope="scope">
            <span>{{scope.row.side==='B'?'买':'卖'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="开仓均价" min-width="80"></el-table-column>
        <el-table-column prop="volume" label="持有张数" min-width="80"></el-table-column>
        <el-table-column prop="volume" label="持仓价值" min-width="80">
          <template slot-scope="scope">
            <span>{{Number(Number(scope.row.volume)*Number(scope.row.parvalue)*Number(scope.row.price)).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="initmargin" label="起始保证金" min-width="100">
          <!-- <template slot-scope="scope">
            <span>{{Number(Number(scope.row.margin)-Number(scope.row.commission)).toFixed(6)}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="adjustmargin" label="调整保证金" min-width="120">
           <template slot-scope="scope">
            <span>{{scope.row.accounttype===1?'--':scope.row.adjustmargin}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="margin" label="仓位保证金" min-width="100">
          <template slot-scope="scope">
            <span>{{Number(Number(scope.row.margin)+Number(scope.row.floatprofit)).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="available" label="可用余额" min-width="80">
          <template slot-scope="scope">
            <span>{{Number(scope.row.available).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="floatprofit" label="未实现盈亏" min-width="100">
          <template slot-scope="scope">
            <span>{{Number(scope.row.floatprofit).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="profitratio" label="盈亏率" min-width="70">
          <template slot-scope="scope">
            <span>{{(Number(scope.row.profitratio)*100).toFixed(4)+'%'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="marginratio" label="保证金率" min-width="80">
          <template slot-scope="scope">
            <span>{{(Number(scope.row.marginratio)*100).toFixed(4)+'%'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contractindex" label="合约指数价格" min-width="110"></el-table-column>
        <el-table-column prop="buyprice" label="合约买入价格" min-width="110"></el-table-column>
        <el-table-column prop="sellprice" label="合约卖出价格" min-width="110"></el-table-column>
      </el-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      title="积分信息"
      :visible.sync="dialogVisible"
      width="510px"
      @close="handleClose"
    >
      <div class="dc1_left">
        <Label
          :title="'UID:'"
          :value="userdata.userid"
          titleWidth="150px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'待领取积分：'"
          :value="pointsData.unclaimed"
          titleWidth="150px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'可用积分:'"
          :value="pointsData.balance"
          titleWidth="150px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'累计获得积分:'"
          :value="pointsData.grand_total"
          titleWidth="150px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'过期积分:'"
          :value="pointsData.expired"
          titleWidth="150px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="dialogOkClick">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Label from "@/components/label";
import {
  GETUSERASSETINFO,
  GETUSERTRADEINFO,
  GETUSERPOSITIONINFO,
  BCPROGETPARENTUID,
  GETUSERPOINTINFO
} from "@/constant";
export default {
  data() {
    return {
      time: null, //默认时间选择控件
      userdata: this.$route.query,
      assetData: [],
      tradeData: [],
      positionData: [],
      pointsData: {},
      dialogVisible: false,
      parentuid: "--"
    };
  },
  components: {
    Label: Label
  },
  mounted() {
    this.time = this.getNowDate();
    this.$register(this);
    this.msg = [
      GETUSERASSETINFO,
      GETUSERTRADEINFO,
      GETUSERPOSITIONINFO,
      BCPROGETPARENTUID,
      GETUSERPOINTINFO
    ];
    this.search();
    if (this.userdata.inviteparent !== "") {
      this.$api.bcprogetparentuid({
        tag: {
          dataType: BCPROGETPARENTUID,
          inviteparent: this.userdata.inviteparent
        }
      });
    }
  },
  computed: {},
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    integralInfo() {
      this.$api.getUserPointsInfo({
        tag: {
          dataType: GETUSERPOINTINFO,
          uid: this.userdata.userid,
          tdate: this.time
        }
      });
      this.dialogVisible = true;
    },
    dialogOkClick() {
      this.dialogVisible = false;
    },
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
      this.$api.getUserAssetInfo({
        tag: {
          dataType: GETUSERASSETINFO,
          uid: this.userdata.userid,
          tdate: this.time
        }
      });
      this.$api.getUserTradeInfo({
        tag: {
          dataType: GETUSERTRADEINFO,
          uid: this.userdata.userid,
          tdate: this.time
        }
      });
      this.$api.getUserPositionInfo({
        tag: {
          dataType: GETUSERPOSITIONINFO,
          uid: this.userdata.userid,
          tdate: this.time
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
        case GETUSERPOINTINFO:
          if (data.ret === 0) {
            this.pointsData = data.data;
          }
          break;
        case GETUSERASSETINFO:
          if (data.ret === 0) {
            this.assetData = data.data;
          }
          break;
        case GETUSERTRADEINFO:
          if (data.ret === 0) {
            this.tradeData = data.data;
          }
          break;
        case GETUSERPOSITIONINFO:
          if (data.ret === 0) {
            this.positionData = data.data;
          }
          break;
        case BCPROGETPARENTUID:
          if (data.ret == 0) {
            this.parentuid = data.data.uid;
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
.dc2 {
  .dc2_title {
    display: block;
    text-align: left;
    height: 30px;
    line-height: 30px;
    flex-shrink: 0;
    box-sizing: border-box;
    font-weight: 900;
    width: 100%;
  }
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.dc3 {
  .dc3_title {
    display: block;
    text-align: left;
    height: 30px;
    line-height: 30px;
    flex-shrink: 0;
    box-sizing: border-box;
    font-weight: 900;
    width: 100%;
  }
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.dc4 {
  .dc4_title {
    display: inline-block;
    width: 100%;
    text-align: left;
    height: 30px;
    line-height: 30px;
    flex-shrink: 0;
    box-sizing: border-box;
    font-weight: 900;
  }
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
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
