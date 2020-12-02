<!--平台资产账户-->
<template>
  <div class="ptzczh">
    <div class="w_menu">
      <!-- <el-date-picker v-model="time" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>

      <el-button type="primary" class="buttons" @click="search">搜索</el-button> -->
      <el-button
        type="primary"
        class="buttons"
        @click="lishi"
        v-if="$store.state.qx.bcprofinacecapitalhistory"
      >历史记录</el-button>
    </div>
    <div class="w_c">
      <el-table :data="tableData" style="width:100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="coinname" label="币种"></el-table-column>
        <el-table-column prop="amount" label="账户资产">
          <template slot-scope="scope">
            <span>{{Number(scope.row.amount).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="已实现盈亏" width="180">
          <template slot-scope="scope">
            <span>{{Number(scope.row.amount).toFixed(6)}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {
  GETPTZC
} from "@/constant";
export default {
  data() {
    return {
      time: null,
      tableData: []
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [GETPTZC];
    this.time = this.getNowDate();
    this.getData();
  },
  computed: {},
  methods: {
    getNowDate() {
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
    lishi() {
      this.$router.push({
        path: "/caiwuxitong/tradeAccountHistory"
      });
    },
    search() {
      this.getData();
    },
    getData() {
      let day = null;
      if (this.time) {
        day = this.time+' 23:59:59';
      } else {
        console.log("没有选择任何时间");
      }
      this.$api.getTradeAccount({
        tag: {
          dataType: GETPTZC,
          tdate: day
        }
      });
    },
    message(tag, data) {
      switch (tag.dataType) {
        case GETPTZC:
          if (data.ret === 0) {
            this.tableData = data.data;
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
.buttons {
  margin: 0 30px;
}

.spanb {
  display: block;
  text-align: left;
}

.ptzczh {
  width: 100%;
  display: flex;
  flex-direction: column;
  .w_menu {
    width: 100%;
    flex-shrink: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }
  .w_c {
    width: 100%;
    flex-grow: 1;
    box-sizing: border-box;
    display: flex;
    align-items: center;
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

.dialogc {
  padding-top: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dialogcc {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.dialogstip {
  color: red;
  padding: 20px 10px;
}

.tb_d {
  width: 100%;
  display: flex;
  height: 30px;
  justify-content: flex-start;
  align-items: center;
  .tb_sp {
    display: block;
    padding-right: 15px;
    flex-shrink: 0;
    text-align: left;
    width: 60px;
  }
}

.ggyzinput {
  position: relative;
  .ggerrortip {
    display: block;
    position: absolute;
    color: red;
  }
}

.yzmdiv {
  position: relative;
  .yzmspan {
    position: absolute;
    display: block;
    right: 10px;
    top: 0px;
    cursor: pointer;
    color: blue;
  }
  .yzmspan_2{
    color: #ccc;
  }
}
</style>
