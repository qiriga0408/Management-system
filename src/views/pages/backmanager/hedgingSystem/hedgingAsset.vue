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
      >
      </el-date-picker>
      <span class="searchTitle">合约账户</span>
      <el-select v-model="accountid" placeholder="请选择类型" class="inputs">
        <el-option
          v-for="(item,index) in accountData"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="searchTitle">对冲子账号</span>
      <el-select v-model="hedaccount" placeholder="请选择类型" class="inputs">
        <el-option
          v-for="(item,index) in hedaccountData"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="primary" class="buttons" @click="search">搜索</el-button>
    </div>
    <div id="wcdiv_lsjl" class="w_c">
      <el-table :data="tableData" style="width:100%" :cell-style="{ height: rowh + 'px' }">
        <el-table-column prop="createdat" label="记录时间" min-width="180"></el-table-column>
        <el-table-column prop="contractaccount" label="合约账户" min-width="100"></el-table-column>
        <el-table-column prop="hedgeaccount" label="对冲子账号" min-width="100"></el-table-column>
        <el-table-column prop="available" label="可用数量" min-width="100"></el-table-column>
        <el-table-column prop="usedamount" label="已用数量" min-width="100"></el-table-column>
        <el-table-column prop="balance" label="账户权益" min-width="110"></el-table-column>
        <el-table-column prop="closeprofit" label="已实现盈亏" min-width="110"></el-table-column>
        <el-table-column prop="uncloseprofit" label="未实现盈亏" min-width="110"></el-table-column>
        <el-table-column prop="lockamount" label="冻结数量" min-width="110"></el-table-column>
        <el-table-column prop="marginratio" label="保证金率" min-width="100"></el-table-column>
        <el-table-column prop="maintenancemarginratio" label="维持保证金率" min-width="110"></el-table-column>
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
import { BCPROHEDGE ,HYPZ_SXF,BCPROHEDGEACCOUNTLIST} from "@/constant";
export default {
  data() {
    return {
      //合约交易对
      input: "",
      time: [],
      hedaccount:'',
      hedaccountData:[{label:'全部',value:''}],
      accountid:'',
      accountData:[],
      datatotal: 0, //总数据条数
      currentPageNum: 9, //每页默认10条
      currentPage: 1, //当前页
      rowh: 40, //行高
      tableData: [],
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [BCPROHEDGE,HYPZ_SXF,BCPROHEDGEACCOUNTLIST];
    this.time.push(this.getYesDay());
    this.time.push(this.getNowDate());
    let a = document.getElementById("wcdiv_lsjl");
    let h = a.clientHeight - 60;
    this.currentPageNum = Math.round(h / this.rowh);
    this.rowh = Math.round(h / this.currentPageNum);

    //获取全部合约
      this.$api.bcprocontractset({
        tag: {
          dataType: HYPZ_SXF,
          url:"/managers/v1/manager/bcprocontractset",
          take:1,//获取全部合约
          params:{}//参数
        }
      });
    //获取子账号列表
    this.$api.getbcprohedgeaccountlist({
        tag: {
          dataType: BCPROHEDGEACCOUNTLIST,
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
          stoptime = this.time[1]+' 23:59:59';
        } else if (this.time.length === 1) {
          starttime = this.time[0];
        }
        console.log(this.time.length);
      } else {
        console.log("没有选择任何时间");
      }
      this.tableData = [];
      this.$api.getbcprohedge({
        tag: {
          dataType: BCPROHEDGE,
          hedaccount: this.hedaccount,
          accountid: this.accountid,
          pageNo: this.currentPage,
          pagesize: this.currentPageNum,
          star: starttime,
          end: stoptime
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case BCPROHEDGE:
          if (data.ret === 0) {
            if(data.data.list){
              this.tableData = data.data.list;
              this.datatotal = data.data.total;
            }else{
              this.tableData = [];
              this.datatotal = 0;
            }
          }
          break;
        case HYPZ_SXF:
          if (data.ret === 0) {
            if (data.data) {
              data.data.sort((a, b)=> b.orderby-a.orderby);
              this.accountData = data.data.map(v=>{
                return {
                  label:v.traderpairs,
                  value:v.traderpairs
                }
              });
              this.accountid = this.accountData[0].value;
              this.getData();
            }
          }
          break;
        case BCPROHEDGEACCOUNTLIST:
          if (data.ret === 0) {
            if(data.data){
                this.hedaccountData = this.hedaccountData.concat(
                    data.data.map((v,index)=>{
                        return {
                            label:v.hedgeaccount,
                            value:v.hedgeaccount
                        }
                    })
                )
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
  width: 150px;
}
.searchTitle{
    width: 110px;
    text-align: right;
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
