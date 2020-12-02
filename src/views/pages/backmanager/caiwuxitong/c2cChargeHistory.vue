<!--糖果资产-->
<template>
  <div class="tgzc">
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
    <div class="w_c">
      <el-table :data="tableData" stripe border style="width:100%">
        <!-- <el-table-column type="index"></el-table-column> -->
        <el-table-column prop="createat" resizable fixed label="时间">
         <template slot-scope="scope">
            <span>{{scope.row.createat.substring(0,scope.row.createat.indexOf(" "))}}</span><br>
            <span>{{scope.row.createat.substring(scope.row.createat.indexOf(" "))}}</span>
          </template>  
        </el-table-column>
        <el-table-column prop="coinname" resizable label="币种"> </el-table-column>
        <el-table-column prop="optype_s" resizable label="类型"> </el-table-column>
        <el-table-column prop="amount" resizable label="变化数量">
          <template slot-scope="scope">
            <span>{{Number(scope.row.amount).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amountafter" resizable label="剩余可用余额">
          <template slot-scope="scope">
            <span>{{Number(scope.row.amountafter).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="remark" resizable label="用途归类"> </el-table-column> -->
        <el-table-column prop="opusername" resizable fixed="right" label="操作人">
          <template slot-scope="scope">
            <span>{{scope.row.opusername?scope.row.opusername:"【系统自动】"}}</span>
          </template> 
        </el-table-column>
      </el-table>
    </div>
    <div class="w_page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="datatotal">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {GETPTZHLSJL} from "@/constant";
export default {
  data() {
    return {
      time:[],
      datatotal:0,//总数据条数
      currentPageNum:10,//每页默认10条
      currentPage:1,//当前页
      tableData: []
      }
  },
  components: {
   
  },
  mounted() {
     this.$register(this);
     this.msg = [GETPTZHLSJL];
      this.time.push(this.getYesDay());
      this.time.push(this.getNowDate());
     this.getData();
  },
  computed: {},
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
    getData(){
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
      this.$api.getC2cChargeHistory({
       "tag":{
         "dataType":GETPTZHLSJL,
         "star":starttime,
         "end":stoptime,
         "pageNo":this.currentPage,
         "pagesize":this.currentPageNum
        }});
    },

    message(tag,data){
      switch(tag.dataType){
        case GETPTZHLSJL:
          if(data.ret === 0){
            if(data.data && data.data.list){
              data.data.list.map(v=>{
               switch(v.optype){
                 case 1:
                   v.optype_s = "交易手续费";
                   break;
                  case 4:
                    v.optype_s = "提币手续费";
                    break;
                  case 8:
                    v.optype_s = "盈亏收入";
                    break;
                  case 9:
                    v.optype_s = "资金费用";
                    break;
                  case 100:
                    v.optype_s = "平台账户充币";
                    break;
                  case 200:
                    v.optype_s = "平台账户提币";
                    break;
                  case 300:
                    v.optype_s = "转入";
                    break;
                  case 301:
                    v.optype_s = "转入到交易账户";
                    break;
                  case 302:
                    v.optype_s = "转入到资产账户";
                    break;
                  case 310:
                    v.optype_s = "转出";
                    break;
                  case 311:
                    v.optype_s = "转出到交易账户";
                    break;
                  case 312:
                    v.optype_s = "转出到资产账户";
                    break;
                  case 320:
                    v.optype_s = "平台提币手续费";
                    break;
                  case 330:
                    v.optype_s = "邀请佣金奖励";
                    break;
                  case 331:
                    v.optype_s = "代理佣金奖励";
                    break;
                  case 332:
                    v.optype_s = "空投";
                    break;
                  case 333:
                    v.optype_s = "C2C结算";
                    break;
                  case 334:
                    v.optype_s = "C2C其他用途";
                    break;
               }
             });
            }
            
             this.tableData = data.data.list;
             this.datatotal = Number(data.data.total);
          }
          break;
      }
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
    padding-right:30px;
}

.buttons{
    margin-left:30px;
}

.tgzc {
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
  .w_page{
    flex-shrink:0;
    display: flex;
    align-items:center;
    justify-content:flex-end;
    padding-top:10px;
    padding-right:30px;
  }

}

.dialogc{
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-content:center;
}

.dialogstip{
  color:red;
  padding: 20px 10px;
}
</style>
