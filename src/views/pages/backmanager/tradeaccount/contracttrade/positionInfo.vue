<!--持仓数据-->
<template>
  <div class="lsjl">
    <div class="w_menu">
      <span class="searchTitle">合约交易对</span>
       <el-select v-model="jydselect" placeholder="请选择交易对" class="inputs" >
        <el-option   v-for="item in jyddata"  :key="item.traderid" :label="item.label" :value="item.value"></el-option>
      </el-select>

       <span class="searchTitle">方向</span>
       <el-select v-model="fxselect" placeholder="请选择类型" class="inputs" >
        <el-option   v-for="item in fxdata"  :key="item.value" :label="item.label" :value="item.value"></el-option>
       </el-select>
      <span class="searchTitle">排序</span>
       <el-select v-model="pxselect" placeholder="请选择排序" class="inputs" >
        <el-option   v-for="item in pxdata"  :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>

      <el-button type="primary" class="buttons" @click="search">搜索</el-button>
    </div>
    <div class="divuser">
        <Label :title="'未平仓合约张数：'"           :value="pcdata.nopc" titleWidth="250px" valueWidth="200px" labelContainer = "defaultLabelC" labelTitle = "Labeltblack" labelContext = "Labelvblack" ></Label>
        <Label :title="'未平仓合约价值：'"           :value="pcdata.nopcbtc" titleWidth="250px" valueWidth="200px" labelContainer = "defaultLabelC" labelTitle = "Labeltblack" labelContext = "Labelvblack" ></Label>
        <Label :title="'未平仓合约_多单开仓均价：'"  :value="pcdata.bprice" titleWidth="250px" valueWidth="200px" labelContainer = "defaultLabelC" labelTitle = "Labeltblack" labelContext = "Labelvblack" ></Label>
        <Label :title="'未平仓合约_多单未实现盈亏：'" :value="pcdata.bporit" titleWidth="250px" valueWidth="200px" labelContainer = "defaultLabelC" labelTitle = "Labeltblack" labelContext = "Labelvblack" ></Label>
        <Label :title="'未平仓合约_空单开仓均价：'"  :value="pcdata.sprice" titleWidth="250px" valueWidth="200px" labelContainer = "defaultLabelC" labelTitle = "Labeltblack" labelContext = "Labelvblack" ></Label>
        <Label :title="'未平仓合约_空单未实现盈亏：'" :value="pcdata.sporit" titleWidth="250px" valueWidth="200px" labelContainer = "defaultLabelC" labelTitle = "Labeltblack" labelContext = "Labelvblack" ></Label>
      </div>
    <div id="wcdiv_lsjl" class="w_c">
      <el-table
        :data="tableData"
        style="width:100%"
        :cell-style="{ height: rowh + 'px' }"
      >
        <el-table-column prop="contractcode" label="合约" min-width="100"></el-table-column>
        <el-table-column prop="userid" label="UID" min-width="80"></el-table-column>
        <el-table-column prop="coinname" label="保证金币种" min-width="100"></el-table-column>
        <el-table-column prop="accounttype_s" label="账户模式" min-width="100"></el-table-column>
        <el-table-column prop="lever" label="杠杆" min-width="80"></el-table-column>
        <el-table-column prop="forceprice" label="强平价格" min-width="100">
          <template slot-scope="scope">
            <span>{{Number(scope.row.forceprice).toString()}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="side_s" label="持仓方向" min-width="120"></el-table-column>
        <el-table-column prop="price" label="开仓均价" min-width="120"></el-table-column>
        <el-table-column prop="volume" label="持仓张数" min-width="100"></el-table-column>
        <el-table-column prop="volume" label="持仓价值" min-width="120">
          <template slot-scope="scope">
            <span>{{Number(Number(scope.row.volume)*Number(scope.row.parvalue)*Number(scope.row.price)).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="initmargin" label="起始保证金" min-width="120">
           <!-- <template slot-scope="scope">
            <span>{{Number(scope.row.margin-scope.row.commission).toFixed(6)}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="adjustmargin" label="调整保证金" min-width="120">
           <template slot-scope="scope">
            <span>{{scope.row.accounttype===1?'--':scope.row.adjustmargin}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="margin" label="仓位保证金" min-width="120">
          <template slot-scope="scope">
            <span>{{Number(scope.row.margin+scope.row.floatprofit).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="available" label="可用余额" min-width="120"></el-table-column>
        <el-table-column prop="floatprofit" label="未实现盈亏" min-width="120">
           <!-- <template slot-scope="scope">
            <span>{{scope.row.floatprofit_s}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="profitratio" label="盈亏率" min-width="100">
          <template slot-scope="scope">
            <span>{{(Number(scope.row.profitratio)*100).toFixed(4)+'%'}}</span>
          </template>
        </el-table-column>
         <el-table-column prop="marginratio" label="保证金率" min-width="100">
          <template slot-scope="scope">
            <span>{{(Number(scope.row.marginratio)*100).toFixed(4)+'%'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contractindex" label="合约指数价格" min-width="120"></el-table-column>
        <el-table-column prop="buyprice" label="合约买入价格" min-width="120"></el-table-column>
        <el-table-column prop="sellprice" label="合约卖出价格" min-width="120"></el-table-column>
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
import { HYJY_CCSJ } from "@/constant";
import Label from "@/components/label";
export default {
  data() {
    return {
     //合约交易对
      jyddata:[],
      jydselect:'',
      //方向选择
      fxdata:[{'label':'全部方向','value':''},{'label':'买入做多','value':'B'},{'label':'卖出做空','value':'S'}],
      fxselect:"",
      //排序
      pxdata:[
        {'label':'按强平价格从高到低','value':1},
        {'label':'按强平价格从低到高','value':2},

        {'label':'按持仓均价从高到低','value':3},
        {'label':'按持仓均价从低到高','value':4},

        {'label':'按未实现盈亏从高到低','value':5},
        {'label':'按未实现盈亏从低到高','value':6},

        {'label':'按盈利率从高到低','value':7},
        {'label':'按盈利率从低到高','value':8},

        {'label':'按回报率从高到底','value':9},
        {'label':'按回报率从低到高','value':10},
       
      ],
      pxselect:1,
      
      pcdata:{},
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
    this.msg = [HYJY_CCSJ];
    let a = document.getElementById("wcdiv_lsjl");
    let h = a.clientHeight - 60;
    this.currentPageNum = Math.round(h / this.rowh);
    this.rowh = Math.round(h / this.currentPageNum);
    this.jyddata = [];
    this.$api.bcproposition({
      tag: {
        dataType: HYJY_CCSJ,
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
          stoptime = this.time[1];
        } else if (this.time.length === 1) {
          starttime = this.time[0];
        }
        console.log(this.time.length);
      } else {
        console.log("没有选择任何时间");
      }
      this.tableData = [];
      // 19.持仓信息
      // 地址：/v1/manager/qbproposition
      // 参数：contractcode  交易对，side 空全部 B买S卖，torder 排序（按顺序）
      // 返回：{"ret": 0,"msg": "","data":{"list": [{}],"total": 1}，"totalsum":{"nopc": 1122,"nopcbtc": 11.11} }
      // 解释:nopc未平仓张数，nopcbtc未平仓合约价值, bprice 多单开仓均价,bporit 多单未实现盈亏,sprice空单开仓均价,sporit 空单未实现盈亏,
      // userid 用户id，contractcode合约代码，sideB买S卖,volume持仓张数,price实际开仓均价,nominalprice名义开仓均价,accounttype账户模式 1：全仓 2：逐仓,lever杠杆,forcecloseprice强平价格,initmargin起始保证金，positionmargin仓位保证金，adjustmargin调整保证金，floatprofit未实现盈亏，profitratio盈亏率，roic	回报率
      this.$api.bcproposition({
        tag: {
          dataType: HYJY_CCSJ,
          url:"/managers/v1/manager/bcproposition",
          take:1,//持仓信息
          params:{
            pageNo: this.currentPage,
            pagesize: this.currentPageNum,
            contractcode:this.jydselect,
            side:this.fxselect,
            torder:this.pxselect
          }//参数
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case HYJY_CCSJ:
          if(data.ret === 0){
            switch(tag.take){
              case 1://交易列表
                this.pcdata = data.data.totalsum;
                if (data.data.list) {
                  data.data.list.map(v=>{
                    if(v.side == 'B'){
                      v['side_s'] = "买入做多 看涨";
                    }else{
                        v['side_s'] = "卖出做空 看跌";
                    }

                    if(v.accounttype == 1){
                      v['accounttype_s'] = "全仓";
                    }else{
                      v['accounttype_s'] = "逐仓";
                    }
                  })
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
                    if(i == 0){
                      this.jydselect = data.data[i]['value'];
                    }
                  }
                  this.jyddata = data.data;
                  this.getData();
                }
                break;
            }
          }else{
            if(tag.take == 1)this.datatotal = 0;
          }
          break;
      }
    },
    //只能输入正整数的验证
    number() {
      this.input = this.input.replace(/[^\.\d]/g, "");
      this.input = this.input.replace(".", "");
    },
    numberphone() {
      this.phone = this.phone.replace(/[^\.\d]/g, "");
      this.phone = this.phone.replace(".", "");
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
