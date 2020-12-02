<!--平台资产账户-->
<template>
  <div class="ptzczh">
    <div class="w_menu">
      <!-- <el-date-picker v-model="time" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>

      <el-button type="primary" class="buttons" @click="search">搜索</el-button>-->
      <el-button
        type="primary"
        class="buttons"
        @click="lishi"
        v-if="$store.state.qx.bcprofinaceassethistory"
      >历史记录</el-button>
    </div>
    <div class="w_c">
      <el-table :data="tableData" style="width:100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="coinname" label="币种"></el-table-column>
        <el-table-column prop="amount" label="可用数量">
          <template slot-scope="scope">
            <span>{{Number(scope.row.amount).toFixed(6)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amountlock" label="冻结数量" width="180"></el-table-column>
        <el-table-column prop="assetaward" label="平台负债" width="180"></el-table-column>
        <el-table-column prop label="操作" width="280">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              v-if="$store.state.qx.bcprofinaceckeckvkey"
              @click="handletb(scope.row)"
            >提币</el-button>
            <el-button
              type="primary"
              size="mini"
              v-if="$store.state.qx.bcprofinaceasst1"
              @click="handlecb(scope.row)"
            >充币</el-button>
            <el-button
              type="primary"
              size="mini"
              v-if="$store.state.qx.bcproairdropsubmit"
              @click="handleAirdrop(scope.row)"
            >空投</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--充币弹框-->
    <el-dialog
      title="充币"
      :visible.sync="dialogVisible_cb"
      :width="dw"
      :close-on-click-modal="false"
      @open="init()"
      @close="handleClose_cb"
    >
      <div class="dialogc">
        <div>
          <span>充币地址：</span>
          <span ref="copyText" id="copyText">{{this.dialogData?this.dialogData.address:''}}</span>
          <el-button
            style="padding-left:10px;"
            v-clipboard:copy="this.dialogData?this.dialogData.address:''"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            type="text"
          >复制</el-button>
        </div>
        <canvas ref="ewm"></canvas>
        <span>最小充值金额 {{(this.dialogData?this.dialogData.mixcharge:'')+(this.dialogData?this.dialogData.coinname:'').toUpperCase()}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="dialogcbOkClick">确定</el-button>
      </span>
    </el-dialog>

    <!--提币弹框-->
    <el-dialog
      :close-on-click-modal="false"
      title="提币"
      :visible.sync="dialogVisible_tb"
      :width="dw"
      @close="handleClose_tb"
    >
      <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
        <el-form-item label="提币地址" prop="tb_address" label-width="70px">
          <el-input v-model="ruleForm.tb_address" placeholder clearable></el-input>
        </el-form-item>
        <el-form-item label="提币数量" prop="tb_num" label-width="70px">
          <el-input
            v-model="ruleForm.tb_num"
            :placeholder="`最小提币${(this.dialogData?this.dialogData.mixwith:'')+(this.dialogData?this.dialogData.coinname:'').toUpperCase()}`"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="手续费" label-width="70px">
          <span
            class="spanb"
          >{{this.sxf+(this.dialogData?this.dialogData.coinname:'').toUpperCase()}}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button size="mini" @click="dialogVisible_tb = false">取 消</el-button> -->
        <el-button size="mini" type="primary" @click="dialogtbOkClick">确定</el-button>
      </span>
    </el-dialog>

    <!--提币谷歌验证-->
    <el-dialog
      :title="yzmtitle"
      :visible.sync="dialogVisible_gg"
      :width="dw"
      :close-on-click-modal="false"
      @close="handleClose_gg"
    >
      <el-form :rules="rules" ref="ruleFormgg" :model="ruleForm">
        <el-form-item label="验证码" prop="yzm" label-width="59px">
          <div class="yzmdiv">
            <el-input v-model="ruleForm.yzm" placeholder></el-input>
            <span
              v-if="yztype === 2"
              :class="this.sjyzm == 1?'yzmspan':'yzmspan yzmspan_2'"
              @click="hqsjyzm"
            >{{sjyzm === 1?'获取验证码':this.djsTime+'s'}}</span>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible_gg = false">取 消</el-button> -->
        <el-button size="mini" type="primary" @click="dialogggOkClick">确定</el-button>
      </span>
    </el-dialog>

    <!--提币信息-->
    <el-dialog
      :title="tbxxtitle"
      :visible.sync="dialogVisible_xx"
      :width="dw"
      :close-on-click-modal="false"
      @close="handleClose_xx"
    >
      <div class="dialogcc">
        <div class="tb_d">
          <span class="tb_sp">提币地址:</span>
          <span>{{this.tb_address}}</span>
        </div>
        <div class="tb_d">
          <span class="tb_sp">提币数量:</span>
          <span>{{this.tb_num+(this.dialogData?this.dialogData.coinname:'').toUpperCase()}}</span>
        </div>
        <div class="tb_d">
          <span class="tb_sp">到账数量:</span>
          <span>{{this.dz_num+(this.dialogData?this.dialogData.coinname:'').toUpperCase()}}</span>
        </div>
        <div class="tb_d">
          <span class="tb_sp">手续费:</span>
          <span>{{this.sxf+(this.dialogData?this.dialogData.coinname:'').toUpperCase()}}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible_cb = false">取 消</el-button> -->
        <el-button size="mini" type="primary" @click="dialogxxOkClick">确定</el-button>
      </span>
    </el-dialog>
    <!--空投弹框-->
    <el-dialog
      :close-on-click-modal="false"
      title="空投"
      :visible.sync="dialogAirdropVisible"
      :width="dw"
      @close="handleClose_airdrop"
    >
      <el-upload
        ref="upload"
        class="upload"
        :action="actionUrl"
        accept=".xls, .xlsx"
        :data="uploadData"
        :file-list="fileList"
        :limit="1"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :auto-upload="false"
      >
        <div>
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button @click="downloadTemp" size="small" type="primary">下载模板</el-button>
        </div>
        <div slot="tip" class="el-upload__tip">只能上传 xls文件，且不超过1M，一次只允许上传一个文件；</div>
      </el-upload>
      <el-form
        :rules="airRules"
        ref="airRuleForm"
        label-width="80px"
        :model="airRuleForm"
        label-position="top"
        class="form-item"
      >
        <el-form-item label="空投描述" prop="describe">
          <el-input
            v-model="airRuleForm.describe"
            type="textarea"
            placeholder="最大可输入80个字符，最少输入20个字符。"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" :loading="uploading" @click="dialogAirdropOkClick">下一步</el-button>
      </span>
    </el-dialog>
    <!--提币信息-->
    <el-dialog
      title="空投"
      :visible.sync="dialogAirInfoVisible"
      width="510px"
      :close-on-click-modal="false"
      @close="handleAirInfoClose"
    >
      <div v-if="this.airinfoUploadStep===3" class="dialogcc">
        <div class="tb_d">
          <span class="tb_sp">空投币种:</span>
          <span>{{this.dialogData?this.dialogData.coinname:'--'}}</span>
        </div>
        <div class="tb_d">
          <span class="tb_sp">空投数量:</span>
          <span>{{this.dialogData?this.dialogData.amount:'--'}}</span>
        </div>
        <div class="tb_d">
          <span class="tb_sp">空投人数:</span>
          <span>{{this.dialogData?this.dialogData.peoples:'--'}}</span>
        </div>
      </div>
      <div v-if="this.airinfoUploadStep===4" class="dialogcc">
        <div class="airdrop_tip">
          <span class="tip_title">审核中 请等待</span>
          <span class="tip_content">审核不通过将不会执行空投申请</span>
          <span class="tip_content">审核通过后会立即执行空投申请</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          type="primary"
          :loading="uploading"
          @click="dialogAirInfoOkClick"
        >{{this.airinfoUploadStep===3?'下一步':'确定'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  GETPTZC,
  GETTBYZ,
  GETTBQQ,
  GETSJYZ,
  PZQB,
  GETSJYZM,
  GETBINFO,
  BCPROAIRDROP
} from "@/constant";
import { setTimeout, clearTimeout, setInterval, clearInterval } from "timers";
let QRCode = require("qrcode");
let canvas = "";
export default {
  data() {
    let validateAddress = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("地址不能为空"));
      } else if (!/^[0-9a-zA-Z]+$/.test(value)) {
        callback(new Error("只能输入英文和数字"));
      } else {
        callback();
      }
    };
    let validateNum = (rule, value, callback) => {
      if (value === "" || value == null) {
        callback(new Error("数量不能为空 "));
      } else if (!/^[.0-9]+$/.test(value)) {
        callback(new Error("只能输入数字"));
      } else if (value < Number(this.mint)) {
        callback(new Error("数量不能小于 " + this.mint));
      } else {
        callback();
      }
    };

    let validatePzNum = (rule, value, callback) => {
      if (value === "" || value == null) {
        callback(new Error("数量不能为空 "));
      } else if (!/^[0-9]+$/.test(value)) {
        callback(new Error("只能输入正整数"));
      } else if (
        value > Number(this.dialogData.amount) &&
        this.ruleForm.selectedv == 2
      ) {
        callback(new Error("数量不足"));
      } else {
        callback();
      }
    };

    let validateYzm = (rule, value, callback) => {
      if (value === "" || value == null) {
        callback(new Error("验证码不能为空 "));
      } else {
        callback();
      }
    };

    let validateType = (rule, value, callback) => {
      if (value === "" || value == null) {
        callback(new Error("类型不能为空 "));
      } else {
        callback();
      }
    };

    return {
      time: null,
      dialogVisible_cb: false,
      dialogVisible_tb: false,
      dialogVisible_pz: false,
      dialogVisible_xx: false,
      dialogVisible_gg: false,
      dialogVisible_pzxx: false,
      dialogAirInfoVisible: false,
      dialogData: null,
      dialogXxType: 1,
      uploadData: {},
      dialogAirdropVisible: false,
      errorTip: "",
      tbxxtitle: "",
      yzmtitle: "",
      yztype: 1, //谷歌验证
      taketype: 1, //提币验证 2平账yanzheng
      sjyzm: 1, // 获取验证码  2 获取中
      djsTime: 60,
      sjyzmt: null, //获取手机验证码计时对象
      dz_num: null,
      dw: "600px", //弹出框宽度
      sxf: 100,
      mint: 200, //最小提币数量
      minc: 100, //最小充币数量
      uploading: false,
      actionUrl: "",
      options: [
        { value: 1, label: "增加数量" },
        { value: 2, label: "减少数量" }
      ],
      ruleForm: {
        tb_address: "",
        tb_num: "",
        yzm: "",
        selectedv: "",
        pz_num: "",
        coinid: 0
      },
      fileList: [],
      tb_address: "",
      tb_num: "",
      selectedv: "",
      pz_num: "",
      rules: {
        tb_address: [{ validator: validateAddress, trigger: "blur" }],
        tb_num: [{ validator: validateNum, trigger: "blur" }],
        yzm: [{ validator: validateYzm, trigger: "blur" }],
        selectedv: [{ validator: validateType, trigger: "change" }],
        pz_num: [{ validator: validatePzNum, trigger: "blur" }]
      },
      airRuleForm: {
        describe: ""
      },
      airRules: {
        describe: [
          { required: true, message: "请输入空投描述", trigger: "blur" },
          {
            min: 20,
            max: 80,
            message: "长度在 20 到 80 个字符",
            trigger: "blur"
          }
        ]
      },
      tableData: [],
      airinfoUploadStep: 3
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [GETPTZC, GETTBYZ, GETTBQQ, GETSJYZ, PZQB, GETSJYZM, GETBINFO,BCPROAIRDROP];
    this.time = this.getNowDate();
    this.getData();
    this.actionUrl = config.url + "/managers/v1/manager/bcproairdropupload";
  },
  computed: {},
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

    init() {
      this.$nextTick(function() {
        // console.log('---------','otpauth://totp/sugar?secret='+this.vkey)
        canvas = this.$refs.ewm;
        this.createQrc(this.dialogData.address); //"otpauth://totp/sugar?secret="+
      });
    },
    createQrc(val) {
      QRCode.toCanvas(this.$refs.ewm, val, error => {
        if (error) {
          console.log(error);
        }
      });
    },

    // 一键复制 // 复制成功
    onCopy(e) {
      console.log(e);
      this.$msg.success({ message: "复制成功", title: "复制" });
    },
    // 复制失败
    onError(e) {
      alert("失败");
      this.$msg.error({ message: "复制成功", title: "复制" });
    },
    search() {
      this.getData();
    },

    lishi() {
      this.$router.push({
        path: "/caiwuxitong/zhlsjl"
      });
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

    getData() {
      let day = null;
      if (this.time) {
        day = this.time + " 23:59:59";
      } else {
        console.log("没有选择任何时间");
      }
      this.$api.getptzczh({
        tag: {
          dataType: GETPTZC,
          tdate: day
        }
      });
    },
    downloadTemp(){
      window.open(config.tempUrl);
    },
    handleAirdrop(v) {
      this.dialogData = v;
      this.dw = "600px";
      this.dialogAirdropVisible = true;
    },
    beforeAvatarUpload(file) {
      var fileName = new Array();
      fileName = file.name.split(".");
      const extension = fileName[fileName.length - 1] === "xls";
      const extension2 = fileName[fileName.length - 1] === "xlsx";
      const isLt1M = file.size / 1024 / 1024 <= 1;
      if (!extension && !extension2) {
        this.$msg({
          message: "上传模板只能是xls、xlsx格式!",
          type: "warning"
        });
      }
      if (!isLt1M) {
        this.$msg({
          message: "上传模板大小不能超过 1MB!",
          type: "warning"
        });
      }
      return extension || (extension2 && isLt1M);
    },
    dialogAirdropOkClick() {
      this.$refs["airRuleForm"].validate(valid => {
        if (valid) {
          if (this.$refs.upload.uploadFiles.length > 0) {
            if (this.beforeAvatarUpload(this.$refs.upload.uploadFiles[0])) {
              let time = parseInt(new Date().getTime() / 1000) + "";
              let sin = md5(
                md5(config.secretKey) + time
              );
              this.uploadData["sign"] = sin;
              this.uploadData["ts"] = time;
              this.uploading = true;
              this.$refs.upload.submit();
            } else {
              this.$refs.upload.clearFiles();
            }
          } else {
            this.$msg({
              title: "错误",
              message: "请选择需要上传的空投文件",
              type: "error"
            });
          }
        }
      });
    },
    uploadSuccess(response, file, fileList) {
      this.$refs.upload.clearFiles();
      this.uploading = false;
      if (response.ret === 0) {
        this.yzmtitle = "谷歌验证";
        this.yztype = 3;
        this.dialogVisible_gg = true;
        this.dialogAirdropVisible = false;
        this.dialogData = Object.assign(this.dialogData, response.data);
      } else {
        this.$msg({
          title: "失败",
          message: response.msg,
          type: "error"
        });
      }
    },
    uploadError(error, file, fileList) {
      this.$refs.upload.clearFiles();
      this.uploading = false;
      this.$msg({
        title: "失败",
        message: "上传失败，请重新尝试",
        type: "error"
      });
    },
    dialogAirInfoOkClick() {
      if(this.airinfoUploadStep === 3){
        this.uploading = true;
        this.$api.assetsAirdrop({
          tag: {
            dataType: BCPROAIRDROP,
            filename:this.dialogData.filename,
            coin_name:this.dialogData.coinname,
            amount:this.dialogData.amount,
            peoples:this.dialogData.peoples,
            mark:this.airRuleForm.describe,
            coin_id:this.dialogData.coinid
          }
        });
      }else if(this.airinfoUploadStep === 4){
        this.dialogAirInfoVisible = false;
      }
    },
    handleClose_airdrop() {
      this.dialogAirdropVisible = false;
    },
    handleAirInfoClose() {
      this.dialogAirInfoVisible = false;
    },
    //提币
    handletb(v) {
      this.sjyzm = 1;
      clearTimeout(this.sjyzmt);
      this.dw = "600px";
      this.mint = v.mixwith;
      this.taketype = 1; //提币操作
      this.ruleForm.tb_address = "";
      this.ruleForm.tb_num = "";
      this.ruleForm.yzm = "";
      this.ruleForm.coinid = v.coinid;
      this.sxf = v.fee;
      this.dialogData = v;
      this.dialogVisible_tb = true;
      // this.$api.getBInfo({ tag: { dataType: GETBINFO, coin_id: v.coin_id } });
    },

    //充币
    handlecb(v) {
      this.taketype = 3; //充币操作
      this.dw = "550px";
      this.dialogData = v;
      // console.log(v)
      this.dialogVisible_cb = true;
      // this.$api.getBInfo({ tag: { dataType: GETBINFO, coin_id: v.coin_id } });
    },

    //----------------确定按钮
    dialogcbOkClick() {
      this.dialogVisible_cb = false;
    },

    dialogtbOkClick() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.tb_address = this.ruleForm.tb_address;
          this.tb_num = this.ruleForm.tb_num;
          this.dialogVisible_tb = false;
          this.dialogVisible_xx = true;
          this.tbxxtitle = "提币信息";
          this.dz_num = this.Subtr(
            Number(this.ruleForm.tb_num),
            Number(this.sxf)
          );
          this.dialogXxType = 1;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    dialogxxOkClick() {
      if (this.dialogXxType === 1) {
        this.dialogVisible_xx = false;
        this.yzmtitle = "谷歌验证";
        this.yztype = 1;
        this.dialogVisible_gg = true;
      } else {
        this.dialogVisible_xx = false;
      }
    },

    dialogggOkClick() {
      this.$refs["ruleFormgg"].validate(valid => {
        if (valid) {
          //发送验证码
          if (this.yztype === 1) {
            //谷歌验证
            this.$api.tbyz({
              tag: {
                dataType: GETTBYZ,
                yzm: this.ruleForm.yzm,
                yztype: this.yztype
              }
            });
          } else if (this.yztype === 2) {
            //手机验证
            this.$api.tbyz({
              tag: {
                dataType: GETSJYZ,
                params: {
                  code: this.ruleForm.yzm,
                  amont: this.ruleForm.tb_num,
                  coinid: this.ruleForm.coinid,
                  addre: this.ruleForm.tb_address
                },
                yztype: this.yztype
              }
            });
          } else if (this.yztype === 3) {
            this.$api.tbyz({
              tag: {
                dataType: GETTBYZ,
                yzm: this.ruleForm.yzm,
                yztype: this.yztype
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //------------------x关闭-------------
    handleClose_cb() {
      this.dialogVisible_cb = false;
    },

    handleClose_tb() {
      this.dialogVisible_tb = false;
      this.$refs["ruleForm"].resetFields();
    },

    handleClose_xx() {
      this.dialogVisible_xx = false;
    },

    handleClose_gg() {
      this.dialogVisible_gg = false;
      this.$refs["ruleFormgg"].resetFields();
    },

    handleClose_pz() {
      this.dialogVisible_pz = false;
      this.$refs["ruleFormpz"].resetFields();
    },

    //获取手机验证码
    hqsjyzm() {
      if (this.sjyzm === 1) {
        this.sjyzm = 2; //获取中
        this.djsTime = 60;
        if (this.sjyzmt) {
          clearInterval(this.sjyzmt);
          this.sjyzmt = null;
        }
        this.sjyzmt = setInterval(() => {
          this.djsTime -= 1;
          if (this.djsTime == 0) {
            this.sjyzm = 1;
            clearInterval(this.sjyzmt);
            this.sjyzmt = null;
          }
        }, 1000);
        this.$api.bcsendsmsadmin({ tag: { dataType: GETSJYZM } });
      } else {
        console.log("获取中。。");
      }
    },

    message(tag, data) {
      switch (tag.dataType) {
        case GETPTZC:
          if (data.ret === 0) {
            this.tableData = data.data;
          }
          break;
        case GETTBYZ: //谷歌验证  通过改成手机验证
          if (data.ret === 0) {
            if (this.yztype === 1) {
              this.$refs["ruleFormgg"].resetFields();
              this.yztype = 2;
              this.yzmtitle = "手机验证";
            } else if (this.yztype === 3) {
              this.dialogAirInfoVisible = true;
              this.airinfoUploadStep = 3;
              this.dialogVisible_gg = false;
            }
          }
          break;
        case GETSJYZM:
          //手机验证码 由手机端直接接受
          break;
        case GETSJYZ: //手机验证码结果
          if (data.ret === 0) {
            this.dialogVisible_gg = false;
            if (this.taketype === 1) {
              //提币
              this.$api.tb({
                tag: {
                  dataType: GETTBQQ,
                  address: this.tb_address,
                  amount: this.tb_num,
                  coin_id: this.dialogData.coin_id
                }
              });
            }
          }
          break;
        case BCPROAIRDROP:
          this.uploading = false;
          if(data.ret === 0){
            this.airinfoUploadStep = 4;
          }
          break;
        case GETTBQQ: //提币结果
          if (data.ret === 0) {
            this.$msg({ title: "成功", message: data.msg, type: "success" });
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
.el-form-item {
  text-align: left;
}
.buttons {
  margin: 0 30px;
}

.spanb {
  display: block;
  text-align: left;
}

.ptzczh {
  width: 100%;
  display: flex;
  flex-direction: column;
  .w_menu {
    width: 100%;
    flex-shrink: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
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
}

.dialogc {
  padding-top: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dialogcc {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  .airdrop_tip{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .tip_title{
      font-size: 18px;
      font-weight: 600;
    }
    .tip_content{
      font-size: 14px;
      font-weight: 400;
    }
  }
}

.dialogstip {
  color: red;
  padding: 20px 10px;
}

.tb_d {
  width: 100%;
  display: flex;
  height: 30px;
  justify-content: flex-start;
  align-items: center;
  .tb_sp {
    display: block;
    padding-right: 15px;
    flex-shrink: 0;
    text-align: left;
    width: 60px;
  }
}

.ggyzinput {
  position: relative;
  .ggerrortip {
    display: block;
    position: absolute;
    color: red;
  }
}

.yzmdiv {
  position: relative;
  .yzmspan {
    position: absolute;
    display: block;
    right: 10px;
    top: 0px;
    cursor: pointer;
    color: blue;
  }
  .yzmspan_2 {
    color: #ccc;
  }
}
.upload {
  text-align: left;
  padding-bottom: 30px;
}
</style>
