<!--财务记录-->
<template>
  <div class="lsjl">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-if="$store.state.qx.bcdataaudit1" label="充币清算统计" name="charge"></el-tab-pane>
      <el-tab-pane v-if="$store.state.qx.bcdataaudit2" label="提币清算统计" name="withdraw"></el-tab-pane>
      <el-tab-pane v-if="$store.state.qx.bcdataaudit3" label="法币购买清算统计" name="legal"></el-tab-pane>
      <el-tab-pane v-if="$store.state.qx.bcdataaudit4" label="转出清算统计" name="out"></el-tab-pane>
      <el-tab-pane v-if="$store.state.qx.bcdataaudit5" label="转入清算统计" name="in"></el-tab-pane>
    </el-tabs>
    <div id="myChart" style="width: 1000px;height:1000px;" ref="myChart"></div>
    <div class="w_menu">
      <el-date-picker
        v-model="time"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
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
        <el-table-column prop="audit_cycle" fixed label="清算周期" min-width="250"></el-table-column>
        <el-table-column prop="created_at" label="清算数据生成时间" min-width="180"></el-table-column>
        <el-table-column prop="cycle_amount" label="清算周期充币USDT数量" min-width="180"></el-table-column>
        <el-table-column prop="total_amount" label="累计充币USDT数量" min-width="180"></el-table-column>
        <el-table-column prop="difference" label="累计全网充币标准差" min-width="180"></el-table-column>
        <el-table-column prop="total_average" fixed="right" label="累计全网充币人均数量" min-width="180"></el-table-column>
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
      currentPageNum: 10, //每页默认10条
      currentPage: 1, //当前页
      rowh: 40, //行高
      activeName: "charge",
      tableData: []
    };
  },
  components: {},
  mounted() {
    let myChart = this.$echarts.init(this.$refs.myChart);
    myChart.resize({ height: "500px" });
    this.$register(this);
    this.msg = [GETCHARGESTATISTICS];
    this.time.push(this.getYesDay());
    this.time.push(this.getNowDate());
    this.getData();
  },
  computed: {},
  methods: {
    handleClick(tab, event) {
      switch (tab.name) {
        case "charge":
          this.$router.push({
            path: "/caiwuxitong/auditandstatistics/assetsStatistics/charge"
          });
          break;
        case "withdraw":
          this.$router.push({
            path: "/caiwuxitong/auditandstatistics/assetsStatistics/withdraw"
          });
          break;
        case "legal":
          this.$router.push({
            path: "/caiwuxitong/auditandstatistics/assetsStatistics/legal"
          });
          break;
        case "out":
          this.$router.push({
            path: "/caiwuxitong/auditandstatistics/assetsStatistics/transferout"
          });
          break;
        case "in":
          this.$router.push({
            path: "/caiwuxitong/auditandstatistics/assetsStatistics/transferin"
          });
          break;
      }
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
    getYesDay() {
      var time = new Date().getTime() - 24 * 60 * 60 * 1000 * 7;
      var yesday = new Date(time); // 获取的是前一周日期
      return (
        yesday.getFullYear() +
        "-" +
        (yesday.getMonth() >= 9
          ? yesday.getMonth() + 1
          : "0" + (yesday.getMonth() + 1)) +
        "-" +
        (yesday.getDate() > 9 ? yesday.getDate() : "0" + yesday.getDate())
      );
    },
    getData() {
      let starttime = null,
        stoptime = null;
      if (this.time) {
        if (this.time.length === 2) {
          starttime = this.time[0];
          stoptime = this.time[1] + " 23:59:59";
        } else if (this.time.length === 1) {
          starttime = this.time[0];
        }
        console.log(this.time.length);
      } else {
        console.log("没有选择任何时间");
      }
      this.tableData = [];
      this.$api.getStatisticsData({
        tag: {
          dataType: GETCHARGESTATISTICS,
          ttype: 1,
          pageNo: this.currentPage,
          pagesize: this.currentPageNum,
          star: starttime,
          end: stoptime
        }
      });
    },
    setChartOptions(data) {
      let time = [],
        circle = [],
        total = [],
        deviation = [],
        amount = [];
      data.map(v=>{
        time.unshift(String(String(v.audit_cycle).split('---')[1]).split(' ')[0]);
        circle.unshift(v.cycle_amount);
        total.unshift(v.total_amount);
        deviation.unshift(v.difference);
        amount.unshift(v.total_average);
      })
      let myChart = this.$echarts.getInstanceByDom(this.$refs.myChart);
      myChart.setOption({
        title: {
          text: "充币清算数据"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: [
            "清算周期充币USDT数量",
            "累计充币USDT数量",
            "累计全网充币标准差",
            "累计全网充币人均数量"
          ],
          selected: {
            累计充币USDT数量: false,
            累计全网充币人均数量: false
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: time
        },
        yAxis: [
          {
            name: "数量",
            type: "value",
            position: "left"
          },
          {
            name: "标准差",
            type: "value",
            position: "right"
          }
        ],
        series: [
          {
            name: "清算周期充币USDT数量",
            type: "line",
            data: circle
          },
          {
            name: "累计充币USDT数量",
            type: "line",
            data: total
          },
          {
            name: "累计全网充币标准差",
            type: "line",
            yAxisIndex: 1,
            data: deviation
          },
          {
            name: "累计全网充币人均数量",
            type: "line",
            data: amount
          }
        ]
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
          this.setChartOptions(this.tableData);
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
