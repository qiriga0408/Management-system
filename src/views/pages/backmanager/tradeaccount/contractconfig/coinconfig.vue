<!--合约配置 结算币种配置-->
<template>
  <div class="lsjl">
    <div class="w_menu">
      <el-button v-if="$store.state.qx.bcprocontractcoinadd" type="primary" class="buttons" @click="addbz">添加币种</el-button>
    </div>
    <div id="wcdiv_lsjl" class="w_c">
      <el-table
        :data="tableData"
        style="width:100%"
        :cell-style="{ height: rowh + 'px' }"
      >
        <el-table-column  label="操作" min-width="180">
           <template slot-scope="scope">
              <el-button  v-if="$store.state.qx.bcprocontractcoinset" type="primary" size="small" @click="online(scope.row)">{{scope.row.btn_s}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="cantransfer_s" label="状态" min-width="100"></el-table-column>
        <el-table-column prop="currencyname" label="币种" min-width="100"></el-table-column>
        <el-table-column prop="totalbalance" label="账户资产" min-width="180"> 
          <template slot-scope="scope">
            <span>{{(scope.row.totalbalance).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="available" label="可用余额" min-width="180">
          <template slot-scope="scope">
            <span>{{(scope.row.available).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalprofit" label="账户权益" min-width="180">
          <template slot-scope="scope">
            <span>{{(scope.row.totalprofit).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tradermargin" label="仓位保证金" min-width="180"> 
          <template slot-scope="scope">
            <span>{{(scope.row.tradermargin).toFixed(6)}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="合约账户新增结算币种" :visible.sync="dialogVisible">
      <div class="dialogc">
        <div class="divliang" >
          <span class="spantitle">请选择币种</span>
          <el-select v-model="searchinput" @change="change" placeholder="请选择币种">
            <el-option
              v-for="item in bz"
              :key="item.currencyid"
              :label="item.currencyname"
              :value="item.currencyid">
            </el-option>
          </el-select>
        </div>
        <div class="divliang">
          <span  class="spantitle">单笔最小可输入量</span>
          <span class="liang">{{this.minmum}}</span>
        </div>
        <div>
          <span  class="spantitle">单笔最大可输入量</span>
          <span class="liang">{{this.maxmum}}USD</span>
        </div>
      </div>
      
       <span slot="footer" class="dialog-footer">
        <el-button @click="this.addCancle">取 消</el-button>
        <el-button type="primary" @click="this.addok">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { HYPZ_JSBZ } from "@/constant";
export default {
  data() {
    return {
      rowh: 40, //行高
      dialogVisible:false,
      searchinput:'',
      minmum:0.01,
      maxmum:10000,
      bzData:[],
      bz:[],
      loading:false,
      tableData: []
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [HYPZ_JSBZ];
    this.getData();

    //搜索币种
    this.$api.bcprocontractcoinlist({
      tag: {
        dataType: HYPZ_JSBZ,
        url:"/managers/v1/manager/bcprocoinlist",
        take:4,
        params:{}//参数
      }
    });
  },
  computed: {},
  methods: {
    addbz() {
     this.searchinput = "";
     //筛选
     this.bz = this.bzData.filter(v=>this.tableData.findIndex(vv=>vv.coinname == v.currencyname)<0);
     this.dialogVisible = true;
    },

    change(){
      this.bzData.find((v)=>{
        if(v.id == this.searchinput){
          this.minmum = 0.01;
          this.maxmum = 10000;
        }
      })
    },

    addCancle(){
      this.searchinput = "";
      this.minmum = 0.01;
      this.maxmum = 10000;
      this.dialogVisible = false;
    },

    addok(){
      if(this.searchinput === ""){
          this.$msg({type: '警告', message: '请选择币种' , type: 'warning' });
         return;
      }
      this.dialogVisible = false;
      //  3.添加结算币种
      // 地址：/managers/v1/manager/qbprocionadd
      // 传参：coinid币种id，coinname结算币种名字 ,minmum最小转入，maxmum最大转入
      // 返回：{"ret": 0,"msg": ""}
      // console.log(this.searchinput,this.bzData)
      let coin = this.bzData && this.bzData.find(v => v.currencyid == this.searchinput);
      let coinname = coin.currencyname || '';
      let precision = coin.precision || 6;
      this.$api.bcprocontractcoinlist({
        tag: {
          dataType: HYPZ_JSBZ,
          url:"/managers/v1/manager/bcprocontractcoinadd",
          take:3,//添加结算币种
          params:{
            currencyid:this.searchinput,
            coinname:coinname,
            mintransfer:this.minmum,
            maxtransfer:this.maxmum,
            precision:precision
          }//参数
        }
      });
    },

    online(v){
      this.$confirm('请确认是否'+v.btn_s+'合约账户 '+v.currencyname+' 币种', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      .then(() => {
        this.$api.bcprocontractcoinlist({
        tag: {
          dataType: HYPZ_JSBZ,
          url:"/managers/v1/manager/bcprocontractcoinset",
          take:2,
          params:{
            coinid:v.currencyid,
            status:v.status == 0?1:0
          }
        }
      });
      })
      .catch(action => {
        
      }); 
    },
    getData() {
      //       1.合约币种列表
      //  地址：/managers/v1/manager/qbprocoinlist
      //  传参：{}
      //  返回：{"ret": 0,"msg": "","data":{"list": [{}],"total": 1}}
      //  字段解释： status 状态，coinname币种 ，accassets账户资产，availbalance可用余额，bondbalance 保证金余额，warehousebond 仓位保证金，dealbond未成交保证金
      this.tableData = [];
      this.$api.bcprocontractcoinlist({
        tag: {
          dataType: HYPZ_JSBZ,
          url:"/managers/v1/manager/bcprocontractcoinlist",
          take:1,
          params:{}//参数
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case HYPZ_JSBZ:
          if(data.ret === 0){
            switch(tag.take){
              case 1://列表获取
               if (data.data) {
                  data.data.map(v=>{
                    if(v.status === 0){
                      v['btn_s'] = "上架";
                    }else{
                      v['btn_s'] = "下架";
                    }
                    if(v.cantransfer === 0){
                      v['cantransfer_s'] = "禁止划转";
                    }else{
                      v['cantransfer_s'] = "正常";
                    }
                  })
                  this.tableData = data.data;
               }
              break;
              case 2://上下架合约
               this.$notify({title: '成功', message: '操作成功' , type: 'success' });
               this.getData();
              break;
              case 3://添加合约币种
               this.$notify({title: '成功', message: '操作成功' , type: 'success' });
               this.getData();
              break;
              case 4://币种
               if (data.data) {
                  this.bzData = data.data;
                  // for(let i = 0;i<this.bzData.length;i++){
                  //   this.bzData[i].currencyname = this.bzData[i].currencyname.toUpperCase();
                  // }
               }
              break;
            }
          }
          break;
      }
    }
  },

  beforeDestroy() {
    this.$unRegister(this);
  }
};
</script>

<style lang="less" scoped>
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
    justify-content: flex-end;
  }
}

.dialogc {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  .spantitle{
    display:inline-block;
    width: 150px;
    text-align: right;
    padding-right: 20px;
  }
  
  .dialoginput{
    margin-bottom: 10px;
    width: 156px;
  }
  .divliang{
    margin-bottom: 30px;
    //border: 1px solid #ff8866;
  }
  .liang{
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
