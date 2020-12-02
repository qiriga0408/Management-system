<!--条件单-->
<template>
  <div class="lsjl">
    <div class="w_menu">
      <!-- <span class="searchTitle">UID</span> -->
      <el-input
        v-model="input_uid"
        placeholder="请输入UID"
        class="inputw"
        clearable
      ></el-input>
      <!-- <span class="searchTitle">合约交易对</span> -->
       <el-select v-model="jydselect" placeholder="请选择交易对" class="inputs" >
        <el-option   v-for="(item,index) in jyddata"  :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>

       <!-- <span class="searchTitle">方向</span> -->
       <el-select v-model="fxselect" placeholder="请选择方向" class="inputs" >
        <el-option   v-for="(item,index) in fxdata"  :key="index" :label="item.label" :value="item.value"></el-option>
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
        <el-table-column prop="" label="撤单操作" min-width="180">
          <template slot-scope="scope">
              <el-button   v-if="$store.state.qx.bcproconditionsheetcancel" type="primary" :disabled="!(scope.row.status==1)" size="small" @click="chedan(scope.row)">{{scope.row.btn_s}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="contractcode" label="合约" min-width="180"></el-table-column>
        <el-table-column prop="userid" label="UID" min-width="180"></el-table-column>
        <el-table-column prop="offset_s" label="开平仓" min-width="180"></el-table-column>
        <el-table-column prop="side_s" label="多空方向" min-width="180"></el-table-column>
        <el-table-column prop="createtime" label="提交时间" min-width="180"></el-table-column>
        <el-table-column prop="orderamount" label="张数" min-width="180"></el-table-column>
        <el-table-column prop="triggerprice_s" label="触发价格" min-width="180"></el-table-column>
        <el-table-column prop="status_s" label="触发状态" min-width="180"></el-table-column>
        <el-table-column prop="ordertime" label="触发时间" min-width="180"></el-table-column>
        <el-table-column prop="accounttype_s" label="账户模式" min-width="180"></el-table-column>
        <el-table-column prop="lever" label="杠杆" min-width="180"></el-table-column>
        <el-table-column prop="orderclient_s" label="委托客户端" min-width="180"></el-table-column>
        <el-table-column prop="ipaddress" label="客户端IP" min-width="180"></el-table-column>
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
import { HYJY_TJD } from "@/constant";
export default {
  data() {
    return {
      //合约交易对
      jyddata:[],
      jydselect:'',
      //方向选择
      fxdata:[{'label':'全部方向','value':''},{'label':'买入做多','value':'B'},{'label':'卖出做空','value':'S'}],
      fxselect:"",
      input_uid: "",
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
    this.msg = [HYJY_TJD];
    this.time.push(this.getYesDay());
    this.time.push(this.getNowDate());
    let a = document.getElementById("wcdiv_lsjl");
    let h = a.clientHeight - 60;
    this.currentPageNum = Math.round(h / this.rowh);
    this.rowh = Math.round(h / this.currentPageNum);
    this.getData();
    this.jyddata = [];
    this.$api.bcproconditionorder({
      tag: {
        dataType: HYJY_TJD,
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
    chedan(v){
      this.$confirm('请确认是否撤销此条件单', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      .then(() => {
        // 32.条件单撤单//
        // 地址：/v1/manager/qbproconditionsheetcancel
        // 参数：orderid 撤单id
        // 返回：{"ret": 0,"msg": ""}
        this.$api.bcproconditionorder({
          tag: {
            dataType: HYJY_TJD,
            url:"/managers/v1/manager/bcproconditionsheetcancel",
            take:3,//撤单
            params:{
              orderid:v.planorderid,
              uid:v.userid.toString(),
              procode:v.contractcode
            }//参数
          }
        });
      })
      .catch(action => {
        
      }); 
    },
    search() {

       if(this.input_uid){
         if(!(/^(0|\+?[1-9][0-9]*)$/).test(this.input_uid)){
          this.$notify({title: '警告', message: 'UID只能输入正整数' , type: 'warning' });
          return;
         }
       } 

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
      this.$api.bcproconditionorder({
        tag: {
          dataType: HYJY_TJD,
          url:"/managers/v1/manager/bcproconditionorder",
          take:1,//全部委托
          params:{
            pageNo: this.currentPage,
            pagesize: this.currentPageNum,
            contractcode:this.jydselect,
            side:this.fxselect,
            uid:this.input_uid,
            star:starttime,
            end:stoptime 
          }//参数
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case HYJY_TJD:
          if(data.ret === 0){
            switch(tag.take){
              case 1://交易列表
                if (data.data.list) {
                  data.data.list.map(v=>{
                    if(v.side == 'B'){
                      v['side_s'] = "买入做多 看涨";
                    }else{
                      v['side_s'] = "卖出做空 看跌";
                    }
                    if(v.offset =="O"){
                      v['offset_s'] = "开仓";
                    }else{
                      v['offset_s'] = "平仓";
                    }
                    v.planorderid = v.planorderid.toString();
                    if(v.accounttype == 1){
                      v['accounttype_s'] = "全仓";
                    }else{
                        v['accounttype_s'] = "逐仓";
                    }

                    // 条件单状态(1: 未触发 0：取消 2：已触发 3: 触发失败）

                    if(v.status == 1){
                      v['btn_s'] = "撤单";
                      v['status_s'] = "等待触发";
                    }else if(v.status == 0){
                      v['btn_s'] = "已撤单";
                      v['status_s'] = "已撤单";
                    }else if(v.status == 2){
                      v['btn_s'] = "已触发";
                      v['status_s'] = "已触发";
                    }else if(v.status == 3){
                      v['btn_s'] = "触发失败";
                      v['status_s'] = "触发失败";
                    }else{
                      v['btn_s'] = "--";
                      v['status_s'] = "--";
                    }

                    if(v.orderclient == 1){
                      v['orderclient_s'] = "android";
                    }else if(v.orderclient == 2){
                      v['orderclient_s'] = "iOS";
                    }else if(v.orderclient == 3){
                      v['orderclient_s'] = "WEB";
                    }else if(v.orderclient == 4){
                      v['orderclient_s'] = "H5";
                    }else if(v.orderclient == 5){
                      v['orderclient_s'] = "open_api";
                    }else{
                      v['orderclient_s'] = "系统自动";
                    }

                    v['triggerprice_s'] = v.condition===1?'>='+v.triggerprice:'<='+v.triggerprice;
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
                  }
                  this.jyddata = data.data;
                  this.jyddata.unshift({coinid:'',value:'',label:'全部'})//  放入-1
                }
                break;
              case 3:
                this.$notify({title: '成功', message: '操作成功' , type: 'success' });
                this.getData();
                break;
            }
          }else{
            if(tag.take == 1)this.datatotal = 0;
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
