<!--财务记录-->
<template>
  <div class="lsjl">
    <div class="w_menu">
      <el-button
        type="primary"
        class="buttons"
        v-if="$store.state.qx.bcotcorderdaytotal"
        @click="currencyConfig"
      >法币交易配置</el-button>
      <el-button
        type="primary"
        class="buttons"
        v-if="$store.state.qx.bcotcorderlist"
        @click="currencyOrderDetails"
      >法币交易订单</el-button>
    </div>
    <div class="dc1">
      <div class="dc1_left">
        <Label
          :title="'今日USDT法币购买(USDT)：'"
          :value="legalData.day_succ_purchase"
          titleWidth="200px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'累计USDT法币购买(USDT):'"
          :value="legalData.total_succ_purchase"
          titleWidth="200px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'今日USDT法币购买(CNY):'"
          :value="legalData.day_succ_cny"
          titleWidth="200px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
        <Label
          :title="'累计USDT法币购买(CNY)：'"
          :value="legalData.total_succ_cny"
          titleWidth="200px"
          valueWidth="250px"
          labelContainer="defaultLabelC"
          labelTitle="defaultLabelt"
          labelContext="defaultLabelv"
        ></Label>
      </div>
      <div class="dc1_right"></div>
    </div>
    <div class="dc2">
      <span class="dc2_title">每日账本</span>
      <el-table :data="tableData" style="width:100%">
        <el-table-column prop="own_day" label="日期" min-width="50"></el-table-column>
        <el-table-column prop="coin_name" label="币种" min-width="50"></el-table-column>
        <el-table-column prop="day_succ_purchase" label="当天购买数量" min-width="50">
          <!-- <template slot-scope="scope">
            <span>{{Number(scope.row.totalrecharge).toFixed(4)}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="day_succ_cny" label="当天购买金额CNY" min-width="50">
          <!-- <template slot-scope="scope">
            <span>{{Number(scope.row.totalwithdraw).toFixed(2)}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="day_succ_order" label="当天已完成订单数量" min-width="50">
          <!-- <template slot-scope="scope">
            <span>{{Number(scope.row.totalinto).toFixed(6)}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="day_bus_cancel" label="当天商家取消订单数量" min-width="50">
          <!-- <template slot-scope="scope">
            <span>{{Number(scope.row.totalout).toFixed(6)}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="day_user_cancel" label="当天买家取消订单数量" min-width="50">
          <!-- <template slot-scope="scope">
            <span>{{Number(scope.row.totalout).toFixed(6)}}</span>
          </template> -->
        </el-table-column>
      </el-table>
    </div>
    <div class="w_page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="currentPageNum"
        layout="total, prev, pager, next, jumper"
        :total="datatotal"
      ></el-pagination>
    </div>
    <el-dialog
      title="法币交易配置"
      :visible.sync="configDialogVisible"
      width="510px"
      height="320px"
      :before-close="handleConfigClose"
    >
      <div class="dialogc"></div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleConfigClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="configOkClick">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Label from "@/components/label";
import {
  BCOTCORDERDAYTOTAL
} from "@/constant";
export default {
  data() {
    let validate_account = (rule, value, callback) => {
      //   console.log(rule)
      if (value == "") {
        return callback(new Error("不能为空"));
      } else {
        callback();
      }
    };

    return {
      rowh: 40, //行高
      tableData: [],
      ttype: 0,
      configDialogVisible: false,
      dialogData: null,
      configForm: {},
      configRules: {},
      legalData: {},
      totalData: [],
      datatotal: 0, //总数据条数
      currentPageNum: 9, //每页默认10条
      currentPage: 1, //当前页
    };
  },
  components: { Label: Label },
  mounted() {
    this.$register(this);
    this.msg = [
      BCOTCORDERDAYTOTAL
    ];
    this.getData();
  },
  computed: {},
  methods: {
    handleSizeChange(val) {
      this.currentPageNum = val;
      this.getData();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    handleConfigClose() {
      this.configDialogVisible = false;
    },
    configOkClick() {
      this.configDialogVisible = false;
    },
    currencyOrderDetails() {
      this.$router.push({
        path: "/assetsaccount/currencyTradeDetails"
      });
    },
    currencyConfig() {
      // this.configDialogVisible = true;
      this.$alert("暂未开通，敬请期待", "法币交易配置", {
        confirmButtonText: "确定",
        callback: null
      });
    },
    getData() {
      this.tableData = [];
      this.$api.bcotcorderdaytotal({
        tag: {
          dataType: BCOTCORDERDAYTOTAL,
          pageNo: this.currentPage,
          pagesize: this.currentPageNum,
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case BCOTCORDERDAYTOTAL:
          if (data.ret === 0) {
            this.legalData = data.data.daytotal;
            if (data.data.List.list && data.data.List.list.length) {
              this.tableData = data.data.List.list;
              this.datatotal = data.data.List.total;
            } else {
              this.tableData = [];
              this.datatotal = 0;
            }
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
.divliang {
  margin-bottom: 20px;
  text-align: left;
  //border: 1px solid #ff8866;
}
.dialogc {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .dialogc2 {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
}
.inputw {
  width: 190px;
  padding-right: 7px;
}

.inputs {
  margin-right: 20px;
  width: 200px;
}

.buttons {
  margin-left: 30px;
}

.lsjl {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .w_menu {
    width: 100%;
    flex-shrink: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding-bottom: 10px;
  }
  .w_c {
    width: 100%;
    // height: 100%;
    flex-grow: 1;
    box-sizing: border-box;
    display: flex;
    padding-top: 20px;
    justify-content: flex-start;
  }
  .w_page {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 10px;
    padding-right: 30px;
  }
}
</style>
