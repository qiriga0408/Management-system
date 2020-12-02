<!--永续合约成交记录-->
<template>
  <div class="lsjl">
    <div class="w_menu">
      <span class="searchTitle">合约交易对</span>
      <el-select v-model="jydselect" placeholder="请选择类型" class="inputs">
        <el-option
          v-for="(item,index) in jyddata"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <span class="searchTitle">类型</span>
      <el-select v-model="lxselect" placeholder="请选择类型" class="inputs">
        <el-option
          v-for="(item,index) in lxdata"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <span class="searchTitle">方向</span>
      <el-select v-model="fxselect" placeholder="请选择方向" class="inputs">
        <el-option
          v-for="(item,index) in fxdata"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>

    <div class="w_menu">
      <span class="searchTitle">UID</span>
      <el-input v-model="input_uid" placeholder="请输入UID" class="inputw" clearable></el-input>
      <el-date-picker
        v-model="time"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>

      <el-button type="primary" class="buttons" @click="search">搜索</el-button>
      <!-- <el-button type="primary" class="buttons" @click="tst">透视图</el-button> -->
    </div>
    <div id="wcdiv_lsjl" class="w_c">
      <el-table :data="tableData" style="width:100%" :cell-style="{ height: rowh + 'px' }">
        <el-table-column prop="tradetime" label="成交时间" min-width="180"></el-table-column>
        <el-table-column prop="contractcode" label="合约代码" min-width="180"></el-table-column>
        <el-table-column prop="coinname" label="保证金币种" min-width="180"></el-table-column>
        <el-table-column prop="userid" label="UID" min-width="180"></el-table-column>
        <el-table-column prop="offset_s" label="开平仓" min-width="180"></el-table-column>
        <el-table-column prop="side_s" label="成交方向" min-width="180"></el-table-column>
        <el-table-column prop="type_s" label="类型" min-width="180"></el-table-column>
        <el-table-column prop="price" label="成交价格" min-width="180"></el-table-column>
        <el-table-column prop="volume" label="成交张数" min-width="180"></el-table-column>
        <el-table-column prop="totalprofit" label="交易已实现盈亏" min-width="180"></el-table-column>
        <el-table-column prop="tradevalue" label="成交价值" min-width="180"></el-table-column>
        <el-table-column prop="tradeamount" label="成交金额" min-width="180"></el-table-column>
        <el-table-column prop="commission" label="手续费" min-width="180"></el-table-column>
        <el-table-column prop="balance" label="剩余账户资产" min-width="180"></el-table-column>
        <el-table-column prop="available" label="剩余可用余额" min-width="180"></el-table-column>
        <el-table-column prop="accounttype_s" label="账户模式及杠杆" min-width="180"></el-table-column>
        <el-table-column prop="tradeid" label="成交编号" min-width="180"></el-table-column>
        <el-table-column prop="orderclient_s" label="客户端" min-width="180"></el-table-column>
        <el-table-column prop="ipaddress" label="客户端IP" min-width="180"></el-table-column>
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

    <el-dialog width="95%" top="3vh" title="透视图" :visible.sync="dialogTstVisible">
      <div class="dialogctst">
        <iframe id="FrameId" name="Frame" frameborder="0" width="100%" src="/wjgrid/index.html"></iframe>
      </div>
    </el-dialog>
  </div>
</template>
<script>
//增加透视步骤 添加 window.func  方法
//添加created 生命周期
//声明allFields字段
//添加el-dialog 弹框

// frame 调用函数 mounted执行后会调用
window.func = function() {
  //设置字段
  window.Frame.window.createNgPanel(this.parent.app.allFields);
  //设置数据
  window.Frame.window.setdata(this.parent.app.tableData);
};

import { HYJY_YXCJJL } from "@/constant";
export default {
  data() {
    return {
      //合约交易对
      jyddata: [],
      jydselect: "",
      //类型选择
      lxdata: [
        { label: "全部类型", value: -1 },
        { label: "市价单", value: 0 },
        { label: "计划单", value: 1 },
        { label: "止盈单", value: 2 },
        { label: "止损单", value: 4 },
        { label: "强平单", value: 5 }
      ],
      lxselect: -1,
      //方向选择
      fxdata: [
        { label: "全部方向", value: "" },
        { label: "买入做多", value: "B" },
        { label: "卖出做空", value: "S" }
      ],
      fxselect: "",
      //手续费选择
      tmdata: [
        { label: "全部T/M", value: 0 },
        { label: "TAKER", value: 1 },
        { label: "MAKER", value: 2 }
      ],
      tmselect: 0,

      input_uid: "",
      input_bh: "",
      time: [],
      datatotal: 0, //总数据条数
      currentPageNum: 9, //每页默认10条
      currentPage: 1, //当前页
      rowh: 40, //行高
      dialogTstVisible: false, //透视图
      tableData: [],

      //透视图用字段
      allFields: [
        { binding: "tradetime", header: "成交时间" }, //, created_at 提币申请时间
        { binding: "contractcode", header: "合约代码" }, //, created_at 提币申请时间
        { binding: "coinname", header: "保证金币种" }, //, created_at 提币申请时间
        { binding: "userid", header: "UID" }, //, created_at 提币申请时间
        { binding: "offset_s", header: "开平仓" }, //, created_at 提币申请时间
        { binding: "side_s", header: "成交方向" }, //, created_at 提币申请时间
        { binding: "type_s", header: "类型" }, //, created_at 提币申请时间
        { binding: "price", header: "成交价格" }, //, created_at 提币申请时间
        { binding: "volume", header: "成交张数" }, //, created_at 提币申请时间
        { binding: "tradevalue", header: "成交价值" }, //, created_at 提币申请时间
        { binding: "tradeamount", header: "成交金额" }, //, created_at 提币申请时间
        { binding: "commission", header: "手续费" }, //, created_at 提币申请时间
        { binding: "balance", header: "剩余账户资产" },
        { binding: "available", header: "剩余可用余额" }, //, created_at 提币申请时间
        { binding: "accounttype_s", header: "账户模式及杠杆" }, //, created_at 提币申请时间
        { binding: "orderclient_s", header: "客户端" }, //, created_at 提币申请时间
        { binding: "ipaddress", header: "客户端IP" }
      ]
    };
  },
  components: {},
  created: function() {
    window.app = this; //获取引用
  },
  mounted() {
    this.$register(this);
    this.msg = [HYJY_YXCJJL];
    this.time.push(this.getYesDay());
    this.time.push(this.getNowDate());
    let a = document.getElementById("wcdiv_lsjl");
    let h = a.clientHeight - 60;
    this.currentPageNum = Math.round(h / this.rowh);
    this.rowh = Math.round(h / this.currentPageNum);
    this.getData();
    // 5.合约交易对列表
    // 地址：/v1/manager/qbprocontractset
    // 传参{}
    // 返回：{"ret": 0,"msg": "","data":{"list": [{}],"total": 1}}
    // 字段解释：onlinestatus 上架状态，traderstatus交易状态，ispositions 是否持仓，islodge是否有挂单，coinname结算币种，traderpairs交易对，takercomm taker手续费，makercomm maker手续费，traderid合约id
    this.jyddata = [];
    this.$api.getTradeRecords({
      tag: {
        dataType: HYJY_YXCJJL,
        url: "/managers/v1/manager/bcprocontractset",
        take: 2, //编辑合约组交易状态
        params: {} //参数
      }
    });
  },
  computed: {},
  methods: {
    //弹出透视图
    tst() {
      this.dialogTstVisible = true;
      this.$nextTick(function() {
        document.getElementById("FrameId").height =
          document.getElementById("wcdiv_lsjl").clientHeight + "px";
        //设置数据
        if (window.Frame.window.setdata) {
          window.Frame.window.setdata(this.tableData);
        }
      });
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

      if (this.input_bh) {
        if (!/^(0|\+?[1-9][0-9]*)$/.test(this.input_bh)) {
          this.$notify({
            title: "警告",
            message: "成交编号只能输入正整数",
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

      // 17.成交记录
      // 地址：/v1/manager/qbprotraderhistory
      // 传参：contractcode合约代码,type -1：全部 0：普通成交 1：强平成交，side （空全部 B买S卖），identity  0：全部 1：Taker  2：Maker ， uid ，star,end ,tradeid  成交编号
      // 返回：{"ret": 0,"msg": "","data":{"list": [{}],"total": 1}}
      // 解释：userid用户id，tradeid 成交编号,orderid报单编号,contractcode合约代码，sideB买S卖，type 0：普通成交 1：强平成交，price成交价格，markprice标记价格,contractindex	合约指数,lastprice最新价，volume成交张数，tradevalue成交价值，tradetime	成交时间，commission手续费，available	剩余可用余额，accounttype账户模式 1：全仓 2：逐仓，lever杠杆，identity 1：Taker  2：Maker

      this.tableData = [];
      this.$api.getTradeRecords({
        tag: {
          dataType: HYJY_YXCJJL,
          url: "/managers/v1/manager/bcprotraderhistory",
          take: 1, //编辑合约组交易状态
          params: {
            pageNo: this.currentPage,
            pagesize: this.currentPageNum,
            contractcode: this.jydselect,
            type: this.lxselect,
            side: this.fxselect,
            identity: this.tmselect,
            uid: this.input_uid,
            star: starttime,
            end: stoptime,
            actype:0, //
            tradeid: ""
          } //参数
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case HYJY_YXCJJL:
          if (data.ret === 0) {
            switch (tag.take) {
              case 1: //交易列表
                if (data.data.list) {
                  data.data.list.map(v => {
                    //ordertype 市价单 1：计划单 2：止盈单 4：止损单 5：强平单
                    switch (v.ordertype) {
                      case 0:
                        v["type_s"] = "市价单";
                        break;
                      case 1:
                        v["type_s"] = "计划单";
                        break;
                      case 2:
                        v["type_s"] = "止盈单";
                        break;
                      case 4:
                        v["type_s"] = "止损单";
                        break;
                      case 5:
                        v["type_s"] = "强平单";
                        break;
                      default:
                        v.type_s = "--";
                        break;
                    }
                    if (v.side == "B") {
                      v["side_s"] = "买";
                    } else {
                      v["side_s"] = "卖";
                    }
                    if (v.offset == "O") {
                      v["offset_s"] = "开仓";
                    } else {
                      v["offset_s"] = "平仓";
                    }
                    if (v.accounttype == 1) {
                      v["accounttype_s"] = "全仓X" + v.lever;
                    } else {
                      v["accounttype_s"] = "逐仓X" + v.lever;
                    } //orderclient
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
                } else {
                  this.datatotal = 0;
                }
                break;
              case 2:
                if (data.data) {
                  for (let i = 0; i < data.data.length; i++) {
                    data.data[i]["value"] = data.data[i].traderpairs;
                    data.data[i]["label"] = data.data[
                      i
                    ].traderpairs.toUpperCase();
                  }
                  this.jyddata = data.data;
                  this.jyddata.unshift({
                    coinid: "",
                    value: "",
                    label: "全部"
                  }); //  放入-1
                }
                break;
            }
          } else {
            if (tag.take == 1) this.datatotal = 0;
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
