<!--平台资产账户-->
<template>
  <div class="ptzczh">
    <div class="w_menu">
      <!-- <el-date-picker v-model="time" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>

      <el-button type="primary" class="buttons" @click="search">搜索</el-button>-->
      <!-- <span class="searchTitle">平台资产账户 UID:{{123123123123}}</span> -->
      <el-button
        type="primary"
        class="buttons"
        @click="lishi"
        v-if="$store.state.qx.bcprofinacec2chistroy"
      >查看历史记录</el-button>
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
        <el-table-column prop label="操作" width="280">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              v-if="$store.state.qx.bcprofinacetransfer"
              @click="handleTransfer(scope.row)"
            >划转</el-button>
            <el-button
              type="primary"
              size="mini"
              v-if="$store.state.qx.bcprofinaceasst3"
              @click="handlecb(scope.row)"
            >充币</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--充币弹框-->
    <el-dialog
      title="充币"
      :visible.sync="dialogVisible_cb"
      width="570px"
      :close-on-click-modal="false"
      @open="init()"
      @close="handleClose_cb"
    >
      <div class="dialogc">
        <div style="text-align:left">
          <div>
            <span>币种：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span>{{this.dialogData?(this.dialogData.coinname === 'USDT'?'USDT_ERC20':this.dialogData.coinname):'--'}}</span>
          </div>
          <br />
          <span>充币地址：</span>
          <span ref="copyText" id="copyText">{{this.dialogData?this.dialogData.address:'--'}}</span>
          <el-button
            style="padding-left:10px;"
            v-clipboard:copy="this.dialogData?this.dialogData.address:''"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            type="text"
          >复制</el-button>
        </div>
        <canvas ref="ewm"></canvas>
        <div style="text-align:left">
          <span>最小充值金额 {{(this.dialogData?this.dialogData.mixcharge:'')+(this.dialogData?this.dialogData.coinname:'').toUpperCase()}};</span><br>
          <span v-if="this.dialogData&& this.dialogData.coinname === 'USDT'">请勿充值 非 ERC2.0币种;</span><br>
          <span>请确保充币地址复制正确。</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="dialogcbOkClick">确定</el-button>
      </span>
    </el-dialog>

    <!--划转弹框-->
    <el-dialog
      :close-on-click-modal="false"
      title="资金划转"
      :visible.sync="dialogVisible_transfer"
      width="510px"
      @close="handleClose_transfer"
    >
      <el-form :rules="rules" style="text-align:left" ref="ruleForm" :model="ruleForm">
        <el-form-item label="划转币种" label-width="100px">
          <span>{{this.dialogData&&this.dialogData.coinname}}</span>
        </el-form-item>
        <el-form-item label="划转数量" prop="transfer_num" label-width="100px">
          <el-input
            style="width:250px"
            v-model="ruleForm.transfer_num"
            placeholder="只可以输入数字及小数点"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="用途归类" label-width="100px">
          <el-select style="width:250px" v-model="ruleForm.classification" placeholder="请选择" class="inputs">
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button size="mini" @click="dialogVisible_transfer = false">取 消</el-button> -->
        <el-button size="mini" type="primary" @click="dialogTransferOkClick">确定</el-button>
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
  GETBINFO
} from "@/constant";
import { setTimeout, clearTimeout, setInterval, clearInterval } from "timers";
let QRCode = require("qrcode");
let canvas = "";
export default {
  data() {
    let validateNum = (rule, value, callback) => {
      if (value === "" || value == null) {
        callback(new Error("数量不能为空 "));
      } else if (!/^[.0-9]+$/.test(value)) {
        callback(new Error("只能输入数字"));
      } else if (value <= Number(this.mint)) {
        callback(new Error("数量不能等于" + this.mint));
      } else if (value > Number(this.dialogData.amount)) {
        callback(new Error("数量不能大于可用余额"+this.dialogData.amount));
      } else if (!/^[1-9]\d{0,}(\.\d{0,6})?$|^0(\.\d{1,6})?$/.test(value)) {
        callback(new Error("请确保格式正确且小数最多6位"));
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
      dialogVisible_cb: false,
      dialogVisible_transfer: false,
      dialogData: null,
      options: [
        { label: "C2C结算", value: 1 },
        { label: "C2C其它", value: 2 }
      ],
      dw: "600px", //弹出框宽度
      mint: 0, //最小提币数量
      ruleForm: {
        transfer_num: "",
        classification: 1
      },
      transfer_num: "",
      rules: {
        transfer_num: [{ validator: validateNum, trigger: "blur" }],
        classification: [{ validator: validateType, trigger: "change" }]
      },

      tableData: []
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [GETPTZC, GETTBYZ, GETTBQQ, GETSJYZ, PZQB, GETSJYZM, GETBINFO];
    this.getData();
  },
  computed: {},
  methods: {
    init() {
      this.$nextTick(function() {
        canvas = this.$refs.ewm;
        this.createQrc(this.dialogData.address);
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
        path: "/caiwuxitong/c2cChargeHistory"
      });
    },

    getData() {
      this.$api.getC2cCharge({
        tag: {
          dataType: GETPTZC,
        }
      });
    },

    //划转
    handleTransfer(v) {
      this.dw = "600px";
      this.ruleForm.transfer_num = "";
      this.dialogData = v;
      this.dialogVisible_transfer = true;
    },

    //充币
    handlecb(v) {
      this.taketype = 3; //充币操作
      this.dw = "550px";
      this.dialogData = v;
      this.dialogVisible_cb = true;
    },

    //----------------确定按钮
    dialogcbOkClick() {
      this.dialogVisible_cb = false;
    },

    dialogTransferOkClick() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.$api.c2cTransfer({tag:{
            dataType:GETTBQQ,
            amount: this.ruleForm.transfer_num,
            coin_id: this.dialogData.coinid,
            ttype: this.ruleForm.classification,
          }});
          this.dialogVisible_transfer = false;
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

    handleClose_transfer() {
      this.dialogVisible_transfer = false;
      this.$refs["ruleForm"].resetFields();
    },

    message(tag, data) {
      switch (tag.dataType) {
        case GETPTZC:
          if (data.ret === 0) {
            this.tableData = data.data;
          }
          break;
        case GETTBQQ: //划转结果
          if (data.ret === 0) {
            this.$msg({ title: "成功", message: "划转成功", type: "success" });
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
</style>
