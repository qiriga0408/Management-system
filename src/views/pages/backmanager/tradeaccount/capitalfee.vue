<!--资金费用扣除-->
<template>
  <div class="lsjl">
    <div class="w_menu">
      <span class="searchTitle">合约交易对</span>
       <el-select v-model="jydselect" placeholder="请选择类型" class="inputs" >
        <el-option   v-for="item in jyddata"  :key="item.traderid" :label="item.label" :value="item.value"></el-option>
      </el-select>

       <el-date-picker
        v-model="time"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>

      <el-button type="primary" class="buttons" @click="search">搜索</el-button>
      <el-button type="primary" class="buttons" @click="look">查看明细</el-button>
    </div>
    <div id="wcdiv_lsjl" class="w_c">
      <el-table
        :data="tableData"
        style="width:100%"
        :cell-style="{ height: rowh + 'px' }"
      >
        <el-table-column prop="createdby" label="触发时间" min-width="180"></el-table-column>
        <el-table-column prop="contractcode" label="合约" min-width="180"></el-table-column>
        <el-table-column prop="coinname" label="保证金币种" min-width="180"></el-table-column>
        <el-table-column prop="interval" label="时间间隔" min-width="180"></el-table-column>
        <el-table-column prop="fundingrate" label="当期资金费率" min-width="180"></el-table-column>
        <el-table-column prop="buytosell" label="扣除的资金费用总和" min-width="180">
          <template slot-scope="scope">
             <span>{{Number(scope.row.buytosell).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="selltobuy" label="奖励的资金费用总和" min-width="180">
          <template slot-scope="scope">
             <span>{{Number(scope.row.selltobuy).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalamount" label="支付后账户总资产" min-width="180">
          <template slot-scope="scope">
             <span>{{Number(scope.row.totalamount).toFixed(6)}}</span>
          </template>
        </el-table-column>
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
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { HYJY_ZJFLKC } from "@/constant";
import Label from "@/components/label";
export default {
  data() {
    return {
      //合约交易对
      jyddata:[],
      jydselect:'',
      
      time: [],
      datatotal: 0, //总数据条数
      currentPageNum: 9, //每页默认10条
      currentPage: 1, //当前页
      rowh: 40, //行高
      tableData: []
    };
  },
  components: {
    Label:Label
  },
  mounted() {
    this.$register(this);
    this.msg = [HYJY_ZJFLKC];
    this.time.push(this.getYesDay());
    this.time.push(this.getNowDate());
    let a = document.getElementById("wcdiv_lsjl");
    let h = a.clientHeight - 60;
    this.currentPageNum = Math.round(h / this.rowh);
    this.rowh = Math.round(h / this.currentPageNum);
    this.getData();
    this.jyddata = [];
    this.$api.bcprofunding({
      tag: {
        dataType: HYJY_ZJFLKC,
        url:"/managers/v1/manager/bcprocontractset",
        take:2,//编辑合约组交易状态
        params:{}//参数
      }
    });
  },
  computed: {},
  methods: {
    //弹出透视图
    tst(){

    },
    //查看明细
    look(){
       this.$router.push({path: "/tradeaccount/capitalfeedetail"});
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
          stoptime = this.time[1]+" 23:59:59";
        } else if (this.time.length === 1) {
          starttime = this.time[0];
        }
        console.log(this.time.length);
      } else {
        console.log("没有选择任何时间");
      }
      this.tableData = [];
      this.$api.bcprofunding({
        tag: {
          dataType: HYJY_ZJFLKC,
          url:"/managers/v1/manager/bcprofunding",
          take:1,//资金费用
          params:{
            pageNo: this.currentPage,
            pagesize: this.currentPageNum,
            contractcode:this.jydselect,
            star:starttime,
            end:stoptime
          }//参数
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case HYJY_ZJFLKC:
          if(data.ret === 0){
            switch(tag.take){
              case 1://资金费用
                if (data.data.list) {
                  this.tableData = data.data.list;
                  this.datatotal = Number(data.data.total);
                }else{
                  this.datatotal = 0;
                }
                break;
              case 2:
                if(data.data){
                  for(let i = 0;i<data.data.length;i++){
                    data.data[i]['value'] =  data.data[i].traderpairs;
                    data.data[i]['label'] =  data.data[i].traderpairs.toUpperCase();
                  }
                  this.jyddata = data.data;
                  this.jyddata.unshift({coinid:'',value:'',label:'全部'})//  放入-1
                }
                break;
            }
          }else{
            this.datatotal = 0;
          }
          break;
      }
    },
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
    .divuser{
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
