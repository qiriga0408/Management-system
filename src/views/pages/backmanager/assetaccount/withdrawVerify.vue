<!--提现审核-->
<template>
  <div class="withdraw">
    <div class="w_menu">
      <span class="searchTitle">UID</span>
      <el-input
        v-model="input"
        @keyup.native="number"
        placeholder="请输入UID"
        class="inputw"
        clearable
      ></el-input>

      <span class="searchTitle">状态</span>
      <el-select v-model="selectedv" placeholder="请选择" class="inputs">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

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
    <!-- {"id":"1","user_id":"180","account":"''","amount":"20.00000000","remark":"","state":"0","fee":"5.20000000","coin_id":"100","coin_name":"qb","to_addr":"test001","create_at":"2019-08-09 17:33:14","audit_at":"2019-08-09 17:33:14"} -->
    <div class="w_c">
      <el-table :data="tableData" style="width:100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="createdtime" label="发起时间" min-width="92">
          <template slot-scope="scope">
            <span>{{scope.row.createdtime.substring(0,scope.row.createdtime.indexOf(" "))}}</span>
            <br />
            <span>{{scope.row.createdtime.substring(scope.row.createdtime.indexOf(" "))}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="billid_s" label="订单编号" min-width="185"></el-table-column>
        <el-table-column prop="userid" label="UID" min-width="85"></el-table-column>
        <el-table-column prop="currencyname" label="币种" min-width="85"></el-table-column>
        <el-table-column prop="amount" label="提现数量" min-width="130"></el-table-column>
        <el-table-column prop="toaddr" label="转出地址" min-width="195"></el-table-column>
        <el-table-column prop label="状态">
          <template slot-scope="scope">
            <span>{{getStatus(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approvedtime" label="处理时间" min-width="95">
          <template slot-scope="scope">
            <span>{{scope.row.approvedtime.substring(0,scope.row.approvedtime.indexOf(" "))}}</span>
            <br />
            <span>{{scope.row.approvedtime.substring(scope.row.approvedtime.indexOf(" "))}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" :width="getw">
          <template slot-scope="scope">
            <div style="display:flex">
              <el-button
              type="primary"
              size="mini"
              @click="handletg(scope.row)"
              v-if="scope.row.status == 1 && $store.state.qx.bcprousercashaudit1"
            >通过</el-button>
            <el-button type="primary" size="mini" @click="handleck(scope.row)">查看</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="handlejj(scope.row)"
              v-if="scope.row.status == 1 && $store.state.qx.bcprousercashaudit2"
            >拒绝</el-button>
            </div>
            
          </template>
        </el-table-column>
         <el-table-column prop="operator" label="操作人" >
           <template slot-scope="scope">
            <span>{{getCzr(scope.row)}}</span>
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
        :total="datatotal"
      ></el-pagination>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="560px"
      height="320px"
      :before-close="handleClose"
    >
      <div class="dialogc">
        <Label
          :title="'UID：'"
          :value="dialogData.userid"
          titleWidth="90px"
          valueWidth="400px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <Label
          :title="'币种：'"
          :value="dialogData.currencyname"
          titleWidth="90px"
          valueWidth="400px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <!-- <Label :title="'手机号：'"     :value="dialogData.phone" titleWidth="90px" valueWidth="400px" labelContainer = "defaultLabelC" labelTitle = "Labeltblack" labelContext = "Labelvblack" ></Label> -->
        <Label
          :title="'申请数量：'"
          :value="dialogData.amount"
          titleWidth="90px"
          valueWidth="400px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <Label
          :title="'到账数量：'"
          :value="`${Subtr(Number(dialogData.amount),Number(dialogData.commission))}`"
          titleWidth="90px"
          valueWidth="400px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <Label
          :title="'手续费：'"
          :value="dialogData.commission"
          titleWidth="90px"
          valueWidth="400px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <Label
          :title="'转出地址：'"
          :value="dialogData.toaddr"
          titleWidth="90px"
          valueWidth="400px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <!-- A6368A6368A6368A6368A6368A6368A6368A6368A6368 -->
        <Label
          :title="'申请时间：'"
          :value="dialogData.createdtime"
          titleWidth="90px"
          valueWidth="400px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>

        <Label
          :title="'处理时间：'"
          :value="dialogData.approvedtime"
          v-if="dialogData.status !== 1"
          titleWidth="90px"
          valueWidth="400px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <Label
          :title="'状态：'"
          :value="getStatus(dialogData)"
          v-if="dialogData.status !== 1"
          titleWidth="90px"
          valueWidth="400px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>

        <span class="dialogstip" v-if="dialogData.status == 1 && dialogType != 2">确认信息无误后请谨慎操作</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false" v-if="dialogType != 0">取 消</el-button>
        <el-button size="mini" type="primary" @click="dialogOkClick">{{dialogOkBtn}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Label from "@/components/label";
import { GETWITHDRAW, TGWITHDRAW, JJWITHDRAW } from "@/constant";
import { type } from 'os';
var Long = require("long");
export default {
  data() {
    return {
      input: "",
      time: [],
      selectedv: null,
      datatotal: 0, //总数据条数
      currentPageNum: 10, //每页默认10条
      currentPage: 1, //当前页
      dialogVisible: false,
      dialogType: 1, // 1通过 2查看 3拒绝
      dialogOkBtn: "确认通过",
      dialogData: {},
      dialogTitle:"查看",

      options: [
        { value: 1, label: "提现申请" },
        // { value: 2, label: "已到账" },
        { value: 3, label: "提现通过" },
        { value: 4, label: "提现拒绝" },
        { value: 0, label: "全部状态" }
      ],

      tableData: []
    };
  },
  components: {
    Label: Label
  },
  mounted() {
    this.$register(this);
    this.msg = [GETWITHDRAW, TGWITHDRAW, JJWITHDRAW];
    this.time.push(this.getYesDay());
    this.time.push(this.getNowDate());
    this.getData();
  },
  computed: {
    getw(){
      let isSq = false;
      if(this.tableData){
        for(let i = 0,il = this.tableData.length;i<il;i++){
          if(this.tableData[i].status == 1){
            isSq = true;
            break;
          }
        }
      }
      
      let w = 100;
      if(isSq && this.$store.state.qx.bcprousercashaudit1){
        w+=49;
      }
       if(isSq && this.$store.state.qx.bcprousercashaudit2){
        w+=49;
      }
      return w;
    }
  },
  methods: {
    // 减法函数-针对精度
    Subtr(arg1, arg2) {
      var r1, r2, m, n;
      try {
        r1 = arg1.toString().split(".")[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split(".")[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      n = r1 >= r2 ? r1 : r2;
      return ((arg1 * m - arg2 * m) / m).toFixed(n);
    },

    getStatus(row) {
      if(this.options){
        for (let i = 0, il = this.options.length; i < il; i++) {
          if (row.status == this.options[i].value) {
            return this.options[i].label;
          }else if(row.status === 2){
            return '已到账';
          }
        }
      }
      
      return "无";
    },

    getCzr(row){
      if(row.status == 1){
        return "暂无"
      }else{
        return row.approver?row.approver:"【系统自动】";
      }
    },

    search() {
      this.currentPage = 1;
      this.getData();
    },

    handletg(v) {
      this.dialogData = v;
      this.dialogType = 1;
      this.dialogTitle = "通过";
      this.dialogVisible = true;
      this.dialogOkBtn = "确认通过";
    },

    handleck(v) {
      this.dialogData = v;
      this.dialogType = 2;
      this.dialogTitle = "查看";
      this.dialogVisible = true;
      this.dialogOkBtn = "关闭";
    },

    handlejj(v) {
      this.dialogData = v;
      this.dialogType = 3;
      this.dialogTitle = "拒绝";
      this.dialogVisible = true;
      this.dialogOkBtn = "确认拒绝";
    },

    handleClose() {
      this.dialogVisible = false;
    },

    dialogOkClick() {
      this.dialogVisible = false;
      if (this.dialogType === 1) {
        //通过请求
        this.$api.tgWithdraw({
          tag: {
            dataType: TGWITHDRAW,
            uid: this.dialogData.userid,
            billid: this.dialogData.billid_s
          }
        });
        // console.log(JSON.parse(this.dialogData.billid_s))
        // console.log(this.dialogData.billid.toNumber(),this.dialogData.billid);
      } else if (this.dialogType === 3) {
        //拒绝请求
        this.$api.jjWithdraw({
          tag: {
            dataType: JJWITHDRAW,
            uid: this.dialogData.userid,
            billid: this.dialogData.billid_s
          }
        });
      } else {
        //查看无操作
      }
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
      this.$api.getAssetFinaceRecords({
        tag: {
          dataType: GETWITHDRAW,
          url:"/managers/v1/manager/bcprouserwalletbill",
          params:{
            uid: this.input,
            status: this.selectedv,
            star: starttime,
            end: stoptime,
            pageNo: this.currentPage,
            coinid:-1,
            pagesize: this.currentPageNum,
            ttype:2,
          }
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case GETWITHDRAW:
          if (data.ret === 0) {
            let _data = data.data;
            this.tableData = _data.list && _data.list.map(v=>{
              // console.log(Long.fromNumber(v.billid),Long.isLong(Long.fromNumber(v.billid)))
              // v.billid = Long.fromNumber(v.billid);
              v.billid_s = v.billid.toString();
              return v;
            }) || [];
            this.datatotal = Number(data.data.total);
          }
          break;
        case TGWITHDRAW:
          if(data.ret == 0){
            this.$msg({type:'success',message:'已确认通过',title:'成功'})
            this.getData();
          }
          break;
        case JJWITHDRAW:
          if(data.ret == 0){
            this.$msg({type:'success',message:'已确认拒绝',title:'成功'})
            this.getData();
          }
          break;
      }
    },
    //只能输入正整数的验证
    number() {
      this.input = this.input.replace(/[^\.\d]/g, "");
      this.input = this.input.replace(".", "");
    }
  },

  beforeDestroy() {
    this.$unRegister(this);
  }
};
</script>

<style lang="less" scoped>
.inputw {
  width: 150px;
  padding-right: 30px;
}

.inputs {
  padding-right: 30px;
}

.buttons {
  margin-left: 30px;
}

.withdraw {
  width: 100%;
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
    flex-grow: 1;
    box-sizing: border-box;
    display: flex;
    align-items: center;
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

  /deep/.el-dialog {
    width: 510px;
    .el-dialog__header {
      padding: 19px;
      border-bottom: 1px solid #e4e5e8;
      text-align: left;
    }
    .el-dialog__body {
      width: 80%;
      margin: 0 auto;
    }
    .el-dialog__footer {
      padding: 10px;
      border-top: 1px solid #e4e5e8;
    }
    .input_div {
      position: absolute;
      left: 0;
      top: 0;
    }
    .el-input__inner {
      outline: none;
      text-shadow: 0 0 0 transparent;
    }
    .banner-box {
      text-align: center;
    }
  }
}

.dialogc {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dialogstip {
  color: red;
  font-size: 12px;
  width: 490px;
  text-align: left;
  padding: 20px 0px;
}
</style>
