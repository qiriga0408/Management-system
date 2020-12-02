<!--财务记录-->
<template>
  <div class="lsjl">
    <div class="w_menu">
      <el-button type="primary" class="buttons" 
        :disabled="searchDisabled" 
        @click="search">{{searchDisabled?count+'s后可查询':'查询当前数值'}}</el-button>
    </div>
    <div id="wcdiv_lsjl" class="w_c">
      <el-table :data="tableData" style="width:100%;" :cell-style="{ height: rowh + 'px' }">
        <el-table-column prop="contractcode" label="用户持仓交易对" min-width="120"></el-table-column>
        <el-table-column prop="netvalue" label="多空净值" min-width="100"></el-table-column>
        <el-table-column prop="bvalue" label="持多价值" min-width="100"></el-table-column>
        <el-table-column prop="svalue" label="持空价值" min-width="100"></el-table-column>
        <el-table-column prop="bprice" label="持多单开仓均价" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.bprice.toString()}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sprice" label="持空单开仓均价" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.sprice.toString()}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bfloatprofit" label="多单未实现盈亏" min-width="120"></el-table-column>
        <el-table-column prop="sfloatprofit" label="空单未实现盈亏" min-width="120"></el-table-column>
        <el-table-column prop="bmargin" label="多单占用保证金" min-width="120"></el-table-column>
        <el-table-column prop="smargin" label="空单占用保证金" min-width="120"></el-table-column>
      </el-table>
    </div>
    <div id="wcdiv_lsjl" class="w_c">
      <el-table :data="tableData1" style="width:100%" :cell-style="{ height: rowh + 'px' }">
        <el-table-column prop="hedgeaccount" label="对冲账户" min-width="120"></el-table-column>
        <el-table-column prop="contractaccount" label="合约账户" min-width="100"></el-table-column>
        <el-table-column prop="volume" label="持仓张数" min-width="100"></el-table-column>
        <el-table-column prop="forceprice" label="强平价格" min-width="100"></el-table-column>
        <el-table-column prop="longvalue" label="持多价值" min-width="120"></el-table-column>
        <el-table-column prop="shortvalue" label="持空价值" min-width="120"></el-table-column>
        <el-table-column prop="longprice" label="持多单开仓均价" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.longprice.toString()}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="shortprice" label="持空单开仓均价" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.shortprice.toString()}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="uncloseprofit" label="未实现盈亏" min-width="120"></el-table-column>
        
      </el-table>
    </div>
  </div>
</template>
<script>
import { BCPROHEDGEPOSITION } from "@/constant";
export default {
  data() {
    return {
      rowh: 40, //行高
      tableData: [],
      tableData1: [],
      searchDisabled:false,
      count:5
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [BCPROHEDGEPOSITION];
    this.getData();
    this.searchDisabled = true;
    setTimeout(this.countDown, 1000);
  },
  computed: {},
  methods: {
    search() {
      this.getData();
      this.searchDisabled = true;
      setTimeout(this.countDown, 1000);
    },
    countDown(){
      this.count--;
      if(this.count === 0){
          this.searchDisabled = false;
          this.count = 5;
      }else{
          setTimeout(this.countDown, 1000);
      }
    },
    getData() {
      this.tableData = [];
      this.tableData1 = [];
      this.$api.getbcprohedgeposition({
        tag: {
          dataType: BCPROHEDGEPOSITION
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case BCPROHEDGEPOSITION:
          if (data.ret === 0) {
            if (data.data.bcposition && data.data.bcposition.length) {
              this.tableData = data.data.bcposition;
            } else {
              this.tableData = [];
            }
            if (data.data.hedgeposition && data.data.hedgeposition.length) {
              this.tableData1 = data.data.hedgeposition;
            } else {
              this.tableData1 = [];
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
</style>
