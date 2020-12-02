<!--财务记录-->
<template>
  <div class="lsjl">
    <div class="w_menu">
      <span class="searchTitle">资产账户币种</span>
      <el-select v-model="jydselect" class="inputs">
        <el-option
          v-for="(item,index) in coinData"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="searchTitle">类型</span>
      <el-select v-model="typeselect" class="inputs">
        <el-option
          v-for="(item,index) in typeData"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="searchTitle">UID</span>
      <el-input
        v-model="input"
        placeholder="请输入UID"
        @keyup.native="number"
        class="inputw"
        clearable
      ></el-input>
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
      <el-table :data="tableData" style="width:100%" :cell-style="{ height: rowh + 'px' }">
        <el-table-column prop="coinname" label="资产币种" min-width="80"></el-table-column>
        <el-table-column prop="user_id" label="UID" min-width="80"></el-table-column>
        <el-table-column prop="type_s" label="类型" min-width="80"></el-table-column>
        <el-table-column prop="amount" label="活动数量" min-width="100"></el-table-column>
        <el-table-column prop="platform_price" label="汇率" min-width="80"></el-table-column>
        <el-table-column prop="status_s" label="状态" min-width="120"></el-table-column>
        <el-table-column prop="balance" label="剩余账户资产" min-width="120"></el-table-column>
        <el-table-column prop="avail_amount" label="剩余可用余额" min-width="120">
          <!-- <template slot-scope="scope">
            <span>{{Number(Number(scope.row.balance)-Number(scope.row.lockamount))}}</span>
          </template>-->
        </el-table-column>
        <el-table-column prop="lock_amount" label="剩余冻结数量" min-width="120"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" min-width="180">
          <!-- <template slot-scope="scope">
            <span>{{scope.row.create_time.substring(0,scope.row.create_time.indexOf(" "))}}</span>
            <br />
            <span>{{scope.row.create_time.substring(scope.row.create_time.indexOf(" "))}}</span>
          </template>-->
        </el-table-column>
        <el-table-column prop="close_time" label="结束时间" min-width="180">
          <!-- <template slot-scope="scope">
            <span>{{scope.row.createdtime.substring(0,scope.row.createdtime.indexOf(" "))}}</span>
            <br />
            <span>{{scope.row.createdtime.substring(scope.row.createdtime.indexOf(" "))}}</span>
          </template>-->
        </el-table-column>
        <el-table-column prop="order_id_s" label="订单编号" min-width="180"></el-table-column>
        <el-table-column prop="pay_order_id_s" label="支付编号" min-width="180"></el-table-column>
        <el-table-column prop="orderclient_s" label="客户端" min-width="100"></el-table-column>
        <el-table-column prop="ip_address" label="客户端IP" min-width="150"></el-table-column>
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
import { ASSETS_CURRENCYRECORDS, ASSETS_COINLIST } from "@/constant";
export default {
  data() {
    return {
      //合约交易对
      input: "",
      coinData: [],
      typeData: [
        { label: "全部类型", value: 0 },
        { label: "法币买入", value: 2 },
        { label: "法币卖出", value: 1 }
      ],
      jydselect: "",
      typeselect: 0,
      time: [],
      datatotal: 0, //总数据条数
      currentPageNum: 9, //每页默认10条
      currentPage: 1, //当前页
      rowh: 40, //行高
      tableData: []
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [ASSETS_CURRENCYRECORDS, ASSETS_COINLIST];
    this.time.push(this.getYesDay());
    this.time.push(this.getNowDate());
    let a = document.getElementById("wcdiv_lsjl");
    let h = a.clientHeight - 60;
    this.currentPageNum = Math.round(h / this.rowh);
    this.rowh = Math.round(h / this.currentPageNum);
    this.getData();

    this.coinData = [];
    this.$api.getAssetCoinList({
      tag: {
        dataType: ASSETS_COINLIST
      }
    });
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
      console.log;
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
      this.$api.bcotcorderlist({
        tag: {
          dataType: ASSETS_CURRENCYRECORDS,
          params: {
            uid: this.input,
            coin_name: this.jydselect,
            pageNo: this.currentPage,
            pagesize: this.currentPageNum,
            star: starttime,
            end: stoptime,
            ttype: this.typeselect
          } //参数
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case ASSETS_CURRENCYRECORDS:
          if (data.ret === 0) {
            if (data.data.list) {
              data.data.list.map(v => {
                //state状态 1 等待买家付款; 2 卖家确认收款／等待卖家发货; 3用户取消; 4 商家取消; 5 超时取消; 6交易完成(已放币）; 7：补充放款
                v.order_id_s = v.order_id.toString();
                v.pay_order_id_s = v.pay_order_id.toString();
                v.order_id_s = v.order_id.toString();
                v.type_s = v.order_type === 2?"法币购买":"法币出售";
                let status = ["","等待买家付款","等待商家放币", "买家取消","商家取消","超时取消","交易完成","补款放币"];
                v.status_s = status[v.state];
                if (v.order_client == 1) {
                  v["orderclient_s"] = "android";
                } else if (v.order_client == 2) {
                  v["orderclient_s"] = "iOS";
                } else if (v.order_client == 3) {
                  v["orderclient_s"] = "WEB";
                } else if (v.order_client == 4) {
                  v["orderclient_s"] = "H5";
                } else if (v.order_client == 5) {
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
          }
          break;
        case ASSETS_COINLIST:
          if (data.ret === 0) {
            if (data.data) {
              for (let i = 0; i < data.data.length; i++) {
                data.data[i]["value"] = data.data[i].currencyid;
                data.data[i]["label"] = data.data[i].currencyname.toUpperCase();
              }
              this.coinData = data.data;
              this.coinData.unshift({
                value: "",
                label: "全部币种"
              }); //  放入-1
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
