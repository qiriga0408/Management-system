<!--财务记录-->
<template>
  <div class="lsjl">
    <div class="w_menu">
     <el-date-picker
        v-model="time"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <span class="searchTitle">UID</span>
      <el-input v-model="input_uid" placeholder="请输入UID" class="inputw" clearable></el-input>
      <el-button type="primary" class="buttons" @click="search">搜索</el-button>
    </div>
    <div id="wcdiv_lsjl" class="w_c">
      <el-table
        :data="tableData"
        stripe
        border
        style="width:100%"
        :cell-style="{ height: rowh + 'px' }"
      >
        <el-table-column prop="index" fixed label="排名顺序" min-width="100"></el-table-column>
        <el-table-column prop="userid" label="UID" min-width="180"></el-table-column>
        <el-table-column prop="total_profit" label="交易账户总盈亏" min-width="180"></el-table-column>
        <el-table-column prop="acc_profit" label="累计已实现盈亏" min-width="180"></el-table-column>
        <el-table-column prop="margn_profit" label="未实现盈亏" min-width="180"></el-table-column>
        <el-table-column prop="created_time" fixed="right" label="统计时间" min-width="180"></el-table-column>
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
  </div>
</template>
<script>
import { GETPROFITRANKLIST } from "@/constant";
export default {
  data() {
    return {
      input_uid: "",
      time: [],
      datatotal: 0, //总数据条数
      currentPageNum: 10, //每页默认10条
      currentPage: 1, //当前页
      rowh: 40, //行高
      tableData: []
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [GETPROFITRANKLIST];
    this.time.push(this.getYesDay());
    this.time.push(this.getNowDate());
    let a = document.getElementById("wcdiv_lsjl");
    let h = a.clientHeight - 60;
    this.currentPageNum = Math.round(h / this.rowh);
    this.rowh = Math.round(h / this.currentPageNum);
    this.getData();
  },
  computed: {},
  methods: {
    getNowDate() {
      var date = new Date();
      // var year = date.getFullYear();
      // var month = date.getMonth() + 1;
      // var day = date.getDate();
      // if (month < 10) {
      //   month = "0" + month;
      // }
      // if (day < 10) {
      //   day = "0" + day;
      // }
      return date;//year + "-" + month + "-" + day;
    },
    getYesDay() {
      var time = new Date().getTime() - 24 * 60 * 60 * 1000;
      var yesday = new Date(time); // 获取的是前一天日期
      return yesday;//(
      //   yesday.getFullYear() +
      //   "-" +
      //   (yesday.getMonth() >= 9
      //     ? yesday.getMonth() + 1
      //     : "0" + (yesday.getMonth() + 1)) +
      //   "-" +
      //   (yesday.getDate() > 9 ? yesday.getDate() : "0" + yesday.getDate())
      // );
    },
    search() {
      if (this.input_uid) {
        if (!/^(0|\+?[1-9][0-9]*)$/.test(this.input_uid)) {
          this.$notify({
            title: "警告",
            message: "UID只能输入正整数",
            type: "warning"
          });
          return;
        }
      }
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
      this.$api.getProfitRanklist({
        tag: {
          dataType: GETPROFITRANKLIST,
          uid: this.input_uid,
          pageNo: this.currentPage,
          pagesize: this.currentPageNum,
          star: starttime,
          end: stoptime
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case GETPROFITRANKLIST:
          if (data.ret === 0) {
            if (data.data.list) {
              let index = 1;
              this.tableData = data.data.list.map(v=>{
                v.index = (this.currentPage-1)*this.currentPageNum + index;
                index++;
                return v;
              });
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
.searchTitle {
  padding-left: 10px;
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
.dialogctst {
  width: 100%;
  height: 100%;
}
</style>
