<!--财务记录-->
<template>
  <div class="lsjl">
    <div class="w_menu">
      <span class="searchTitle">资产账户币种</span>
      <el-select v-model="jydselect" placeholder="请选择币种" class="inputs">
        <el-option
          v-for="(item,index) in coinData"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="searchTitle">类型</span>
      <el-select v-model="typeSelected" placeholder="请选择类型" class="inputs">
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
      <!-- <el-button type="primary" class="buttons" @click="tst">透视图</el-button> -->
    </div>
    <div id="wcdiv_lsjl" class="w_c">
      <el-table :data="tableData" style="width:100%" :cell-style="{ height: rowh + 'px' }">
        <el-table-column prop="currencyname" label="币种资产" min-width="180"></el-table-column>
        <el-table-column prop="userid" label="UID" min-width="180"></el-table-column>
        <el-table-column prop="type_s" label="类型" min-width="180"></el-table-column>
        <el-table-column prop="amount" label="活动数量" min-width="180"></el-table-column>
        <el-table-column prop="balance" label="剩余账户资产" min-width="180"></el-table-column>
        <el-table-column prop="balance" label="剩余可用余额" min-width="180">
          <template slot-scope="scope">
            <span>{{Number(Number(scope.row.balance)-Number(scope.row.lockamount))}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lockamount" label="剩余冻结数量" min-width="180"></el-table-column>
        <el-table-column prop="createdtime" label="发生时间" min-width="180">
          <template slot-scope="scope">
            <span>{{scope.row.createdtime.substring(0,scope.row.createdtime.indexOf(" "))}}</span>
            <br />
            <span>{{scope.row.createdtime.substring(scope.row.createdtime.indexOf(" "))}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="billid_s" label="流水编号" min-width="180"></el-table-column>
        <el-table-column prop="orderclient_s" label="客户端" min-width="180"></el-table-column>
        <el-table-column prop="ipaddress" label="客户端IP地址" min-width="180"></el-table-column>
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
window.func = function() {
  //设置字段
  window.Frame.window.createNgPanel(this.parent.app.allFields);
  //设置数据
  window.Frame.window.setdata(this.parent.app.tableData);
};
import { ASSETS_FINANCERECORDS, ASSETS_COINLIST } from "@/constant";
export default {
  data() {
    return {
      //合约交易对
      input: "",
      coinData: [],
      jydselect: -1,
      time: [],
      datatotal: 0, //总数据条数
      currentPageNum: 9, //每页默认10条
      currentPage: 1, //当前页
      rowh: 40, //行高
      tableData: [],
      typeData: [
        { label: "全部", value: 0 },
        { label: "充值", value: 1 },
        { label: "提现", value: 2 },
        { label: "划转到交易账户", value: 4 },
        { label: "从交易账户转入", value: 8 },
        { label: "邀请奖励", value: 16 },
        { label: "代理奖励", value: 32 },
        { label: "法币购买", value: 64 },
        { label: "空投", value: 128 }
      ],
      typeSelected: 0,
      dialogTstVisible: false, //透视图
      //透视图用字段
      allFields: [
        { binding: "currencyname", header: "币种资产" }, //, created_at 提币申请时间
        { binding: "userid", header: "UID" }, //, created_at 提币申请时间
        { binding: "type_s", header: "类型" }, //, created_at 提币申请时间
        { binding: "amount", header: "活动数量" }, //, created_at 提币申请时间
        { binding: "balance", header: "剩余账户资产" }, //, created_at 提币申请时间
        { binding: "available", header: "剩余可用余额" }, //, created_at 提币申请时间
        { binding: "lockamount", header: "剩余冻结数量" }, //, created_at 提币申请时间
        { binding: "createdtime", header: "发生时间" }, //, created_at 提币申请时间
        { binding: "billid_s", header: "流水编号" }, //, created_at 提币申请时间
        { binding: "orderclient_s", header: "客户端" }, //, created_at 提币申请时间
        { binding: "ipaddress", header: "客户端IP地址" } //, created_at 提币申请时间
      ]
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [ASSETS_FINANCERECORDS, ASSETS_COINLIST];
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
  created: function() {
    window.app = this; //获取引用
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

      // 16.财务记录
      // 地址：/v1/manager/qbprofinancehistory
      // 传参：uid，coinid -1全部，pageNo,pagesize，star,end
      // 返回：{"ret": 0,"msg": "","data":{"list": [{}]}}
      // 解释：userid用户id， coinid币种id，coinname 币种名字，type对应类型，amount活动数量,balance账户资产,available可用余额,ordermargin委托保证金,positionmargin仓位保证金

      this.tableData = [];
      this.$api.getAssetFinaceRecords({
        tag: {
          dataType: ASSETS_FINANCERECORDS,
          url: "/managers/v1/manager/bcprouserwalletbill",
          take: 1, //编辑合约组交易状态
          params: {
            uid: this.input,
            coinid: this.jydselect,
            stype: this.typeSelected,
            pageNo: this.currentPage,
            pagesize: this.currentPageNum,
            star: starttime,
            end: stoptime,
            ttype: 1,
            status: 0
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
                // type 1：充值  2：提现  4：划转到交易账户 8：从交易账户转入,status充值 1：未到账 2：已到账,
                //其它为 2：已到账
                v.billid_s = v.billid.toString();
                if (v.type == 1) {
                  v["type_s"] = "充值";
                } else if (v.type == 2) {
                  v["type_s"] = "提现";
                } else if (v.type == 4) {
                  v["type_s"] = "划转到交易账户";
                } else if (v.type == 8) {
                  v["type_s"] = "从交易账户转入";
                } else if (v.type == 16) {
                  v["type_s"] = "邀请奖励";
                } else if (v.type == 32) {
                  v["type_s"] = "代理奖励";
                } else if (v.type == 64) {
                  v["type_s"] = "法币购买";
                } else if (v.type == 128) {
                  v["type_s"] = "空投";
                } else {
                  v["type_s"] = "其它";
                }

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
                // v.available = Number(
                //   Number(scope.row.balance) - Number(scope.row.lockamount)
                // );
                // console.log(v.available)
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
                coinid: -1,
                value: -1,
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
.dialogctst {
  width: 100%;
  height: 100%;
}
</style>
