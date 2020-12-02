<!--角色分组-->
<template>
  <div class="jsfz">
    <el-button class="tjzhbtn" size="mini" type="primary"   v-if="$store.state.qx.moldeladd" @click="tjfzclick">添加分组</el-button>
    <div class="w_c">
      <el-table :data="tableData" style="width:100%">
        <el-table-column type="index" ></el-table-column>
        <el-table-column prop="modelname" label="角色分组" > </el-table-column>
        <el-table-column prop="creattime" label="创建时间">
        </el-table-column>
        <el-table-column prop="" v-if="$store.state.qx.moldeldel || $store.state.qx.managesave" label="操作" width="220px">
           <template slot-scope="scope">
            <el-button  type="primary"
              size="mini"   v-if="$store.state.qx.moldeldel" 
              @click="handlesc(scope.row)">删除</el-button>
            <el-button  type="primary"
              size="mini"   v-if="$store.state.qx.managesave" 
              @click="handlexx(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="w_page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="datatotal">
      </el-pagination>
    </div> -->
  </div>
</template>
<script>

import {GETJSFZ,SCFZ} from "@/constant";
export default {
  data() {
    return {
      input:"",
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
     this.msg = [GETJSFZ,SCFZ];
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

    getData(){
      this.$api.getjsfz({
       "tag":{
         "dataType":GETJSFZ,
         "currentPage":this.currentPage,
         "currentPageNum":this.currentPageNum
        }});
    },

    handlesc(v){
      this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.deleteFz({"tag":{"dataType":SCFZ,"id":v.model_id}});
        }).catch(() => {         
        });
    },

    handlexx(v){
      this.$router.push({ 
        path:'/permissions/jsbj',
        query:{id:v.model_id,name:v.modelname,type:"1"}
      })
    },

    tjfzclick(){
      this.$router.push({ 
        path:'/permissions/jsbj',
        query:{id:'',name:'',type:"2"}
      })
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
        case GETJSFZ:
          if(data.ret === 0){
            this.tableData = data.data.list;
            this.datatotal = data.data.total;//data.total;
          }
          break;
        case SCFZ: //删除分组
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
      }
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
    padding-right:30px;
}

.buttons{
    margin-left:30px;
}

.tjzhbtn{
  position:absolute;
  z-index: 10;
  right: 87px;
  top:10px;
  flex-shrink: 0;
  width: 80px;
  align-self: flex-end;
}

.jsfz {
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
