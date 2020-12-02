<!--财务记录-->
<template>
  <div class="lsjl">
    <div class="w_menu">
      <el-button
        type="primary"
        class="buttons"
        @click="emailConfig"
        v-if="$store.state.qx.bcprohedgemailup2"
      >配置行情接口预警邮件</el-button>
      <el-button
        type="primary"
        class="buttons"
        @click="warningHistory"
        v-if="$store.state.qx.bcpromarketnotice"
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
        <el-table-column prop="api_name" label="上手数据源" min-width="120"></el-table-column>
        <el-table-column prop="api_status" label="API状态" min-width="100">
          <template slot-scope="scope">
            <span>{{(scope.row.api_status===0?'连接失败':'连接正常')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              v-if="$store.state.qx.bcmarketconfigup1"
              @click="handleThresholdConfig(scope.row)"
            >配置阈值</el-button>
            <el-button
              type="primary"
              size="mini"
              v-if="$store.state.qx.bcmarketconfig"
              @click="handleThresholdCheck(scope.row)"
            >查看当前</el-button>
            <el-button
              type="primary"
              size="mini"
              v-if="$store.state.qx.bcmarketconfigup2"
              @click="handleThresholdSwitch(scope.row)"
            >{{scope.row.notice_switch===1?'关闭预警':'开启预警'}}</el-button>
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
        <el-form :rules="rules" ref="ruleFormmr" :model="ruleForm">
          <div class="divliang">
            <el-form-item label="上手数据源:" label-width="120px" prop="publickey">
              <span>{{dialogData?dialogData.api_name:'--'}}</span>
            </el-form-item>
          </div>
          <div class="divliang">
            <el-form-item label="盘口不更新周期" label-width="120px" prop="holdAmount">
              <div style="display:flex">
                <el-input
                  class="w156"
                  v-if="ttype===1"
                  placeholder="请输入正整数"
                  v-model="ruleForm.holdAmount"
                  clearable
                ></el-input>
                <span v-else>{{dialogData?dialogData.warning_threshold:'--'}}</span>
                <span>&nbsp;分钟</span>
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
      title="配置行情接口预警邮件"
      :visible.sync="configDialogVisible"
      width="510px"
      height="320px"
      :before-close="handleConfigClose"
    >
      <div class="dialogc">
        <span style="width:100%;text-align:left">当触发行情接口阈值时会给下列邮件发出信息</span>
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
        holdAmount: "",
      },
      rules: {
        holdAmount: [{ validator: validate_number, trigger: "blur" }],
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
          dataType: BCPROHEDGEMAILLIST,
          ttype:2,
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
          ttype:2,
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
            this.$api.bcmarketconfigup({
              tag: {
                dataType: BCPROHEDGEWARNSET,
                ttype:1,
                upid: this.dialogData.id,
                vul: Number(this.ruleForm.holdAmount)
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
      this.ruleForm.holdAmount = v.warning_threshold;
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
        "请确认是否" + (v.notice_switch === 1 ? "关闭预警" : "开启预警"),
        "确认信息",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      )
        .then(() => {
          this.$api.bcmarketconfigup({
            tag: {
              dataType: BCPROHEDGEWARNSWITCH,
              ttype:2,
              upid: v.id,
              vul: v.notice_switch === 1 ? 0 : 1
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
        path: "/warningSystem/quotationWarningHistory"
      });
    },
    getData() {
      this.tableData = [];
      this.$api.getbcpromarketconfig({
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
              this.tableData = data.data;
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
