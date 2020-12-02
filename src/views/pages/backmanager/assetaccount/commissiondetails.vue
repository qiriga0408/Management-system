<!--财务记录-->
<template>
  <div class="lsjl">
     <div class="w_menu">
      <span class="searchTitle">UID</span>
      <el-input
        v-model="input"
        placeholder="请输入UID"
        @keyup.native="number"
        class="inputw"
        clearable
      ></el-input>
      <span class="searchTitle">奖励类型</span>
       <el-select v-model="typeSelected" placeholder="请选择类型" class="inputs" >
        <el-option   v-for="(item,index) in typeData"  :key="index" :label="item.label" :value="item.value"></el-option>
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
    </div>
    <div id="wcdiv_lsjl" class="w_c">
      <el-table
        :data="tableData"
        style="width:100%"
        :cell-style="{ height: rowh + 'px' }"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="userid" label="UID" min-width="180"></el-table-column>
        <el-table-column prop="rebateratio" label="返佣比例" > 
          <template slot-scope="scope">
            <span>{{scope.row.rebateratio+'%'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="optype_s" label="类型" > </el-table-column>
        <el-table-column prop="audittime" label="清算时间" min-width="180"></el-table-column>
        <el-table-column prop="amount" label="前日邀请奖励" min-width="180"></el-table-column>
        <el-table-column prop="producecommission" label="前日邀请业绩_手续费" min-width="180"></el-table-column>
        <el-table-column prop="totalinvitenumbers" label="前日邀请业绩_累计人数" min-width="180"></el-table-column>
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
import { COMMISSIONDETAILS } from "@/constant";
export default {
  data() {
    return {
      //合约交易对
      input:'',
      time: [],
      datatotal: 0, //总数据条数
      currentPageNum: 9, //每页默认10条
      currentPage: 1, //当前页
      rowh: 40, //行高
      tableData: [],
      typeData:[{label:'全部',value:0},{label:'邀请佣金',value:1},{label:'代理佣金',value:2}],
      typeSelected:0
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [COMMISSIONDETAILS];
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
       if(this.input){
         if(!(/^(0|\+?[1-9][0-9]*)$/).test(this.input)){
          this.$notify({title: '警告', message: 'UID只能输入正整数' , type: 'warning' });
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
          stoptime = this.time[1]+' 23:59:59';
        } else if (this.time.length === 1) {
          starttime = this.time[0];
        }
        console.log(this.time.length);
      } else {
        console.log("没有选择任何时间");
      }
      this.tableData = [];
      this.$api.geCommissionDetails({
        tag: {
          dataType: COMMISSIONDETAILS,
            uid:this.input,
            ttype:this.typeSelected,
            pageNo:this.currentPage,
            pagesize:this.currentPageNum,
            star:starttime,
            end:stoptime
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case COMMISSIONDETAILS:
          if(data.ret === 0){
               if (data.data.list) {
                  this.tableData = data.data.list.map(v=>{
                    switch(v.optype){
                      case 1:
                        v.optype_s = '邀请佣金';
                        break;
                      case 2:
                        v.optype_s = '代理佣金';
                        break;
                      default:
                        v.optype_s = '其它';
                        break;
                    }
                    return v;
                  }) || [];
                  this.datatotal = Number(data.data.total);
               }else{
                 this.tableData = [];
                 this.datatotal = 0;
               }
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
