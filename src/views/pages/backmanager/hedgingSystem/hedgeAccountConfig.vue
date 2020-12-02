<!--财务记录-->
<template>
  <div class="lsjl">
    <div class="w_menu">
      <el-button type="primary" class="buttons" 
        @click="addAccount">添加子账号</el-button>
      <el-button type="primary" class="buttons" 
        @click="accountConfig">配置合约账户</el-button>
    </div>
    <div id="wcdiv_lsjl" class="w_c">
      <el-table :data="tableData" style="width:100%" :cell-style="{ height: rowh + 'px' }"
        default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        row-key="index">
        <el-table-column prop="hedgeaccount" label="对冲子账号" min-width="120"></el-table-column>
        <el-table-column prop="createdat" label="创建时间" min-width="180"></el-table-column>
        <el-table-column prop="updatedat" label="修改时间" min-width="180"></el-table-column>
        <el-table-column prop="apistatus" label="API状态" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.hasOwnProperty('apistatus')?(scope.row.apistatus===0?'连接失败':'连接正常'):''}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="hedgestatus" label="对冲状态" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.hasOwnProperty('hedgestatus')?(scope.row.hedgestatus===0?'辅助对冲':'主对冲'):''}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="" label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button  type="primary"
              size="mini" v-if="$store.state.qx.bcprohedgeconfigup && scope.row.hasOwnProperty('hedgestatus')"
              @click="handleReset(scope.row)">重置</el-button>
            <el-button  type="primary" :disabled="scope.row.hasOwnProperty('hedgestatus') && scope.row.hedgestatus===1"
              size="mini" v-if="$store.state.qx.bcprohedgeconfigset && scope.row.hasOwnProperty('hedgestatus')"
              @click="handleChangeStatus(scope.row)">{{scope.row.hasOwnProperty('hedgestatus')?scope.row.hedgestatus===0?'设置为主对冲':'已是主对冲':''}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="ttype===2?'添加子账号':'重置子账号'"
      :visible.sync="dialogVisible"
      width="510px" height="320px"
      :before-close="handleClose">
      <div class="dialogc">
        <el-form :rules="rules" ref="ruleFormmr" :model="ruleForm">
          <div v-if="ttype!==2" class="divliang">
            <el-form-item  label="子账号名称:"  label-width="100px"  prop="publickey">
                <span>{{dialogData?dialogData.hedgeaccount:'--'}}</span>
            </el-form-item>
          </div>
          <div class="divliang">
            <el-form-item  label="公钥:"  label-width="100px"  prop="publickey">
                <el-input  class="w156" v-model="ruleForm.publickey" clearable></el-input>
            </el-form-item>
          </div>
          <div class="divliang">
            <el-form-item  label="私钥:"  label-width="100px"  prop="privatekey">
                <el-input  class="w156" v-model="ruleForm.privatekey" clearable></el-input>
            </el-form-item>
          </div>
          <div class="divliang">
            <el-form-item  label="短语:"  label-width="100px"  prop="hintphrase">
                <el-input  class="w156" v-model="ruleForm.hintphrase" clearable></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="dialogOkClick">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="配置合约账户"
      :visible.sync="configDialogVisible"
      width="510px" height="320px"
      :before-close="handleConfigClose">
      <div class="dialogc">
        <el-form :rules="configRules" ref="configFormmr" :model="configForm">
          <div class="divliang">
            <el-form-item  label="子账号:"  label-width="120px"  prop="account">
                <el-select v-model="configForm.account" placeholder="请选择子账号" class="inputs">
                    <el-option
                    v-for="(item,index) in accountData"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
          </div>
          <div class="divliang">
            <el-form-item  label="保证金类型:"  label-width="120px"  prop="deposite">
                <el-select v-model="configForm.deposite" placeholder="请选择合约保证金类型" class="inputs">
                    <el-option
                    v-for="(item,index) in depositeData"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
          </div>
          <div class="divliang">
            <el-form-item  label="账户类型:"  label-width="120px"  prop="type">
                <el-select v-model="configForm.type" placeholder="请选择合约账户类型" class="inputs">
                    <el-option
                    v-for="(item,index) in typeData"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
          </div>
          <div class="divliang">
            <el-form-item  label="下单模式:"  label-width="120px"  prop="model">
                <el-select v-model="configForm.model" placeholder="请选择下单模式" class="inputs">
                    <el-option
                    v-for="(item,index) in modelData"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
          </div>
          <div class="divliang">
            <el-form-item  label="杠杆倍数:"  label-width="120px"  prop="lever">
                <el-select v-model="configForm.lever" placeholder="请选择杠杆倍数" class="inputs">
                    <el-option
                    v-for="(item,index) in leverData"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
          </div>
          <div class="divliang">
            <el-form-item  label="合约代码:"  label-width="120px"  prop="contract">
                <el-select v-model="configForm.contract" placeholder="请选择需要对冲的合约代码" class="inputs">
                    <el-option
                    v-for="(item,index) in contractData"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleConfigClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="configOkClick">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Label from "@/components/label";
import { BCPROHEDGECONFIG,BCPROHEDGECONFIGUP ,HYPZ_SXF,BCPROHEDGEACCOUNTLIST,BCPROHEDGECONFIGSET} from "@/constant";
export default {
  data() {
    let validate_account = (rule, value, callback) => {
    //   console.log(rule)
      if(value == ''){
        let title = '';
        if(rule.field == 'publickey'){
            title = '公钥';
        }else if(rule.field == 'privatekey'){
            title = '私钥';
        }else if(rule.field == 'hintphrase'){
            title = '短语';
        }
        return callback(new Error(title+"不能为空"));
      }else {
        callback();
      }
    };
    
    return {
      rowh: 40, //行高
      tableData: [],
      ttype:0,
      dialogVisible:false,
      configDialogVisible:false,
      dialogData:null,
      publickey:'',
      privatekey:'',
      hintphrase:'',
      accountData:[],
      modelData:[{label:'全仓模式',value:0}],
      leverData:[{label:'x2',value:2},
                 {label:'x3',value:3},
                 {label:'x4',value:4},
                 {label:'x5',value:5},
                 {label:'x6',value:6},
                 {label:'x7',value:7},
                 {label:'x10',value:10},
                 {label:'x20',value:20},
                 {label:'x30',value:30},
                 {label:'x50',value:50},
                 {label:'x75',value:75},
                 {label:'x100',value:100}],
      contractData:[],
      typeData:[{label:'永续合约',value:0}],
      depositeData:[{label:'USDT保证金-正向',value:0}],
      configForm: {
        account:'',
        model:'',
        lever:'',
        contract:'',
        type:'',
        deposite:'',
      },
      configRules: {
        account: [{ required: true, message: '请选择子账户', trigger: 'change' }],
        model: [{ required: true, message: '请选择下单类型', trigger: 'change' }],
        lever: [{ required: true, message: '请选择杠杆倍数', trigger: 'change' }],
        contract: [{ required: true, message: '请选择需要对冲的合约', trigger: 'change' }],
        type: [{ required: true, message: '请选择账户类型', trigger: 'change' }],
        deposite: [{ required: true, message: '请选择保证金类型', trigger: 'change' }],
      },
      ruleForm: {
        publickey:'',
        privatekey:'',
        hintphrase:'',
      },
      rules: {
        publickey: [{ validator: validate_account, trigger: "blur" }],
        privatekey: [{ validator: validate_account, trigger: "blur" }],
        hintphrase: [{ validator: validate_account, trigger: "blur" }],
      }
    };
  },
  components: {Label:Label},
  mounted() {
    this.$register(this);
    this.msg = [BCPROHEDGECONFIG,BCPROHEDGECONFIGUP,HYPZ_SXF,BCPROHEDGEACCOUNTLIST,BCPROHEDGECONFIGSET];
    this.getData();
    //获取全部合约
      this.$api.bcprocontractset({
        tag: {
          dataType: HYPZ_SXF,
          url:"/managers/v1/manager/bcprocontractset",
          take:1,//获取全部合约
          params:{}//参数
        }
      });
      //获取子账号列表
    this.$api.getbcprohedgeaccountlist({
        tag: {
          dataType: BCPROHEDGEACCOUNTLIST,
        }
      });
  },
  computed: {},
  methods: {
    handleConfigClose(){
      this.$refs['configFormmr'].resetFields();
      this.configDialogVisible = false;
    },
    configOkClick(){
      this.$refs["configFormmr"].validate(valid => {
        if (valid) {
          this.$api.bcprohedgeconfigset({
            tag: {
                dataType:BCPROHEDGECONFIGSET,
                hedaccount:this.configForm.account,
                margindirection:this.configForm.deposite,
                contracttype:this.configForm.type,
                accounttype:this.configForm.model,
                contractcode:this.configForm.contract,
                lever:this.configForm.lever,
              }
            });
          this.configDialogVisible = false;
          this.$refs['configFormmr'].resetFields();
        }
      });
      
    },
    handleClose(){
      this.publickey='';
      this.privatekey='';
      this.hintphrase='';
      this.dialogData = null;
      this.dialogVisible = false;
      if (this.$refs.ruleFormmr) {
        this.$refs.ruleFormmr.resetFields();
      };
    },
    dialogOkClick(){
      this.$refs["ruleFormmr"].validate(valid => {
        if (valid) {
            this.dialogVisible = false;
            this.$api.bcprohedgeconfigup({
                tag: {
                  dataType: BCPROHEDGECONFIGUP,
                  hedaccount:this.ttype===2?'':this.dialogData.hedaccount,
                  privatekey:this.ruleForm.privatekey,
                  publickey:this.ruleForm.publickey,
                  hintphrase:this.ruleForm.hintphrase,
                  hedgestatus:this.ttype===2?0:this.dialogData.hedgestatus,
                  ttype:this.ttype,
                  configid:this.ttype===2?0:this.dialogData.configid,
                  contractcode:this.ttype===2?"":this.dialogData.contractcode,
                }
            });
        }
      });
    },
    handleReset(v){
      this.dialogData = v;
      this.ruleForm.publickey='';
      this.ruleForm.privatekey='';
      this.ruleForm.hintphrase='';
      this.ttype = 1;
      this.dialogVisible = true;
    },
    handleChangeStatus(v){
      this.ttype = 3;
      this.$confirm('请确认是否将 '+v.hedgeaccount+' 设置为主对冲?', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      .then(() => {
        this.$api.bcprohedgeconfigup({
            tag: {
              dataType: BCPROHEDGECONFIGUP,
              hedaccount:v.hedgeaccount,
              privatekey:'',
              publickey:'',
              hintphrase:'',
              hedgestatus:1,
              ttype:this.ttype,
              contractcode:v.contractcode,
              configid:v.configid
            }
        });
      })
      .catch(action => {
        
      }); 
    },
    addAccount() {
      this.ruleForm.publickey='';
      this.ruleForm.privatekey='';
      this.ruleForm.hintphrase='';
      this.ttype = 2;
      this.dialogVisible = true;
    },
    accountConfig(){
      this.configDialogVisible = true;
    },
    getData() {
      this.tableData = [];
      this.$api.getbcprohedgeconfig({
        tag: {
          dataType: BCPROHEDGECONFIG
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case BCPROHEDGECONFIG:
          if (data.ret === 0) {
            if (data.data && data.data.length) {
            //   this.tableData = data.data;
              this.tableData = [];
              for(let index in data.data){
                  let item = data.data[index];
                  item.index = index;
                  if(this.tableData.length > 0){
                    let ha = this.tableData.find(v=>v.hedgeaccount===item.contractcode);
                    if(ha !== undefined){
                        ha.children.push(item);
                    }else{
                        this.tableData.push({hedgeaccount:item.contractcode,children:[item]})
                    }
                  }else{
                    this.tableData.push({hedgeaccount:item.contractcode,children:[item]})
                  }
              }

            } else {
              this.tableData = [];
              this.datatotal = 0;
            }
          }
          break;
        case BCPROHEDGECONFIGUP:
            if(data.ret === 0){
              this.$msg({title: '成功',message: (this.ttype === 2?"添加子账号成功":(this.ttype === 3?"设置成功":"重置子账号成功")),type: 'success'});
              //获取子账号列表
              this.$api.getbcprohedgeaccountlist({
                tag: {
                  dataType: BCPROHEDGEACCOUNTLIST,
                }
              });
            }
            break;
        case HYPZ_SXF:
          if (data.ret === 0) {
            if (data.data) {
              data.data.sort((a, b)=> b.orderby-a.orderby);
              this.contractData = data.data.map(v=>{
                return {
                  label:v.traderpairs,
                  value:v.traderpairs
                }
              });
            }
          }
          break;
        case BCPROHEDGEACCOUNTLIST:
          if (data.ret === 0) {
            if(data.data){
                this.accountData = data.data.map((v,index)=>{
                        return {
                            label:v.hedgeaccount,
                            value:v.hedgeaccount
                        }
                    });
            }
          }
          break;
        case BCPROHEDGECONFIGSET:
          if(data.ret === 0){
            this.$msg({title: '成功',message: '配置成功',type: 'success'});
            this.getData();
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
  .divliang{
    margin-bottom: 20px;
    text-align: left;
    //border: 1px solid #ff8866;
  }
.dialogc{
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-content:center;
  .dialogc2{
    display: flex;
    flex-direction: column;
    align-items:flex-start;
    justify-content:center;
  }
}
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
