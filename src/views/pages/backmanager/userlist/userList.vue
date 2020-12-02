<!--用户信息-->
<template>
  <div class="dhjl">
    <div class="w_menu">
      <span class="searchTitle">UID</span>
      <el-input v-model="input"   @keyup.native="number" placeholder="请输入UID" class="inputw" clearable></el-input>
      <span class="searchTitle">用户名</span>
      <el-input v-model="username" placeholder="请输入手机号或者邮箱" class="inputs" clearable></el-input>
      <el-button type="primary" class="buttons" @click="search">搜索</el-button>
    </div>
    <div class="w_c">
      <el-table :data="tableData" style="width:100%">
        <el-table-column type="index" ></el-table-column>
        <el-table-column prop="userid" label="UID"  min-width="90"> </el-table-column>
        <el-table-column prop="username" label="用户名"  min-width="100"> </el-table-column>
        <el-table-column prop="createdtime" label="注册时间"  min-width="150">
           <template slot-scope="scope">
            <span>{{scope.row.createdtime.substring(0,scope.row.createdtime.indexOf(" "))}}</span><br>
            <span>{{scope.row.createdtime.substring(scope.row.createdtime.indexOf(" "))}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastlogintime" label="最新登录时间" min-width="150"> 
          <template slot-scope="scope">
            <span>{{scope.row.lastlogintime.substring(0,scope.row.lastlogintime.indexOf(" "))}}</span><br>
            <span>{{scope.row.lastlogintime.substring(scope.row.lastlogintime.indexOf(" "))}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="assetaccount" label="资产账户折合USDT"  min-width="150"> </el-table-column>
        <el-table-column prop="traderaccount" label="交易账户折合USDT"  min-width="150"> </el-table-column>
        <el-table-column prop="" label="操作" width="150" > 
           <template slot-scope="scope">
            <el-button  type="primary"
              size="mini"
              @click="handleCk(scope.row)">查看</el-button>
            <el-button  type="primary"
              size="mini" v-if="$store.state.qx.bcprouserup"
              @click="handleBj(scope.row)">编辑</el-button>
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
      title="编辑"
      :visible.sync="dialogVisible"
      width="510px" height="320px"
      :before-close="handleClose">
      <div class="dialogc">
        <div  class="dialogc2">
          <Label :title="'UID：'"       :value="dialogData?dialogData.userid:''" titleWidth="80px" valueWidth="150px" labelContainer = "defaultLabelC" labelTitle = "Labeltblack" labelContext = "Labelvblack" ></Label>
          <Label :title="'用户名：'"     :value="dialogData?dialogData.username:''" titleWidth="80px" valueWidth="200px" labelContainer = "defaultLabelC" labelTitle = "Labeltblack" labelContext = "Labelvblack" ></Label>
          <div style="padding:6px 0;box-sizing:border-box;text-aglin:left;">
            <span style="padding-right:23px">交易状态</span>
            <el-select size="mini" v-model="selectedV1" style="width:150px" placeholder=""  >
              <el-option
                v-for="item in vdata1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div style="padding:6px 0;box-sizing:border-box;text-aglin:left;">
            <span style="padding-right:23px">登陆状态</span>
            <el-select size="mini" v-model="selectedV3" style="width:150px" placeholder=""  >
              <el-option
                v-for="item in vdata3"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div style="padding:6px 0;box-sizing:border-box;text-aglin:left;">
            <span style="padding-right:23px">提币状态</span>
            <el-select size="mini" v-model="selectedV2" style="width:150px" placeholder=""  >
              <el-option
                v-for="item in vdata2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        
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
import {GETFO,GETUSERINFO,LOGINOK,EDITUSERSTATUS} from "@/constant";
export default {
  data() {
    return {
      input:null,
      username:'',
      datatotal:0,//总数据条数
      currentPageNum:10,//每页默认10条
      selectedV1:1,//默认允许交易
      selectedV2:1,//默认允许提币
      selectedV3:1,//默认允许登录
      currentPage:1,//当前页
      dialogVisible:false,
      dialogData:null,
      tableData: [],
      vdata1: [
        {value: 1,label: '允许交易'}, 
        {value: 0,label: '禁止交易'}
      ],
      vdata2: [
        {value: 1,label: '允许提币'}, 
        {value: 0,label: '禁止提币'}
      ],
      vdata3: [
        {value: 1,label: '允许登录'}, 
        {value: 0,label: '禁止登录'}
      ],
    }
  },
  components: { Label:Label},
  computed: {},
  mounted() {
     this.$register(this);
     this.msg = [GETFO,GETUSERINFO,LOGINOK,EDITUSERSTATUS];
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
      this.$api.getfo({
        tag:{
          dataType:GETFO,
            uid:this.input==null?'':this.input,
            username:this.username,
            pageNo: this.currentPage,
            pagesize: this.currentPageNum,
        }
      })

      this.$api.getUserInfo({
        tag:{
            dataType:GETUSERINFO,
            uid:this.input==null?'':this.input,
            username:this.username,
            pageNo: this.currentPage,
            pagesize: this.currentPageNum,
          },
       });
    },

    handleCk(v){
      this.$router.push({ 
        path:'/userlist/userInfo',
        query:v
      })
      // console.log(v)
    },

    handleBj(v){
      this.selectedV1 = v.enabletrade;
      this.selectedV2 = v.enablewithdraw;
      this.selectedV3 = v.enablelogin;
      this.dialogData = v;
      this.dialogVisible = true;
    },

    handleClose() {
      
      this.dialogVisible = false;
    },

    dialogOkClick(){
      this.$api.setUserStatus({
        tag:{
            dataType:EDITUSERSTATUS,
            uid:this.dialogData.userid,
            enablelogin:this.selectedV3,
            enablewithdraw: this.selectedV2,
            enabletrade: this.selectedV1,
          },
       });
      this.dialogVisible = false;
    },
    messages(tag,data){
      switch (tag.dataType) {
        case GETFO:
          let datas = data
          console.log('sadsad',datas)
          break;

      }
    },

    message(tag,data){
      switch(tag.dataType){
        case GETUSERINFO:
          if(data.ret === 0){
            let _data = data.data;
            this.datatotal = parseInt(_data.total);
            this.tableData = _data.list;
          }
          break;
        case EDITUSERSTATUS:
          if(data.ret === 0){
          this.$msg({ title: '成功',message:data.msg,type: 'success'});
           this.getData();
          }
          break;
        case GETFO:
            console.log(data)
          break;
      }
    },
     //只能输入正整数的验证
    number(){　　
　　　 this.input=this.input.replace(/[^\.\d]/g,'');
      this.input=this.input.replace('.','');
　　}
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
  display: flex;
  align-items:center;
  justify-content:center;
  .dialogc2{
    display: flex;
    flex-direction: column;
    align-items:flex-start;
    justify-content:center;
  }
}

.dialogstip{
  color:red;
  padding: 20px 10px;
}
</style>

