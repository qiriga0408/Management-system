<!--资金费率历史-->
<template>
  <div class="lsjl">
    <div class="w_menu">
      <span class="searchTitle">合约交易对</span>
      <el-select v-model="jydselect" placeholder="请选择合约" class="inputs">
        <el-option
          v-for="(item ,index) in jyddata"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-date-picker
        v-model="time"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button type="primary" class="buttons" @click="search">搜索</el-button>
    </div>
    <div id="wcdiv_lsjl" class="w_c">
      <el-table :data="tableData" style="width:100%">
        <el-table-column prop="create_time" label="时间" min-width="120"></el-table-column>
        <el-table-column prop="contract_code" label="合约代码" min-width="80"></el-table-column>
        <el-table-column prop="trade_price" label="成交价格" min-width="100"></el-table-column>
        <el-table-column prop="trade_amount" label="成交张数" min-width="100"></el-table-column>
        <el-table-column prop="sell_price" label="卖出价" min-width="100"></el-table-column>
        <el-table-column prop="buy_price" label="买入价" min-width="100"></el-table-column>
        <el-table-column prop="index_price" label="合约指数" min-width="100"></el-table-column>
      </el-table>
    </div>
    <div class="w_page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="currentPageNum"
        layout="total,sizes, prev, pager, next, jumper"
        :total="datatotal"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { BCPROCONTRACTSET, BCMARKETTICK } from "@/constant";
import Label from "@/components/label";
export default {
  data() {
    return {
      //合约交易对
      jyddata: [],
      jydselect: "",

      time: [],
      datatotal: 0, //总数据条数
      currentPageNum: 10, //每页默认10条
      currentPage: 1, //当前页
      tableData: []
    };
  },
  components: {
    Label: Label
  },
  mounted() {
    this.$register(this);
    this.msg = [BCPROCONTRACTSET, BCMARKETTICK];
    this.time.push(this.getYesDay());
    this.time.push(this.getNowDate());
    this.jyddata = [];
    this.$api.bcproffundingfee({
      tag: {
        dataType: BCPROCONTRACTSET,
        url: "/managers/v1/manager/bcprocontractset",
        take: 2, //编辑合约组交易状态
        params: {} //参数
      }
    });
  },
  computed: {},
  methods: {
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

    getNowDate() {
      var date = new Date();
      return date;
    },
    getYesDay() {
      var time = new Date().getTime() - 10 * 60 * 1000;
      var yesday = new Date(time); // 获取的是前一天日期
      return yesday;
    },
    getYMDHMS(timestamp) {
      let time = new Date(timestamp);
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let date = time.getDate();
      let hours = time.getHours();
      let minute = time.getMinutes();
      let second = time.getSeconds();

      if (month < 10) {
        month = "0" + month;
      }
      if (date < 10) {
        date = "0" + date;
      }
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minute < 10) {
        minute = "0" + minute;
      }
      if (second < 10) {
        second = "0" + second;
      }
      return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hours +
        ":" +
        minute +
        ":" +
        second
      );
    },
    getData() {
      let starttime = null,
        stoptime = null;
      if (this.time) {
        if (this.time.length === 2) {
          starttime = typeof this.time[0] === 'string'?this.time[0]:this.getYMDHMS(this.time[0].getTime());
          stoptime = typeof this.time[1] === 'string'?this.time[1]:this.getYMDHMS(this.time[1].getTime());
        } else if (this.time.length === 1) {
          starttime = typeof this.time[0] === 'string'?this.time[0]:this.getYMDHMS(this.time[0].getTime());;
        }
        console.log(this.time.length);
      } else {
        console.log("没有选择任何时间");
      }
      this.tableData = [];
      this.$api.bcmarkettick({
        tag: {
          dataType: BCMARKETTICK,
          contractcode: this.jydselect,
          star: starttime,
          end: stoptime,
          pageNo: this.currentPage,
          pagesize: this.currentPageNum
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case BCPROCONTRACTSET:
          if (data.ret === 0) {
            if (data.data) {
              for (let i = 0; i < data.data.length; i++) {
                data.data[i]["value"] = data.data[i].traderpairs;
                data.data[i]["label"] = data.data[i].traderpairs.toUpperCase();
              }
              this.jyddata = data.data;
              this.jydselect = this.jyddata[0].value;
              this.getData();
            }
          }
          break;
        case BCMARKETTICK:
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
    .divuser {
      display: flex;
      flex-direction: column;
      padding: 10px 0;
    }
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
