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
      <span class="searchTitle">合约交易对</span>
       <el-select v-model="jydselect" placeholder="请选择合约" class="inputs" >
        <el-option   v-for="(item ,index) in jyddata"  :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span class="searchTitle">类型</span>
       <el-select v-model="typeselect" placeholder="请选择类型" class="inputs" >
        <el-option   v-for="(item,index) in typeData"  :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button type="primary" class="buttons" @click="search">搜索</el-button>
    </div>
    <div id="wcdiv_lsjl" class="w_c">
      <el-table
        :data="tableData"
        style="width:100%"
        :cell-style="{ height: rowh + 'px' }"
      >
        <el-table-column prop="createdby" label="预警时间" min-width="180">
          <template slot-scope="scope">
            <span>{{scope.row.createdby.substring(0,scope.row.createdby.indexOf(" "))}}</span><br>
            <span>{{scope.row.createdby.substring(scope.row.createdby.indexOf(" "))}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="api_name" label="上手数据源" min-width="180">
          <!-- <template>
            <span>OKEX</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="contractcode" label="合约代码" min-width="180">
          <template slot-scope="scope">
            <span>{{scope.row.contractcode?scope.row.contractcode:'--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="noticetype_s" label="预警类型" min-width="180"></el-table-column>
        <el-table-column prop="noticecontent" label="预警内容" min-width="180"></el-table-column>
        <el-table-column prop="noticestatus_s" label="状态" min-width="180"></el-table-column>
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
import { BCPROHEDGENOTICE,ASSETS_COINLIST ,HYJY_ZJFLLS} from "@/constant";
export default {
  data() {
    return {
      typeData:[{label:'全部预警类型',value:0},
                // {label:'资产类',value:1},
                // {label:'交易类',value:2},
                {label:'API状态类',value:3},
                {label:'行情数据类',value:4}],
      typeselect:0,
      time: [],
      //合约交易对
      jyddata:[],
      jydselect:'',
      datatotal: 0, //总数据条数
      currentPageNum: 10, //每页默认10条
      currentPage: 1, //当前页
      rowh: 40, //行高
      tableData: []
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [BCPROHEDGENOTICE,HYJY_ZJFLLS];
    this.time.push(this.getYesDay());
    this.time.push(this.getNowDate());
    let a = document.getElementById("wcdiv_lsjl");
    let h = a.clientHeight - 60;
    this.currentPageNum = Math.round(h / this.rowh);
    this.rowh = Math.round(h / this.currentPageNum);
    this.getData();
    this.jyddata = [];
    this.$api.bcproffundingfee({
      tag: {
        dataType: HYJY_ZJFLLS,
        url:"/managers/v1/manager/bcprocontractset",
        take:2,//编辑合约组交易状态
        params:{}//参数
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
      this.$api.bcpromarketnotice({
       "tag":{
         "dataType":BCPROHEDGENOTICE,
         ttype:this.typeselect,
         contract_code:this.jydselect,
         "star":starttime,
         "end":stoptime,
         "pageNo":this.currentPage,
         "pagesize":this.currentPageNum
        }});
    },

    message(tag, data) {
      switch (tag.dataType) {
        case BCPROHEDGENOTICE:
          if(data.ret === 0){
            this.tableData = data.data.list && data.data.list.map(v=>{
              let type = this.typeData.find(t=>t.value === v.noticetype);
              if(type !== undefined){
                v.noticetype_s = type.label;
              }else{
                v.noticetype_s = '其它';
              }
              v.noticestatus_s = v.noticestatus===1?'成功':'失败';
              return v;
            }) || [];
            this.datatotal = data.data.total;
          }else{
            this.datatotal = 0;
          }
          break;
        case HYJY_ZJFLLS:
          if(data.ret === 0){
            switch(tag.take){
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
.searchTitle{
    padding-left: 10px;
}
.inputw {
  width: 190px;
  padding-right: 7px;
}

.inputs {
  margin-right: 20px;
  width: 180px;
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
