<!-- 交易员审核 -->
<template>
  <div class="dhjl">
    <div class="w_menu">
      <span class="searchTitle">UID</span>
      <el-input v-model="input" @keyup.native="number" placeholder="请输入UID" class="inputw" clearable></el-input>
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
      <el-table :data="tableData" style="width:100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="user_id" label="UID"  min-width="90"> </el-table-column>
        <el-table-column prop="phone" label="手机号"  min-width="120"> </el-table-column>
        <el-table-column prop="nickname" label="昵称"  min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.nickname || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="introduce" label="个人说明"  min-width="200">
          <template slot-scope="scope">
            <span class="multi_line">{{scope.row.introduce || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nickname_en" label="英文昵称"  min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.nickname_en || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="introduce_en" label="英文说明"  min-width="200">
          <template slot-scope="scope">
            <span>{{scope.row.introduce_en || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="is_status" label="状态"  min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.is_status == 1 ? '已审核' : '未审核'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="入驻时间"  min-width="130">
           <template slot-scope="scope">
            <span>{{scope.row.create_time.substring(0,scope.row.create_time.indexOf(" "))}}</span><br>
            <span>{{scope.row.create_time.substring(scope.row.create_time.indexOf(" "))}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="audit_time" label="审核时间" min-width="130"> 
          <template slot-scope="scope">
            <span>{{scope.row.audit_time.substring(0,scope.row.audit_time.indexOf(" "))}}</span><br>
            <span>{{scope.row.audit_time.substring(scope.row.audit_time.indexOf(" "))}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="$store.state.qx.tradersReviewSet" prop="" fixed="right" label="操作" width="180" > 
           <template slot-scope="scope">
            <el-button  type="primary"
              size="mini"
              @click="handleAgreeOrReject(scope.row,1)">审核</el-button>
            <el-button  type="primary"
              size="mini" 
              @click="handleAgreeOrReject(scope.row,2)">驳回</el-button>
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
        layout="total, sizes, prev, pager, next,jumper"
        :total="datatotal">
      </el-pagination>
    </div>


     <el-dialog
      title="交易员信息详情"
      :visible.sync="dialogVisible"
      width="510px" height="320px"
      :before-close="handleClose">
      <div class="dialogc">
        <el-row :gutter="2">
          <el-col :span="4"><div class="dialogc_key">UID</div></el-col>
          <el-col :span="20"><div class="dialogc_val">{{dialogData.user_id}}</div></el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="4"><div class="dialogc_key">手机号</div></el-col>
          <el-col :span="20"><div class="dialogc_val">{{dialogData.phone}}</div></el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="4"><div class="dialogc_key">昵称</div></el-col>
          <el-col :span="20"><div class="dialogc_val">{{dialogData.nickname || '--'}}</div></el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="4"><div class="dialogc_key">个人说明</div></el-col>
          <el-col :span="20"><div class="dialogc_val">{{dialogData.introduce || '--'}}</div></el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="4"><div class="dialogc_key">英文昵称</div></el-col>
          <el-col :span="20"><div class="dialogc_val">{{dialogData.nickname_en || '--'}}</div></el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="4"><div class="dialogc_key">英文说明</div></el-col>
          <el-col :span="20"><div class="dialogc_val">{{dialogData.introduce_en || '--'}}</div></el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12"><div class="dialogc_key">累计交易:&nbsp;&nbsp;{{dialogData.total_count}}</div></el-col>
          <el-col :span="12"><div class="dialogc_val">累计分润:&nbsp;&nbsp;{{dialogData.total_amount}}</div></el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="4"><div class="dialogc_key">入住时间</div></el-col>
          <el-col :span="20"><div class="dialogc_val">{{dialogData.create_time}}</div></el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="4"><div class="dialogc_key">审核人</div></el-col>
          <el-col :span="20"><div class="dialogc_val">{{dialogData.manage || '--'}}</div></el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="4"><div class="dialogc_key">审核时间</div></el-col>
          <el-col :span="20"><div class="dialogc_val">{{dialogData.audit_time}}</div></el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="dialogOkClick">确定</el-button>
      </span>
    </el-dialog>

  </div>
  
</template>


<script>
import axios from "axios";
import Service from "@/http.js";
import Label from "@/components/label";
import {GET_TRADERSLIST,LOGINOK,SET_TRADERSSTATE} from "@/constant";
export default {
  data() {
    return {
      input:null,
      time: [],
      username:'',
      datatotal:0,//总数据条数
      currentPageNum:10,//每页默认10条
      currentPage:1,//当前页
      dialogVisible:false,
      dialogData:{
        "user_id": "--", // 用户id
        "phone": "--", // 手机号
        "nickname": "--", //中文昵称
        "introduce": "--", // 中文介绍
        "nickname_en": "--", // 英文昵称
        "introduce_en": "--", // 英文介绍
        "total_count": '--', //累计交易次数
        "total_amount": '--', // 累计分润
        "audit_time": "--", // 审核时间
        "is_status":1, //-1注销，0停用 1正常，2待审核
        "create_time": "--", // 入住时间
        "manage": "--" // 审核员
      },
      tableData: [],
    }
  },
  components: { Label:Label},
  computed: {},
  mounted() {
    this.$register(this);
    this.msg = [GET_TRADERSLIST,LOGINOK,SET_TRADERSSTATE];
     
    this.time.push(this.getYesDay());
    this.time.push(this.getNowDate());
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
      this.$api.getTradersReview({
        tag:{
            dataType: GET_TRADERSLIST,
            uid:this.input==null?'':this.input,
            star: starttime,
            end: stoptime,
            pageNo: this.currentPage,
            pagesize: this.currentPageNum,
          },
       });
    },

    // 审核/驳回
    handleAgreeOrReject(v,type){
      this.$api.setTradersReview({
        tag:{
            dataType: SET_TRADERSSTATE,
            user_id: Number(v.user_id),
            checkid: Number(v.checkid),
            stype: type,// 1通过 2拒绝
          },
       });
    },
    
  
    handleClose() {
      this.dialogVisible = false;
    },

    dialogOkClick(){
      this.dialogVisible = false;
    },

    message(tag,data){
      switch(tag.dataType){
        case GET_TRADERSLIST:
          if(data.ret === 0){
            let _data = data.data;
            this.datatotal = parseInt(_data.total);
            this.tableData = _data.list;
          }
          break;
        case SET_TRADERSSTATE:
          if(data.ret === 0){
            this.$msg({ title: '成功',message:data.msg,type: 'success'});
            this.getData();
          }
          break;
        case LOGINOK:
          
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
  /deep/.el-dialog {
    .el-dialog__header {
      text-align: left;
      padding: 19px;
      border-bottom: 1px solid #E4E5E8;
    }
    .el-dialog__body {
      width: 80%;
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
  .el-row {
    text-align: left;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .dialogc_key {
  }
}

.dialogstip{
  color:red;
  padding: 20px 10px;
}
</style>

