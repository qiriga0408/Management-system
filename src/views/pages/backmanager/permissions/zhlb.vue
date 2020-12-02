<!--账号列表-->
<template>
  <div class="zhlb">
    <el-button class="tjzhbtn" size="mini" type="primary"  v-if="$store.state.qx.manageadd" @click="tjzhclick">添加账号</el-button>
    <div class="w_c">
      <el-table :data="tableData" style="width:100%">
        <el-table-column type="index" ></el-table-column>
        <el-table-column prop="name" label="用户名" > </el-table-column>
        <el-table-column prop="model_name" label="角色分组" > </el-table-column>
        <el-table-column prop="reg_time" label="创建时间"> 
          <!-- <template  slot-scope="scope">
            <span>{{toDaye(scope.row.reg_time)}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="" v-if="$store.state.qx.managedel || $store.state.qx.managesave || $store.state.qx.managesave1 || $store.state.qx.managesave2" label="操作" :width="getw">
           <template slot-scope="scope">
            <el-button  type="primary"
              size="mini"  v-if="$store.state.qx.managedel" 
              @click="handlesc(scope.row)">删除</el-button>
            <el-button  type="primary"
              size="mini"  v-if="$store.state.qx.managesave3" 
              @click="handlexx(scope.row)">修改</el-button>
             <el-button  type="primary"
              size="mini"  v-if="$store.state.qx.managesave1" 
              @click="handlezhmm(scope.row)">重置账号密码</el-button>
               <el-button  type="primary"
              size="mini"  v-if="$store.state.qx.managesave2" 
              @click="handleggmm(scope.row)">重置谷歌密码</el-button> 
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

    <el-dialog
      :title="dialogVisibleType === 2?'添加账号':'修改分组'"
      :visible.sync="dialogVisible"
      :close-on-click-modal = "false"
      @close = "closeclick"
      width="30%"
      :before-close="handleClose">
       <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
         <div class="dialogc">
          <div class="zhdiv">
          <el-form-item label="账号" prop="zhname" label-width="45px" v-if="this.dialogVisibleType === 2">
           <el-input class="nameinput"  v-model="ruleForm.zhname" placeholder="只支持英文和数字"  clearable></el-input>
          </el-form-item>
          <el-form-item  label="账号" v-if="this.dialogVisibleType == 1" label-width="45px">
            <span class="spanblock nameinput"  >{{dialogData?dialogData.name:""}}</span>
          </el-form-item>
          <el-form-item  label="分组" prop="selectedv" label-width="45px">
            <el-select v-model="ruleForm.selectedv" placeholder="请选择"  class="nameinput">
                <el-option
                  v-for="item in options"
                  :key="item.model_id"
                  :label="item.modelname"
                  :value="item.model_id">
                </el-option>
              </el-select>
          </el-form-item>
          </div>
      </div>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="dialogOkClick">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import {GETZHLB,CZZHMM,CZGGMM,SCZHJL,TJZH,XGFZ,GETJSFZ} from "@/constant";
export default {
  data() {
    let validatename = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      }else if (!/^[0-9a-zA-Z]+$/.test(value)) {
        callback(new Error("只能输入英文和数字"));
      }else if (!/^\w{4,16}$/.test(value)) {
        callback(new Error("长度必须在4~16位"));
      } else {
        callback();
      }

      
    };
    let validatefz = (rule, value, callback) => {
      if (value === "" || value == null) {
        callback(new Error("请选择分组"));
      } else {
        callback();
      }
    };

    return {
      dialogVisible:false,
      dialogVisibleType:1,
      dialogData:null,
      datatotal:0,//总数据条数
      currentPageNum:10,//每页默认10条
      currentPage:1,//当前页
      options:[],
      tableData: [],
      ruleForm: {
        zhname:"",
        selectedv:'',
      },
       rules: {
        selectedv: [{ validator: validatefz, trigger: "change" }],
        zhname: [{ validator: validatename, trigger: "blur" }]
      }
      }
  },
  components: {
   
  },
  mounted() {
     this.$register(this);
     this.msg = [GETZHLB,CZZHMM,CZGGMM,SCZHJL,TJZH,XGFZ,GETJSFZ];
     this.getData();
     this.$api.getjsfz({
       "tag":{
          "dataType":GETJSFZ
        }
    });
  },
  computed: {
    getw(){
      let w = 80;
      if(this.$store.state.qx.managedel){
        w+=50;
      }
       if(this.$store.state.qx.managesave){
        w+=50;
      }
       if(this.$store.state.qx.managesave1){
        w+=100;
      }
       if(this.$store.state.qx.managesave2){
        w+=100;
      }
      return w;
    }
  },
  methods: {

    closeclick(){
       this.$refs["ruleForm"].resetFields();
    },
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
      this.$api.getzhlb({
       "tag":{
         "dataType":GETZHLB,
         "pageNo":this.currentPage,
         "pagesize":this.currentPageNum
        }});
    },

    handlesc(v){
      this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.deleteZh({"tag":{"dataType":SCZHJL,"id":v.id}});
        }).catch(() => {         
        });
    },

    //修改分组
    handlexx(v){
      this.ruleForm.zhname = v.name;
      this.ruleForm.selectedv = v.model_id;
      this.dialogData = v;
      this.dialogVisible = true;
      this.dialogVisibleType = 1;
    },

    //添加账号
    tjzhclick(){
      this.ruleForm.zhname = null;
      this.ruleForm.selectedv = null;
      this.dialogVisible = true;
      this.dialogVisibleType = 2;
    },

    handleClose(){
      this.dialogVisible = false;
      this.closeclick();
    },

    dialogOkClick(){

       this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if(this.dialogVisibleType === 1){
            //修改分组
             this.$confirm('确认修改吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
            this.$api.udpateZhanghaoFz({"tag":{"dataType":XGFZ,'id':this.dialogData.id,"lever":this.ruleForm.selectedv,"vpass1":"123abc","vpass2":"123abc"}});
            }).catch(() => {         
            });

            
          }else{
            //添加账号
            this.$confirm('确认添加吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
            this.$api.addZhanghao({"tag":{"dataType":TJZH,"lever":this.ruleForm.selectedv,"relname":this.ruleForm.zhname,"vpass1":"123abc","vpass2":"123abc"}});
            }).catch(() => {         
            });
            
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });



      
    },


    //重置账号密码
    handlezhmm(v){
       this.$confirm('确认重置账号密码吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.resetAccountPwd({"tag":{"dataType":CZZHMM,"id":v.id,"vpass1":"123abc","vpass2":"123abc"}});
        }).catch(() => {         
        });
    },

    //重置谷歌密码
    handleggmm(v){
       this.$confirm('确认重置谷歌密码吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.resetGooglePwd({"tag":{"dataType":CZGGMM,"id":v.id}});
        }).catch(() => {         
        });
    },

    toDaye(v){
      let t = new Date(v*1000);
      let y = t.getFullYear();
      let m = t.getMonth()+1;
      let d = t.getDate();
      let h = t.getHours();
      let s = t.getMinutes();
      let c = t.getSeconds();
      let tt = y+"-"+(m<10?'0'+m:m)+"-"+(d<10?'0'+d:d)+' '+(h<10?'0'+h:h)+":"+(s<10?'0'+s:s)+":"+(c<10?'0'+c:c);
      return tt;
    },

    message(tag,data){
      switch(tag.dataType){
        case GETZHLB:
          if(data.ret === 0){
            this.tableData = data.data.list;
            this.datatotal = Number(data.data.total);
          }
          break;
        case GETJSFZ:
          if(data.ret === 0){
            this.options = data.data.list;
          }
          break;
        case CZZHMM:
          if(data.ret === 0)
            this.$msg({ title: '成功',message:data.msg,type: 'success'});
          break;
        case CZGGMM:
         if(data.ret === 0)
            this.$msg({ title: '成功',message:data.msg,type: 'success'});
          break;
        case SCZHJL:
           if(data.ret === 0){
            this.$msg({ title: '成功',message:data.msg,type: 'success'});
            if(this.tableData.length-1 === 0){
              //删除后已经不再有数据 页数减1
              this.currentPage -= 1;
              this.currentPage = this.currentPage<1?1:this.currentPage;
            }
            this.getData();
           }
           
          break;
        case TJZH:
          if(data.ret === 0){
            this.dialogVisible = false;
            this.$msg({ title: '成功',message:data.msg,type: 'success'});
            this.getData();
          }
          break;
        case XGFZ:
          if(data.ret === 0){
             this.dialogVisible = false;
             this.$msg({ title: '成功',message:data.msg,type: 'success'});
             this.getData();
          }
          break;
      }
    },

    onChange(){
      this.zhname=this.zhname.replace(/[\W]/g,'')
    }
  },

  beforeDestroy(){
    this.$unRegister(this);
  }
};
</script>

<style lang="less" scoped>
.spanblock{
  display:inline-block;
  text-align: left;
}
.nameinput{
    width:200px;
}
.zhdiv{
  padding: 10px 10px;
}
.buttons{
    margin-left:30px;
}

.tjzhbtn{
  position:absolute;
  z-index: 10;
  right: 20px;
  top:10px;
  flex-shrink: 0;
  // width: 105px;
  align-self: flex-end;
}
.zhlb {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  .w_menu{
    width:100%;
    flex-shrink:0;
    box-sizing: border-box;
    display: flex;
    align-items:center;
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
