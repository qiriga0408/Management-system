<!--财务记录-->
<template>
  <div class="lsjl">
    <div class="w_menu">
      <el-date-picker
        v-model="time"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <span class="searchTitle">交易类型</span>
      <el-select v-model="tradeType" placeholder="请选择交易类型" class="inputs">
        <el-option
          v-for="(item,index) in tradeTypeData"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="searchTitle">任务类型</span>
      <el-select v-model="taskType" placeholder="请选择任务类型" class="inputs">
        <el-option
          v-for="(item,index) in taskTypeData"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span>UID</span>
      <el-input
        v-model="input"
        placeholder="请输入UID"
        @keyup.native="number"
        class="inputw"
        clearable
      ></el-input>

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
        <el-table-column prop="created_time" fixed label="触发时间" min-width="140"></el-table-column>
        <el-table-column prop="approved_time" label="获得时间" min-width="140"></el-table-column>
        <el-table-column prop="currency_name" label="币种" min-width="80"></el-table-column>
        <el-table-column prop="user_id" label="UID" min-width="80"></el-table-column>
        <el-table-column prop="status_s" label="交易类型" min-width="100"></el-table-column>
        <el-table-column prop="amount" label="变化数量" min-width="80"></el-table-column>
        <el-table-column prop="balance" label="触发前可用积分" min-width="100"></el-table-column>
        <!-- <el-table-column prop="balance" label="过期积分" min-width="80"></el-table-column>
        <el-table-column prop="lockamount" label="待领取积分" min-width="90"></el-table-column>
        <el-table-column prop="billid_s" label="累计获得积分" min-width="100"></el-table-column> -->
        <el-table-column prop="type_s" fixed="right" label="任务类型" min-width="100"></el-table-column>
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
import { ASSETS_FINANCERECORDS } from "@/constant";
export default {
  data() {
    return {
      //合约交易对
      input: "",
      tradeTypeData: [
        { label: "全部交易类型", value: 0 },
        { label: "待领取", value: 1 },
        { label: "已领取", value: 2 },
        { label: "超时过期", value: 4 }
      ],
      tradeType: 0,
      time: [],
      datatotal: 0, //总数据条数
      currentPageNum: 9, //每页默认10条
      currentPage: 1, //当前页
      rowh: 40, //行高
      tableData: [],
      taskTypeData: [
        { label: "全部任务类型", value: 0 },
        { label: "每日签到", value: 3 },
        { label: "新用户注册", value: 4 },
        { label: "首次充币", value: 5 },
        { label: "首次法币购买", value: 6 },
        { label: "首次合约交易", value: 8 },
        { label: "邀请好友", value: 7 }
      ],
      taskType: 0
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [ASSETS_FINANCERECORDS];
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
    search() {
      if (this.input) {
        if (!/^(0|\+?[1-9][0-9]*)$/.test(this.input)) {
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
    number() {
      this.input = this.input.replace(/[^\.\d]/g, "");
      this.input = this.input.replace(".", "");
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
      var time = new Date().getTime() - 24 * 60 * 60 * 1000;
      var yesday = new Date(time); // 获取的是前一天日期
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
      this.$api.getAssetIntegralRecords({
        tag: {
          dataType: ASSETS_FINANCERECORDS,
          params: {
            uid: this.input,
            status: this.tradeType,
            ttype: this.taskType,
            pageNo: this.currentPage,
            pagesize: this.currentPageNum,
            star: starttime,
            end: stoptime
          } //参数
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case ASSETS_FINANCERECORDS:
          if (data.ret === 0) {
            if (data.data.list) {
              data.data.list.map(v => {
                switch(v.status){
                  case 1:
                    v.status_s = "待领取";
                    break;
                  case 2:
                    v.status_s = "已领取";
                    break;
                  case 4:
                    v.status_s = "超时过期";
                    break;
                }
                //0全部 1充值 2提币 3签到 4新用户注册 5首次充币 6首次法币购买 7邀请好友 8首次合约交易
                switch (v.type) {
                  case 0:
                    v.type_s = "全部类型";
                    break;
                  case 1:
                    v.type_s = "充值";
                    break;
                  case 2:
                    v.type_s = "提币";
                    break;
                  case 3:
                    v.type_s = "每日签到";
                    break;
                  case 4:
                    v.type_s = "新用户注册";
                    break;
                  case 5:
                    v.type_s = "首次充币";
                    break;
                  case 6:
                    v.type_s = "首次法币购买";
                    break;
                  case 7:
                    v.type_s = "邀请好友";
                    break;
                  case 8:
                    v.type_s = "首次合约交易";
                    break;
                }
              });
              this.tableData = data.data.list;
              this.datatotal = Number(data.data.total);
            } else {
              this.datatotal = 0;
            }
          }
          break;
      }
    },

    beforeDestroy() {
      this.$unRegister(this);
    }
  }
};
</script>

<style lang="less" scoped>
.inputw {
  width: 140px;
  padding-right: 7px;
  margin-left: 5px;
}

.inputs {
  margin-right: 10px;
  margin-left: 5px;
  width: 180px;
}

.buttons {
  margin-left: 30px;
}
.searchTitle {
  width: 85px;
  text-align: right;
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
