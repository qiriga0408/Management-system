<!--财务记录-->
<template>
  <div class="lsjl">
    <div class="w_menu">
      <el-button
        type="primary"
        class="buttons"
        @click="emailConfig"
        v-if="$store.state.qx.bcprohedgemailup"
      >配置对冲预警邮件</el-button>
      <el-button
        type="primary"
        class="buttons"
        @click="warningHistory"
        v-if="$store.state.qx.bcprohedgenotice"
      >预警记录</el-button>
    </div>
    <div id="wcdiv_lsjl" class="w_c">
      <el-table
        :data="tableData"
        style="width:100%"
        :cell-style="{ height: rowh + 'px' }"
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        row-key="index"
      >
        <el-table-column prop="hedgeaccount" label="对冲子账号" min-width="120"></el-table-column>
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
        <el-table-column prop label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              v-if="$store.state.qx.bcprohedgewarnset && scope.row.hasOwnProperty('hedgestatus')"
              @click="handleThresholdConfig(scope.row)"
            >配置阈值</el-button>
            <el-button
              type="primary"
              size="mini"
              v-if="$store.state.qx.bcprohedgeconfig && scope.row.hasOwnProperty('hedgestatus')"
              @click="handleThresholdCheck(scope.row)"
            >查看当前</el-button>
            <el-button
              type="primary"
              size="mini"
              v-if="$store.state.qx.bcprohedgewarnswitch && scope.row.hasOwnProperty('hedgestatus')"
              @click="handleThresholdSwitch(scope.row)"
            >{{scope.row.noticeswitch===1?'关闭预警':'开启预警'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="ttype===1?'配置阈值':'当前阈值'"
      :visible.sync="dialogVisible"
      width="540px"
      height="400px"
      :before-close="handleClose"
    >
      <div class="dialogc">
        <!-- <div  class="dialogc2"> -->
        <el-form :rules="rules" ref="ruleFormmr" :model="ruleForm">
          <div class="divliang">
            <el-form-item label="合约交易账户:" label-width="120px" prop="publickey">
              <span>{{dialogData?dialogData.contractcode:'--'}}</span>
            </el-form-item>
          </div>
          <div class="divliang">
            <el-form-item label="对冲子账号:" label-width="120px" prop="publickey">
              <span>{{dialogData?dialogData.hedgeaccount:'--'}}</span>
            </el-form-item>
          </div>
          <div class="divliang">
            <el-form-item label="可用数量低于" label-width="120px" prop="available">
              <div style="display:flex">
                <el-input
                  class="w156"
                  v-if="ttype===1"
                  placeholder="请输入可用数量阈值"
                  v-model="ruleForm.available"
                  clearable
                ></el-input>
                <span v-else>{{dialogData?dialogData.minavailable:'--'}}</span>
                <span>&nbsp;USDT</span>
              </div>
            </el-form-item>
          </div>
          <div class="divliang">
            <el-form-item label="持仓张数大于" label-width="120px" prop="holdAmount">
              <div style="display:flex">
                <el-input
                  class="w156"
                  v-if="ttype===1"
                  placeholder="请输入持仓张数阈值"
                  v-model="ruleForm.holdAmount"
                  clearable
                ></el-input>
                <span v-else>{{dialogData?dialogData.maxpositionvol:'--'}}</span>
                <span>&nbsp;张</span>
              </div>
            </el-form-item>
          </div>
          <div class="divliang">
            <el-form-item label="保证金率" label-width="120px" prop="deposite">
              <div style="display:flex">
                <el-input
                  class="w156"
                  v-if="ttype===1"
                  placeholder="请输入保证金率阈值"
                  v-model="ruleForm.deposite"
                  clearable
                ></el-input>
                <span v-else>{{dialogData?dialogData.marginratio:'--'}}</span>
                <span>&nbsp;%</span>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" v-if="ttype===1" @click="handleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="dialogOkClick">{{this.ttype===1?'确定':'关闭'}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="配置对冲预警邮件"
      :visible.sync="configDialogVisible"
      width="510px"
      height="320px"
      :before-close="handleConfigClose"
    >
      <div class="dialogc">
        <span style="width:100%;text-align:left">当触发对冲账户阈值时会给下列邮件发出信息</span>
        <div class="dialogc2">
          <el-tag
            :key="tag"
            v-for="tag in emailData"
            closable
            :disable-transitions="false"
            @close="handleTagClose(tag)"
          >{{tag}}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          ></el-input>
          <el-button
            v-else-if="emailData.length<10"
            class="button-new-tag"
            size="small"
            @click="showInput"
          >添加新邮件</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleConfigClose">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          :disabled="configEmailDisabled"
          @click="configOkClick"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  BCPROHEDGECONFIG,
  BCPROHEDGEWARNSWITCH,
  BCPROHEDGEMAILLIST,
  BCPROHEDGEMAILUP,
  BCPROHEDGEWARNSET
} from "@/constant";
export default {
  data() {
    let validate_number = (rule, value, callback) => {
      //   console.log(rule)
      let reg = /^\+?[1-9]\d*$/;
      if (value == "") {
        return callback(new Error("不能为空"));
      } else if (!value || !reg.test(value)) {
        return callback(new Error("只能输入正整数"));
      } else {
        callback();
      }
    };

    return {
      rowh: 40, //行高
      tableData: [],
      emailData: [],
      inputVisible: false,
      inputValue: "",
      ttype: 0,
      configEmailDisabled: false,
      dialogVisible: false,
      configDialogVisible: false,
      dialogData: null,
      ruleForm: {
        available: "",
        holdAmount: "",
        deposite: ""
      },
      rules: {
        available: [{ validator: validate_number, trigger: "blur" }],
        holdAmount: [{ validator: validate_number, trigger: "blur" }],
        deposite: [{ validator: validate_number, trigger: "blur" }]
      }
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [
      BCPROHEDGECONFIG,
      BCPROHEDGEWARNSWITCH,
      BCPROHEDGEMAILLIST,
      BCPROHEDGEMAILUP,
      BCPROHEDGEWARNSET
    ];
    this.getData();
    this.getEmailList();
  },
  computed: {},
  methods: {
    getEmailList() {
      this.emailData = [];
      this.$api.getbcprohedgemaillist({
        tag: {
          dataType: BCPROHEDGEMAILLIST
        }
      });
    },
    handleTagClose(tag) {
      this.emailData.splice(this.emailData.indexOf(tag), 1);
      this.configEmailDisabled = false;
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      if (this.inputValue.length > 30) {
        this.configEmailDisabled = true;
        this.$msg({
          title: "错误",
          message: "邮箱总长度最多30个字符",
          type: "error"
        });
        return;
      }
      let inputValue = this.inputValue;
      let reg = new RegExp(
        /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/
      );
      if (inputValue && reg.test(inputValue)) {
        let email = this.emailData.find(v => v === inputValue);
        if (email !== undefined) {
          this.configEmailDisabled = true;
          this.$msg({ title: "错误", message: "邮箱已存在", type: "error" });
          return;
        }
        this.configEmailDisabled = false;
        this.emailData.push(inputValue);
        this.inputVisible = false;
        this.inputValue = "";
      } else {
        if (inputValue === "") {
          this.inputVisible = false;
          return;
        }
        this.configEmailDisabled = true;
        this.$msg({ title: "错误", message: "邮箱格式错误", type: "error" });
      }
    },
    handleConfigClose() {
      this.inputVisible = false;
      this.inputValue = "";
      this.configDialogVisible = false;
    },
    configOkClick() {
      this.configDialogVisible = false;
      let mail = this.emailData.join(";");
      this.$api.getbcprohedgemailup({
        tag: {
          dataType: BCPROHEDGEWARNSET,
          mail: mail
        }
      });
    },
    handleClose() {
      this.dialogData = null;
      this.dialogVisible = false;
      if (this.$refs.ruleFormmr) {
        this.$refs.ruleFormmr.resetFields();
      }
    },
    dialogOkClick() {
      if (this.ttype === 1) {
        this.$refs["ruleFormmr"].validate(valid => {
          if (valid) {
            this.dialogVisible = false;
            this.$api.getbcprohedgewarnset({
              tag: {
                dataType: BCPROHEDGEWARNSET,
                configid: this.dialogData.configid,
                noticeswitch: Number(this.dialogData.noticeswitch),
                maxpositionvol: Number(this.ruleForm.holdAmount),
                minavailable: Number(this.ruleForm.available),
                marginratio: Number(this.ruleForm.deposite)
              }
            });
            if (this.$refs.ruleFormmr) {
              this.$refs.ruleFormmr.resetFields();
            }
          }
        });
      } else {
        this.dialogVisible = false;
      }
    },
    handleThresholdConfig(v) {
      this.dialogData = v;
      this.ruleForm.available = v.minavailable;
      this.ruleForm.holdAmount = v.maxpositionvol;
      this.ruleForm.deposite = v.marginratio;
      this.ttype = 1;
      this.dialogVisible = true;
    },
    handleThresholdCheck(v) {
      this.dialogData = v;
      this.ttype = 2;
      this.dialogVisible = true;
    },
    handleThresholdSwitch(v) {
      this.$confirm(
        "请确认是否" + (v.noticeswitch === 1 ? "关闭预警" : "开启预警"),
        "确认信息",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      )
        .then(() => {
          this.$api.getbcprohedgewarnswitch({
            tag: {
              dataType: BCPROHEDGEWARNSWITCH,
              configid: v.configid,
              noticeswitch: v.noticeswitch === 1 ? 0 : 1
            }
          });
        })
        .catch(action => {});
    },
    emailConfig() {
      this.getEmailList();
      this.configEmailDisabled = true;
      this.configDialogVisible = true;
    },
    warningHistory() {
      this.$router.push({
        path: "/warningSystem/hedgeWarningHistory"
      });
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
              for (let index in data.data) {
                let item = data.data[index];
                item.index = index;
                if (this.tableData.length > 0) {
                  let ha = this.tableData.find(
                    v => v.hedgeaccount === item.contractcode
                  );
                  if (ha !== undefined) {
                    ha.children.push(item);
                  } else {
                    this.tableData.push({
                      hedgeaccount: item.contractcode,
                      children: [item]
                    });
                  }
                } else {
                  this.tableData.push({
                    hedgeaccount: item.contractcode,
                    children: [item]
                  });
                }
              }
            } else {
              this.tableData = [];
              this.datatotal = 0;
            }
          }
          break;
        case BCPROHEDGEMAILLIST:
          if (data.ret === 0) {
            this.emailData = [];
            for (let i = 0; i < data.data.length; i++) {
              let email = data.data[i];
              if (email.email) {
                this.emailData.push(email.email);
              }
            }
          }
          break;
        case BCPROHEDGEWARNSWITCH:
          if (data.ret === 0) {
            this.$msg({ title: "成功", message: "操作成功", type: "success" });
            this.getData();
          }
          break;
        case BCPROHEDGEWARNSET:
          if (data.ret === 0) {
            this.$msg({ title: "成功", message: "操作成功", type: "success" });
            this.getData();
          }
          break;
        case BCPROHEDGEMAILUP:
          if (data.ret === 0) {
            this.$msg({ title: "成功", message: "操作成功", type: "success" });
            this.getEmailList();
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: auto;
  margin-left: 10px;
  vertical-align: bottom;
}
.w156 {
  width: 200px;
}
.divliang {
  margin-bottom: 20px;
  text-align: left;
}
.dialogc {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .dialogc2 {
    display: block;
    width: 100%;
    padding-top: 10px;
    text-align: left;
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
