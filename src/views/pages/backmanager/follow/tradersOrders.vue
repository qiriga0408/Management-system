<!-- 带单查询 -->
<template>
  <div class="dhjl">
    <div class="w_menu">
      <el-input v-model="input" @keyup.native="number" placeholder="请输入UID" class="inputw" clearable></el-input>
      <el-input v-model="orderVal" @keyup.native="number" placeholder="请输入订单号" class="inputs" clearable></el-input>
      <el-select v-model="contract" clearable placeholder="请选择类型" class="inputs" >
        <el-option v-for="item in jyddata"  :key="item.traderid" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="side" placeholder="请选择类型" clearable class="inputs">
        <el-option
          v-for="(item,index) in sideType"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <!-- <span class="searchTitle">用户名</span>
      <el-input v-model="username" placeholder="请输入手机号或者邮箱" class="inputs" clearable></el-input> -->
      
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
    <div class="w_c">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="当前带单" name="0">
          <el-table :data="tableData" style="width:100%">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="id" label="订单号"  min-width="120">
              <template slot-scope="scope">
                <span>{{JSON.stringify(scope.row.id) || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="user_id" label="UID"  min-width="90"> </el-table-column>
            <el-table-column prop="nickname" label="昵称"  min-width="120">
              <template slot-scope="scope">
                <span>{{scope.row.nickname || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="contract_code" label="合约"  min-width="90"> </el-table-column>
            <el-table-column prop="side" label="方向"  min-width="100">
              <template slot-scope="scope">
                <span>{{scope.row.side == 'B'?'买入做多':'卖出做空' || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="lever" label="杠杆"  min-width="80">
              <template slot-scope="scope">
                <span>&times;{{scope.row.lever || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" label="开仓时间" min-width="130"> 
              <template slot-scope="scope">
                <span>{{scope.row.create_time && scope.row.create_time.substring(0,scope.row.create_time.indexOf(" "))}}<br>{{scope.row.create_time && scope.row.create_time.substring(scope.row.create_time.indexOf(" "))}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="volume" label="张数"  min-width="80"> </el-table-column>
            <el-table-column prop="init_margin" label="保证金"  min-width="100"> </el-table-column>
            <el-table-column prop="force_price" label="预估强平价"  min-width="100"> </el-table-column>
            <el-table-column prop="limit" label="止盈"  min-width="100"> </el-table-column>
            <el-table-column prop="stop" label="止损"  min-width="100"> </el-table-column>
            <el-table-column prop="totalfollow" label="跟单数量"  min-width="100"> </el-table-column>
            <el-table-column v-if="$store.state.qx.tradersListSet" prop="" fixed="right" label="操作" width="100" > 
              <template slot-scope="scope">
                <el-button  type="primary"
                  size="mini"
                  @click="handleLook(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="历史带单" name="1">
          <el-table :data="tableData" style="width:100%">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="deal_id" label="成交编号"  min-width="120">
               <template slot-scope="scope">
                <span>{{JSON.stringify(scope.row.deal_id) || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="user_id" label="UID"  min-width="90"> </el-table-column>
            <el-table-column prop="nickname" label="昵称"  min-width="120">
              <template slot-scope="scope">
                <span>{{scope.row.nickname || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="contract_code" label="合约"  min-width="90"> </el-table-column>
            <el-table-column prop="side" label="方向"  min-width="100">
              <template slot-scope="scope">
                <span>{{scope.row.side == 'B'?'买入做多':'卖出做空'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="lever" label="杠杆"  min-width="80">
              <template slot-scope="scope">
                <span>&times;{{scope.row.lever || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="buy_price" label="开仓价"  min-width="100"> </el-table-column>
            <el-table-column prop="sell_price" label="平仓价"  min-width="100"> </el-table-column>
            <el-table-column prop="volume" label="张数"  min-width="80"> </el-table-column>
            <el-table-column prop="order_type" label="成交类型"  min-width="100">
              <template slot-scope="scope">
                <span>{{orderType[scope.row.order_type]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="total_profit" label="已实现盈亏"  min-width="120"> </el-table-column>
            <el-table-column prop="commission" label="手续费"  min-width="100"> </el-table-column>
            <el-table-column prop="back_profit" label="预计分佣"  min-width="100"> </el-table-column>
            <el-table-column prop="trade_time" label="成交时间" min-width="130"> 
              <template slot-scope="scope">
                <span>{{scope.row.trade_time && scope.row.trade_time.substring(0,scope.row.trade_time.indexOf(" "))}}<br>{{scope.row.trade_time && scope.row.trade_time.substring(scope.row.trade_time.indexOf(" "))}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalfollow" label="跟单数量"  min-width="100"> </el-table-column>
            <el-table-column v-if="$store.state.qx.tradersListSet" prop="" fixed="right" label="操作" width="100" > 
              <template slot-scope="scope">
                <el-button  type="primary"
                  size="mini"
                  @click="handleLook(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="w_page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next,jumper"
        :total="datatotal">
      </el-pagination>
    </div>
        
     <el-dialog
      title="跟单详情"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
      show-close>
      <div class="dialogc">
        <el-table :data="tableDataDetails" style="width:100%">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="user_id" label="UID"  min-width="90"> </el-table-column>
          <el-table-column prop="nickname" label="昵称"  min-width="120">
            <template slot-scope="scope">
              <span>{{scope.row.nickname || '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="contract_code" label="合约"  min-width="90"> </el-table-column>
          <el-table-column prop="side" label="方向"  min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.side == 'B'?'买入做多':'卖出做空'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="lever" label="杠杆"  min-width="80">
            <template slot-scope="scope">
              <span>&times;{{scope.row.lever}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="buy_price" label="开仓价"  min-width="100"> </el-table-column>
          <el-table-column v-if="activeName == '1'" :key="Math.random()" prop="sell_price" label="平仓价"  min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.sell_price && scope.row.sell_price}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="volume" label="张数"  :key="Math.random()" min-width="80"> </el-table-column>
          <el-table-column v-if="activeName == '1'" :key="Math.random()" prop="sell_price" label="成交类型"  min-width="100"> 
            <template slot-scope="scope">
              <span>{{scope.row.order_type && orderType[scope.row.order_type]}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="activeName == '1'" :key="Math.random()" prop="total_profit" label="已实现盈亏"  min-width="120">
            <template slot-scope="scope">
              <span>{{scope.row.total_profit && scope.row.total_profit}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="activeName == '1'" :key="Math.random()" prop="commission" label="手续费"  min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.commission && scope.row.commission}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="activeName == '1'" :key="Math.random()" prop="back_profit" label="分佣"  min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.back_profit && scope.row.back_profit}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="activeName == '1'" :key="Math.random()" prop="trade_time" label="成交时间" min-width="130"> 
            <template slot-scope="scope">
              <span>{{scope.row.trade_time && scope.row.trade_time.substring(0,scope.row.trade_time.indexOf(" "))}}<br>{{scope.row.trade_time && scope.row.trade_time.substring(scope.row.trade_time.indexOf(" "))}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="activeName == '0'" :key="Math.random()" prop="init_margin" label="保证金"  min-width="100">
            <template slot-scope="scope">
              <span>{{(scope.row.init_margin+'') && scope.row.init_margin }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="activeName == '0'" :key="Math.random()" prop="force_price" label="预估强平价"  min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.force_price && scope.row.force_price}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="activeName == '0'" :key="Math.random()" prop="limit" label="止盈"  min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.limit && scope.row.limit}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="activeName == '0'" :key="Math.random()" prop="stop" label="止损"  min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.stop && scope.row.stop}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="activeName == '0'" :key="Math.random()" prop="create_time" label="开仓时间" min-width="130"> 
            <template slot-scope="scope">
              <span>{{scope.row.create_time && scope.row.create_time.substring(0,scope.row.create_time.indexOf(" "))}}<br>{{scope.row.create_time && scope.row.create_time.substring(scope.row.create_time.indexOf(" "))}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

  </div>
  
</template>


<script>
import axios from "axios";
import Service from "@/http.js";
import Label from "@/components/label";
import {GET_TRADERS_CUR,GET_TRADERS_HIS,LOGINOK,GET_TRADERS_CUR_FOLLOWS,GET_TRADERS_HIS_FOLLOWS,HYJY_ZJFLKC} from "@/constant";
export default {
  data() {
    return {
      input:null,
      orderVal: '',
      side: '',
      contract: '',
      jyddata:[],
      time: [],
      username:'',
      datatotal:0,//总数据条数
      currentPageNum:10,//每页默认10条
      currentPage:1,//当前页
      dialogVisible:false,
      activeName: '0',
      tableData: [],
      tableDataDetails: [],
      sideType: [
        { label: "买入做多", value: 'B' },
        { label: "卖出做空", value: 'S' },
      ],
      orderType:{
        0:"市价单", 
        1:"计划单", 
        2:"止盈单", 
        4:"止损单", 
        5:"强平单",
        6:"条件平仓", 
        7:"带单平仓", 
        8:"带单止盈", 
        9:"带单止损", 
        101:"自主平仓",
        102:"带单平仓", 
        103:"止盈平仓", 
        104:"止损平仓", 
        105:"强制平仓", 
        106:"带单止盈", 
        107:"带单止损", 
        108:"带单开仓", 
      }
    }
  },
  components: { Label:Label},
  computed: {},
  mounted() {
    this.$register(this);
    this.msg = [GET_TRADERS_CUR,GET_TRADERS_HIS,LOGINOK,GET_TRADERS_CUR_FOLLOWS,GET_TRADERS_HIS_FOLLOWS,HYJY_ZJFLKC];
     
    this.time.push(this.getYesDay());
    this.time.push(this.getNowDate());
    this.getData();
    this.$api.bcprofunding({
      tag: {
        dataType: HYJY_ZJFLKC,
        url:"/managers/v1/manager/bcprocontractset",
        params:{}//参数
      }
    });
  },
  methods: {
    search(){
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

    getData(){
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
      if(this.activeName == '0'){
        this.$api.getTradersOrderCur({
          tag:{
              dataType:GET_TRADERS_CUR,
              order: this.orderVal,
              side: this.side,
              contract_code: this.contract,
              uid:this.input==null?'':this.input,
              star: starttime,
              end: stoptime,
              pageNo: this.currentPage,
              pagesize: this.currentPageNum,
            },
        });
      }else{
        this.$api.getTradersOrderHis({
          tag:{
              dataType:GET_TRADERS_HIS,
              order: this.orderVal,
              side: this.side,
              contract_code: this.contract,
              uid:this.input==null?'':this.input,
              star: starttime,
              end: stoptime,
              pageNo: this.currentPage,
              pagesize: this.currentPageNum,
            },
        });
      }
    },
    handleClick(tab, event) {
      this.datatotal = 0
      this.tableData = []
      this.currentPage = 1
      this.getData()
    },
    // 查看
    handleLook(v){
      if(this.activeName == '0'){
        this.$api.getTradersOrderCurFollows({
          tag:{
              dataType:GET_TRADERS_CUR_FOLLOWS,
              follow_position_id: v.follow_position_id,
            },
        });
      }else{
        this.$api.getTradersOrderHisFollows({
          tag:{
              dataType:GET_TRADERS_HIS_FOLLOWS,
              follow_position_id: v.follow_position_id,
            },
        });
      }
      this.dialogVisible = true;
    },
  
    handleClose() {
      this.dialogVisible = false;
    },

    dialogOkClick(){
      this.dialogVisible = false;
    },

    message(tag,data){
      switch(tag.dataType){
        case GET_TRADERS_CUR:
          if(data.ret === 0){
            let _data = data.data;
            this.datatotal = parseInt(_data.total);
            this.tableData = _data.list;
          }
          break;
        case GET_TRADERS_HIS:
          if(data.ret === 0){
            let _data = data.data;
            this.datatotal = parseInt(_data.total);
            this.tableData = _data.list;
          }
          break;
        case GET_TRADERS_CUR_FOLLOWS:
          if(data.ret === 0){
            this.tableDataDetails = data.data
          }
          break;
        case GET_TRADERS_HIS_FOLLOWS:
          if(data.ret === 0){
            this.tableDataDetails = data.data
          }
          break;
        case HYJY_ZJFLKC:
          if(data.ret === 0){
            for(let i = 0;i<data.data.length;i++){
              data.data[i]['value'] =  data.data[i].traderpairs;
              data.data[i]['label'] =  data.data[i].traderpairs.toUpperCase();
            }
            this.jyddata = data.data;
            // this.jyddata.unshift({coinid:'',value:'',label:'全部'})//  放入-1
          }
          break;
      }
    },
     //只能输入正整数的验证
    number(){　　
　　　 this.input=this.input.replace(/[^\.\d]/g,'');
      this.input=this.input.replace('.','');
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
  },

  beforeDestroy(){
    this.$unRegister(this);
  }
};
</script>

<style lang="less" scoped>
.inputw{
    width:150px;
    padding-right:30px;
}

.inputs{
   width: 200px;
   margin-right: 30px;
}

.buttons{
    margin-left:30px;
}

.dhjl {
  width: 100%;
  display: flex;
  flex-direction: column;
  .w_menu{
    width:100%;
    flex-shrink:0;
    box-sizing: border-box;
    display: flex;
    align-items:center;
    padding-bottom: 10px;
  };
  .w_c{
    width:100%;
    flex-grow:1;
    box-sizing: border-box;
    display: flex;
    align-items:center;
    justify-content:flex-start;
  };
  .multi_line{
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .w_page{
    flex-shrink:0;
    display: flex;
    align-items:center;
    justify-content:flex-end;
    padding-top:10px;
    padding-right:30px;
  }
  /deep/.el-tabs {
    width: 100%;
  }
  /deep/.el-dialog {
    .el-dialog__header {
      text-align: left;
      padding: 19px;
      border-bottom: 1px solid #E4E5E8;
    }
    .el-dialog__body {
      width: 90% !important;
      margin: 0 auto;
    }
    .el-dialog__footer{
      text-align: right;
      padding: 10px;
      border-top: 1px solid #E4E5E8;
    }
  }
}

.dialogc{
  max-height: 700px;
  overflow-y: scroll;
  .el-row {
    text-align: left;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.dialogstip{
  color:red;
  padding: 20px 10px;
}
</style>

