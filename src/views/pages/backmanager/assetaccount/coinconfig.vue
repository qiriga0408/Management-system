<!--合约配置 结算币种配置-->
<template>
  <div class="lsjl">
    <div class="w_menu">
      <!-- <el-button v-if="$store.state.qx.bcprocontractcoinadd" type="primary" class="buttons" @click="addbz">添加币种</el-button> -->
    </div>
    <div id="wcdiv_lsjl" class="w_c">
      <el-table
        :data="tableData"
        style="width:100%"
        :cell-style="{ height: rowh + 'px' }"
      >
        <el-table-column  label="操作" min-width="180">
           <template slot-scope="scope">
              <el-button  v-if="$store.state.qx.bcprocionsetup" type="primary" size="small" @click="online(scope.row)">{{scope.row.btn_s}}</el-button>
              <el-button  v-if="$store.state.qx.bcprocionupdate" type="primary" size="small" @click="editCoinInfo(scope.row)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="cantransfer_s" label="状态" min-width="100"></el-table-column>
        <el-table-column prop="currencyname" label="币种" min-width="100">
        </el-table-column>
        <el-table-column prop="totalasset" label="总资产" min-width="180">
          <template slot-scope="scope">
            <span>{{Number(scope.row.totalasset).toFixed(scope.row.precision)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalbalance" label="总可用" min-width="180">
          <template slot-scope="scope">
            <span>{{Number(scope.row.totalbalance).toFixed(scope.row.precision)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totallock" label="总冻结" min-width="180">
          <template slot-scope="scope">
            <span>{{Number(scope.row.totallock).toFixed(scope.row.precision)}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="资产账户修改币种" @close="onEditDialogClose" :visible.sync="editDialogVisible">
      <div class="dialogc">
        <div class="divliang">
          <span  class="spantitle">币种名称</span>
          <span class="liang">{{editDialogData.currencyname}}</span>
          <span class="liangtip">资产划转单笔最小数量为{{editDialogData.mintransfer}}</span>
        </div>
        <div class="divliang">
          <span  class="spantitle">币种代码</span>
          <span class="liang">{{editDialogData.currencyid}}</span>
          <span class="liangtip">资产划转单笔最大数量为{{editDialogData.maxtransfer}}</span>
        </div>
      </div>
      <el-form :rules="rules" ref="ruleFormmr" :model="ruleForm">
        <div class="divliang">
          <el-form-item  label="单笔最小提币"  label-width="130px"  prop="minwithdraw">
            <el-input  class="w156" :placeholder="'只可以输入正数且精度为'+editDialogData.precision+'位'" v-model="ruleForm.minwithdraw" clearable></el-input>
          </el-form-item>
        </div>
        <div class="divliang">
          <el-form-item  label="单笔最大提币"  label-width="130px"  prop="maxwithdraw">
            <el-input  class="w156" :placeholder="'只可以输入正数且精度为'+editDialogData.precision+'位'" v-model="ruleForm.maxwithdraw" clearable></el-input>
          </el-form-item>
        </div>
        <div class="divliang">
          <el-form-item  label="单笔提币手续费"  label-width="130px"  prop="minerfee">
            <el-input  class="w156" :placeholder="'只可以输入正数且精度为'+editDialogData.precision+'位'" v-model="ruleForm.minerfee" clearable></el-input>
          </el-form-item>
        </div>
        <div class="divliang">
          <el-form-item  label="当日提币次数"  label-width="130px"  prop="withdrawtime">
            <el-input  class="w156" placeholder="只可以输入非负整数" v-model="ruleForm.withdrawtime" clearable></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="this.editCancle">取 消</el-button>
        <el-button type="primary" @click="this.editOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { HYPZ_JSBZ } from "@/constant";
export default {
  data() {
    //最大最小提币和手续费
    let validate_min = (rule, value, callback) => {
      let reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      let reg1 = new RegExp(`^[0-9]{0,${this.precision}}$`);
      let arr = String(value).split('.');
      if(!value || !reg.test(value)){
        return callback(new Error("只能输入正数"));
      }if(arr.length === 2 && !reg1.test(arr[1])){
        return callback(new Error("精度最大"+this.precision+"位"));
      }else {
        callback();
      }
    }
    let validate_max = (rule, value, callback) => {
      let reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      let reg1 = new RegExp(`^[0-9]{0,${this.precision}}$`);
      let arr = String(value).split('.');
      if(!value || !reg.test(value)){
        return callback(new Error("只能输入正数"));
      }if(arr.length === 2 && !reg1.test(arr[1])){
        return callback(new Error("精度最大"+this.precision+"位"));
      }else if(Number(value) <= Number(this.ruleForm.minwithdraw)){
        return callback(new Error("最大提币 需要  大于 最小提币"));
      }else {
        callback();
      }
    }
    let validate_fee = (rule, value, callback) => {
      let reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      let reg1 = new RegExp(`^[0-9]{0,${this.precision}}$`);
      let arr = String(value).split('.');
      if(!value || !reg.test(value)){
        return callback(new Error("只能输入正数"));
      }if(arr.length === 2 && !reg1.test(arr[1])){
        return callback(new Error("精度最大"+this.precision+"位"));
      }else if(Number(value) >= Number(this.ruleForm.minwithdraw)){
        return callback(new Error("提币手续费需要 小于 单笔最小提币数"));
      }else {
        callback();
      }
    }
    //提币次数
    let validate_review = (rule, value, callback) => {
      let reg = /^[1-9][0-9]*|0$/;
      if (!reg.test(value)) {
        return callback(new Error("只能输入非负整数"));
      }else {
        callback();
      }
    };
    return {
      rowh: 40, //行高
      dialogVisible:false,
      editDialogVisible:false,
      editDialogData:{},
      precision:6,
      mintransfer:0,
      maxtransfer:0,
      minwithdraw:0,
      maxwithdraw:0,
      minerfee:0,
      withdrawtime:0,
      bzData:[],
      bz:[],
      loading:false,
      tableData: [],
      ruleForm: {
        minwithdraw:0,
        maxwithdraw: 0,
        minerfee: 0,
        withdrawtime: 0,
      },
      rules: {
        minwithdraw: [{ validator: validate_min, trigger: "blur" }],
        maxwithdraw: [{ validator: validate_max, trigger: "blur" }],
        minerfee: [{ validator: validate_fee, trigger: "blur" }],
        withdrawtime: [{ validator: validate_review, trigger: "blur" }],
      }
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [HYPZ_JSBZ];
    this.getData();
  },
  computed: {},
  methods: {
    editCoinInfo(coin){
      this.ruleForm.minerfee = coin.minerfee;
      this.ruleForm.minwithdraw = coin.minwithdraw;
      this.ruleForm.maxwithdraw = coin.maxwithdraw;
      this.ruleForm.withdrawtime = coin.withdrawtime;
      this.precision = coin.precision;
      this.editDialogVisible = true;
      this.editDialogData = coin;
    },
    editOk(){
      this.$refs["ruleFormmr"].validate(valid => {
        if (valid) {
          this.$api.assetCoinEdit({
            tag: {
              dataType: HYPZ_JSBZ,
              params:{
                coinid:this.editDialogData.currencyid,
                minwithdraw:Number(this.ruleForm.minwithdraw),
                maxwithdraw:Number(this.ruleForm.maxwithdraw),
                withdrawtime:Number(this.ruleForm.withdrawtime),
                minerfee:Number(this.ruleForm.minerfee),
              },
              take:3
            }
          });
          if (this.$refs.ruleFormmr) {
            // this.ruleForm = {}
            this.$refs.ruleFormmr.resetFields();
          };
          this.editDialogVisible = false;
          this.editDialogData = {};
        }
      });
      
    },
    onEditDialogClose(){
      // console.log('onDialogClose');
      if (this.$refs.ruleFormmr) {
        // this.ruleForm = {}
        this.$refs.ruleFormmr.resetFields();
      };
      this.editDialogData = {};
    },
    editCancle(){
      if (this.$refs.ruleFormmr) {
        // this.ruleForm = {}
        this.$refs.ruleFormmr.resetFields();
      }
      this.editDialogVisible = false;
      this.editDialogData = {};
    },

    online(v){
      this.$confirm('请确认是否'+v.btn_s+'合约账户 '+v.currencyname+' 币种', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      .then(() => {
        //  2.合约结算币种设置
        this.$api.assetCoinSetup({
          tag: {
            dataType: HYPZ_JSBZ,
            coinid:v.currencyid,
            status:v.status == 0?1:0,
            take:2
          }
        });
      })
      .catch(action => {
        
      }); 
    },
    getData() {
      this.tableData = [];
      this.$api.getAssetCoinList({
        tag: {
          dataType: HYPZ_JSBZ,
          take:1
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
                this.$msg({message: "操作成功", type: "success", title: "成功"});
                this.getData();
                break;
              case 3://修改合约币种
                this.$msg({message: "操作成功", type: "success", title: "成功"});
                this.getData();
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
    width: 80px;
    text-align: left;
    padding-right: 20px;
  }
  
  .dialoginput{
    margin-bottom: 10px;
    width: 156px;
  }
  .divliang{
    margin-bottom: 20px;
    //border: 1px solid #ff8866;
  }
  .liang{
    display:inline-block;
    font-size: 16px;
    font-weight: 500;
    width: 70px;
    text-align: left;
  }
  .liangtip{
    font-size: 14px;
    font-weight: 500;
    margin-left:30px;
  }
}
</style>
