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
      <el-button type="primary" class="buttons" @click="search">搜索</el-button>
    </div>
    <iframe
      id="FrameId"
      name="Frame"
      frameborder="0"
      width="100%"
      height="100%"
      src="/wjgrid/index.html"
    ></iframe>
  </div>
</template>
<script>
window.func = function() {
  //设置字段
  window.Frame.window.createNgPanel(this.parent.app.allFields);
  //设置数据
  this.parent.app.getData();
};
import { TRADE_FINANCERECORDS } from "@/constant";
export default {
  data() {
    return {
      jydselect: -1,
      input_uid: "",
      time: [],
      datatotal: 0, //总数据条数
      currentPageNum: 10000, //每页默认10条
      currentPage: 1, //当前页
      tableData: [],
      dialogTstVisible: false, //透视图
      //透视图用字段
      allFields: [
        { binding: "currencyname", header: "币种资产" }, //, created_at 提币申请时间
        { binding: "userid", header: "UID" }, //, created_at 提币申请时间
        { binding: "type_s", header: "类型" }, //, created_at 提币申请时间
        { binding: "amount", header: "活动数量" ,format:"n6"}, //, created_at 提币申请时间
        { binding: "balance", header: "剩余账户资产" ,format:"n6"}, //, created_at 提币申请时间
        { binding: "available", header: "剩余可用余额" ,format:"n6"}, //, created_at 提币申请时间
        { binding: "lockamount", header: "剩余冻结数量" ,format:"n6"}, //, created_at 提币申请时间
        { binding: "createdtime", header: "发生时间" }, //, created_at 提币申请时间
        { binding: "id", header: "流水编号" }, //, created_at 提币申请时间
        { binding: "orderclient_s", header: "客户端" }, //, created_at 提币申请时间
        { binding: "ipaddress", header: "客户端IP地址" } //, created_at 提币申请时间
      ]
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [TRADE_FINANCERECORDS];
    this.time.push(this.getYesDay());
    this.time.push(this.getNowDate());
    // this.getData();
  },
  computed: {},
  created: function() {
    window.app = this; //获取引用
  },
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
          stoptime = this.time[1];
        } else if (this.time.length === 1) {
          starttime = this.time[0];
        }
        console.log(this.time.length);
      } else {
        console.log("没有选择任何时间");
      }

      this.tableData = [];
      this.$api.trade_financerecords({
        tag: {
          dataType: TRADE_FINANCERECORDS,
          url: "/managers/v1/manager/bcaccountlist",
          params: {
            uid: this.input_uid,
            coinid: this.jydselect,
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
        case TRADE_FINANCERECORDS:
          if (data.ret === 0) {
            if (data.data.list) {
              data.data.list.map(v => {
                // accounttype账户模式 1全仓，2逐仓，username用户名字，tradeenable交易状态1：允许交易 0：禁止交易
                if (v.type == 1) {
                  v["type_s"] = "开仓手续费";
                } else if (v.type == 2) {
                  v["type_s"] = "资金费用";
                } else if (v.type == 4) {
                  v["type_s"] = "从资产账户转入";
                  // v.amount = "+" + v.amount;
                } else if (v.type == 8) {
                  v["type_s"] = "划转到资产账户";
                  // v.amount = "-" + v.amount;
                } else if (v.type == 16) {
                  v["type_s"] = "平仓盈亏";
                  // if (Number(v.amount) > 0) {
                  //   v.amount = "+" + v.amount;
                  // }
                } else if (v.type == 32) {
                  v["type_s"] = "平仓手续费";
                } else if (v.type == 64) {
                  // v["type_s"] = "调整保证金";
                } else if (v.type == 128) {
                  v["type_s"] = "调整保证金";
                } else {
                  v["type_s"] = "--";
                }
                v.id = v.id.toString();
                if (v.orderclient == 1) {
                  v["orderclient_s"] = "android";
                } else if (v.orderclient == 2) {
                  v["orderclient_s"] = "iOS";
                } else if (v.orderclient == 3) {
                  v["orderclient_s"] = "WEB";
                } else if (v.orderclient == 4) {
                  v["orderclient_s"] = "H5";
                } else if (v.orderclient == 5) {
                  v["orderclient_s"] = "open_api";
                } else {
                  v["orderclient_s"] = "系统自动";
                }
              });
              this.tableData = data.data.list;
              this.datatotal = Number(data.data.total);
              window.Frame.window.setdata(this.tableData);
            }
          } else {
            this.datatotal = 0;
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
.control-chart {
  display: none;
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
