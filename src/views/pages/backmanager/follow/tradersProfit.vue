<!-- 分佣查询 -->
<template>
  <div class="dhjl">
    <div class="w_menu">
      <span class="searchTitle">UID</span>
      <el-input v-model="input" @keyup.native="number" placeholder="请输入UID" class="inputw" clearable></el-input>
      
      <!-- <el-date-picker
        v-model="time"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker> -->
      <el-button type="primary" class="buttons" @click="search">搜索</el-button>
    </div>
    <div class="w_c">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="待分佣列表" name="1">
          <el-table :data="tableData" style="width:100%">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="trader_uid" label="UID"  min-width="90"> </el-table-column>
            <el-table-column prop="nickname" label="昵称"  min-width="120">
              <template slot-scope="scope">
                <span>{{scope.row.nickname || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="wait_profit" label="待盈利分佣"  min-width="100"> </el-table-column>
            <el-table-column prop="wait_loss" label="待亏损退回"  min-width="100"> </el-table-column>
            <el-table-column prop="expect" label="预计实际分佣"  min-width="100"> </el-table-column>
            <el-table-column v-if="$store.state.qx.tradersListSet" prop="" fixed="right" label="操作" width="100" > 
              <template slot-scope="scope">
                <el-button  type="primary"
                  size="mini"
                  @click="handleLook(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="分佣历史" name="2">
          <el-table :data="tableData" style="width:100%">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="trader_uid" label="UID"  min-width="90"> </el-table-column>
            <el-table-column prop="nickname" label="昵称"  min-width="120">
              <template slot-scope="scope">
                <span>{{scope.row.nickname || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="already_profit" label="盈利分佣"  min-width="100"> </el-table-column>
            <el-table-column prop="already_loss" label="亏损分佣"  min-width="100"> </el-table-column>
            <el-table-column prop="total_actual_amount" label="实际分佣"  min-width="100"> </el-table-column>
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
      title="分佣详情"
      :visible.sync="dialogVisible"
      width="80%" 
      :before-close="handleClose"
    >
      <div class="dialogc">
        <el-table ref="table112" :data="tableDataDetails" style="width:100%" >
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="trader_uid" label="UID"  min-width="90"> </el-table-column>
          <el-table-column prop="nickname" label="昵称"  min-width="120">
            <template slot-scope="scope">
              <span>{{scope.row.nickname || '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="already_profit" label="盈利分佣"  min-width="100"> </el-table-column>
          <el-table-column prop="already_loss" label="亏损分佣"  min-width="100"> </el-table-column>
          <el-table-column prop="total_actual_amount" label="实际分佣"  min-width="100"> </el-table-column>
          <el-table-column prop="start_audit_time" label="分佣时间" min-width="130"> 
            <template slot-scope="scope">
              <span>{{scope.row.start_audit_time && scope.row.start_audit_time.substring(0,scope.row.start_audit_time.indexOf(" "))}}<br>{{scope.row.start_audit_time && scope.row.start_audit_time.substring(scope.row.start_audit_time.indexOf(" "))}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="$store.state.qx.tradersListSet" prop="" label="操作" width="100" > 
            <template slot-scope="scope">
              <el-button  type="primary"
                size="mini"
                @click="toogleExpand(scope.$index, scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <!-- 展开部分 -->
          <el-table-column type="expand" width="1">
            <template slot-scope="scope">
              <div class="details_content">
                <el-table :data="scope.row.details" style="width:100%" border>
                  <el-table-column prop="deal_id" label="成交编号"  min-width="120">
                    <template slot-scope="scope">
                      <span>{{JSON.stringify(scope.row.deal_id) || '--'}}</span>
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
                  <el-table-column prop="back_profit" label="分佣"  min-width="100"> </el-table-column>
                  <el-table-column prop="trade_time" label="成交时间" min-width="130"> 
                    <template slot-scope="scope">
                      <span>{{scope.row.trade_time && scope.row.trade_time.substring(0,scope.row.trade_time.indexOf(" "))}}<br>{{scope.row.trade_time && scope.row.trade_time.substring(scope.row.trade_time.indexOf(" "))}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
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
import {GET_TRADERS_FOLLOW_TOTAL,GET_TRADERS_FOLLOW,GET_TRADERS_FOLLOW_BYID} from "@/constant";
export default {
  data() {
    return {
      input:null,
      username:'',
      datatotal:0,//总数据条数
      currentPageNum:10,//每页默认10条
      currentPage:1,//当前页
      dialogVisible:false,
      activeName: '1',
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
      },
      tableData: [],
      tableDataDetails: [],
      tableDataDetailsDetails: [],
      getRowKeys (row) {
        return row.id
      },
    }
  },
  components: { Label:Label},
  computed: {},
  mounted() {
    this.$register(this);
    this.msg = [GET_TRADERS_FOLLOW_TOTAL,GET_TRADERS_FOLLOW,GET_TRADERS_FOLLOW_BYID];
    this.getData();
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
      this.$api.getTradersPorfit({
        tag:{
            dataType:GET_TRADERS_FOLLOW_TOTAL,
            stype: Number(this.activeName),
            uid:this.input==null?'':this.input,
            pageNo: this.currentPage,
            pagesize: this.currentPageNum,
          },
       });
    },
    handleClick(tab, event) {
      this.datatotal = 0
      this.tableData = []
      this.currentPage = 1
      this.getData()
    },
    // 查看
    handleLook(v){
      this.$api.getTradersOrderDetails({
        tag:{
          dataType: GET_TRADERS_FOLLOW,
          stype: Number(this.activeName),
          trader_uid: v.trader_uid
        },
      });
      this.dialogVisible = true;
    },
    toogleExpand(index,row) {
      const $table = this.$refs.table112
      // 注意，这里的 this.list 是上面 data 中的 list
      // 通过比对数据与行里的数据，对展开行进行控制，获取对应值
      this.tableDataDetails.map((item) => {
        if (row.trader_uid !== item.trader_uid) {
          $table.toggleRowExpansion(item, false)
        }
      })
      this.$api.getUserProfit({
        tag:{
          dataType: GET_TRADERS_FOLLOW_BYID,
          curIndex:index,
          stype: Number(this.activeName),
          trader_uid: row.trader_uid,
          follow_uid: row.follow_uid,
          start_audit_time: row.start_audit_time
        },
      });
      $table.toggleRowExpansion(row)
    },
    handleClose() {
      this.dialogVisible = false;
    },

    dialogOkClick(){
      this.dialogVisible = false;
    },

    message(tag,data){
      switch(tag.dataType){
        case GET_TRADERS_FOLLOW_TOTAL:
          if(data.ret === 0){
            let _data = data.data;
            this.datatotal = parseInt(_data.total);
            this.tableData = _data.list;
          }
          break;
        case GET_TRADERS_FOLLOW:
          if(data.ret === 0){
            data.data.map(item => {
              item.details = [];
            });
            this.tableDataDetails = data.data
          }
          break;
        case GET_TRADERS_FOLLOW_BYID:
          if(data.ret === 0){
            // this.tableDataDetailsDetails = []
            // this.tableDataDetailsDetails = data.data
            this.tableDataDetails[tag.curIndex].details = data.data
          }
          break
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
  /deep/.el-table__expanded-cell{
    padding: 15px 30px;
  }
  .details_content{
    max-height: 400px;
    overflow-y: scroll;
    overflow-x: hidden;
    // /deep/.el-table{
    //   margin-left: -1px;
    // }
  }
}

</style>

