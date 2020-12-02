<!--财务记录-->
<template>
  <div class="lsjl">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-if="$store.state.qx.bcdataaudit1" label="按日期统计" name="day"></el-tab-pane>
      <el-tab-pane v-if="$store.state.qx.bcdataaudit2" label="按月份统计" name="month"></el-tab-pane>
    </el-tabs>
    <div id="wcdiv_lsjl" class="w_c">
      <el-table
        :data="tableData"
        stripe
        border
        style="width:100%"
        :cell-style="{ height: rowh + 'px' }"
      >
        <el-table-column prop="own_at" fixed label="统计日期" min-width="80"></el-table-column>
        <el-table-column prop="net_profit" :label="'当'+(activeName=='day'?'日':'月')+'净利润'" min-width="100"></el-table-column>
        <el-table-column prop="trader_commission" :label="'当'+(activeName=='day'?'日':'月')+'交易手续费'" min-width="120"></el-table-column>
        <el-table-column prop="close_profit" :label="'当'+(activeName=='day'?'日':'月')+'平仓盈亏'" min-width="120"></el-table-column>
        <el-table-column prop="burst_profit" :label="'当'+(activeName=='day'?'日':'月')+'爆仓利润'" min-width="120"></el-table-column>
        <el-table-column prop="capital_asset" :label="'当'+(activeName=='day'?'日':'月')+'资金费用'" min-width="120"></el-table-column>
        <el-table-column prop="withdraw_profit" :label="'当'+(activeName=='day'?'日':'月')+'提币手续费'" min-width="120"></el-table-column>
        <el-table-column prop="returning_amout" :label="'当'+(activeName=='day'?'日':'月')+'返佣'" min-width="120"></el-table-column>
        <el-table-column prop="airdrop_amount" :label="'当'+(activeName=='day'?'日':'月')+'空投'" min-width="120"></el-table-column>
        <el-table-column prop="bug_loss" label="累计系统BUG损失" min-width="150"></el-table-column>
        <el-table-column prop="total_profit" fixed="right" label="累计净利润" min-width="120"></el-table-column>
      </el-table>
    </div>
    <div class="w_page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="currentPageNum"
        layout="total, sizes,prev, pager, next, jumper"
        :total="datatotal"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { GETCHARGESTATISTICS } from "@/constant";
export default {
  data() {
    return {
      time: [],
      datatotal: 0, //总数据条数
      currentPageNum: 50, //每页默认10条
      currentPage: 1, //当前页
      rowh: 40, //行高
      activeName: "day",
      tableData: []
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [GETCHARGESTATISTICS];
    this.getData();
  },
  computed: {},
  methods: {
    handleClick(tab, event) {
      this.getData();
    },
    search() {
      this.currentPage = 1;
      this.getData();
    },

    handleSizeChange(val) {
      this.currentPageNum = val;
      this.getData();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    getData() {
      this.tableData = [];
      this.$api.getIncomesheet({
        tag: {
          dataType: GETCHARGESTATISTICS,
          ttype: this.activeName==='day'?2:1,
          pageNo: this.currentPage,
          pagesize: this.currentPageNum,
        }
      });
    },
    message(tag, data) {
      switch (tag.dataType) {
        case GETCHARGESTATISTICS:
          if (data.ret === 0) {
            if (data.data.list) {
              this.tableData = data.data.list;
              this.datatotal = Number(data.data.total);
            } else {
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
.dialogctst {
  width: 100%;
  height: 100%;
}
</style>
