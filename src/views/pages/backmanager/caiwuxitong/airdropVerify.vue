<!--提现审核-->
<template>
  <div class="withdraw">
    <div class="w_menu">
      <span class="searchTitle">状态</span>
      <el-select v-model="selectedv" placeholder="请选择" class="inputs">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-date-picker
        v-model="time"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>

      <el-button type="primary" class="buttons" @click="search">搜索</el-button>
    </div>
    <div class="w_c">
      <el-table :data="tableData" stripe border>
        <!-- <el-table-column type="index"></el-table-column> -->
        <el-table-column prop="apply_time" fixed label="空投申请时间" min-width="180px"></el-table-column>
        <el-table-column prop="examine_time" resizable label="处理时间" min-width="180px">
          <template slot-scope="scope">
            <span>{{scope.row.stats>0?scope.row.examine_time:'--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="coinname" resizable label="币种" min-width="85"></el-table-column>
        <el-table-column prop="amount" resizable label="空投总数" min-width="130"></el-table-column>
        <el-table-column prop label="状态" resizable>
          <template slot-scope="scope">
            <span>{{getStatus(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="apply_name" label="申请人" resizable>
          <!-- <template slot-scope="scope">
            <span>{{getCzr(scope.row)}}</span>
          </template>-->
        </el-table-column>
        <el-table-column prop="operator" label="审核人" resizable>
          <template slot-scope="scope">
            <span>{{getCzr(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" fixed="right" :width="getw">
          <template slot-scope="scope">
            <div style="display:flex">
              <el-button
                type="primary"
                size="mini"
                v-if="$store.state.qx.bcproairdropdownload"
                @click="handleDownload(scope.row)"
              >下载空投数据</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handletg(scope.row)"
                v-if="scope.row.stats == 0 && $store.state.qx.bcprousercashaudit1"
              >通过</el-button>
              <el-button type="primary" size="mini" @click="handleck(scope.row)">查看</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handlejj(scope.row)"
                v-if="scope.row.stats == 0 && $store.state.qx.bcprousercashaudit2"
              >拒绝</el-button>
            </div>
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
        :total="datatotal"
      ></el-pagination>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="510px"
      height="320px"
      :before-close="handleClose"
    >
      <div class="dialogc">
        <Label
          :title="'空投币种：'"
          :value="dialogData.coinname"
          titleWidth="120px"
          valueWidth="300px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <!-- <Label :title="'手机号：'"     :value="dialogData.phone" titleWidth="120px" valueWidth="300px" labelContainer = "defaultLabelC" labelTitle = "Labeltblack" labelContext = "Labelvblack" ></Label> -->
        <Label
          :title="'空投数量：'"
          :value="dialogData.amount"
          titleWidth="120px"
          valueWidth="300px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <Label
          :title="'空投人数：'"
          :value="dialogData.numbers"
          titleWidth="120px"
          valueWidth="300px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <Label
          :title="'空投申请时间：'"
          :value="dialogData.apply_time"
          titleWidth="120px"
          valueWidth="300px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <Label
          :title="'空投通过时间：'"
          :value="dialogData.examine_time"
          v-if="dialogData.stats == 1 && dialogType == 2"
          titleWidth="120px"
          valueWidth="300px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <Label
          :title="'空投拒绝时间：'"
          :value="dialogData.examine_time"
          v-if="dialogData.stats == 2 && dialogType == 2"
          titleWidth="120px"
          valueWidth="300px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <Label
          :title="'状态：'"
          :value="getStatus(dialogData)"
          titleWidth="120px"
          valueWidth="300px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <Label
          :title="'空投申请人：'"
          :value="dialogData.apply_name"
          titleWidth="120px"
          valueWidth="300px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <Label
          :title="'空投审核人：'"
          :value="getCzr(dialogData)"
          titleWidth="120px"
          valueWidth="300px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <div style="width:100%;text-align:left;">
          <el-button
            size="mini"
            type="primary"
            @click="getFailedList(dialogData)"
            v-if="dialogData.fail_numbers>0 && dialogType === 2"
          >空投失败查看</el-button>
        </div>
        <Label
          :title="'空投备注：'"
          :value="dialogData.mark"
          titleWidth="120px"
          valueWidth="300px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <span class="dialogstip" v-if="dialogData.stats == 0 && dialogType != 2">确认信息无误后请谨慎操作</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false" v-if="dialogType != 2">取 消</el-button>
        <el-button size="mini" type="primary" @click="dialogOkClick">{{dialogOkBtn}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="空投失败"
      :visible.sync="dialogFailedVisible"
      width="510px"
      :close-on-click-modal="false"
    >
      <el-table
        :data="failedData"
        border
        stripe
        style="width:100%"
        :cell-style="{ height: '30px' }"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="userid" label="失败UID"></el-table-column>
        <el-table-column prop="amount" label="失败数量"></el-table-column>
      </el-table>
      <div class="w_page">
        <el-pagination
          @size-change="handleFailSizeChange"
          @current-change="handleFailChange"
          :current-page="failPage"
          :page-size="5"
          layout="total, prev, pager, next, jumper"
          :total="failtotal"
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="dialogFailedVisible=false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Label from "@/components/label";
import {
  GETWITHDRAW,
  TGWITHDRAW,
  JJWITHDRAW,
  BCOTCAIRDROPFAILLIST
} from "@/constant";
import { type } from "os";
var Long = require("long");
export default {
  data() {
    return {
      input: "",
      time: [],
      selectedv: -1,
      datatotal: 0, //总数据条数
      failtotal: 0,
      currentPageNum: 10, //每页默认10条
      currentPage: 1, //当前页
      failPageNum: 5, //每页默认10条
      failPage: 1, //当前页
      dialogVisible: false,
      dialogFailedVisible: false,
      dialogType: 1, // 1通过 2查看 3拒绝
      dialogOkBtn: "确认通过",
      dialogData: {},
      dialogTitle: "查看",
      failedData: [],
      options: [
        { value: -1, label: "全部状态" },
        { value: 0, label: "空投申请" },
        { value: 1, label: "空投通过" },
        { value: 2, label: "空投拒绝" }
      ],

      tableData: []
    };
  },
  components: {
    Label: Label
  },
  mounted() {
    this.$register(this);
    this.msg = [GETWITHDRAW, TGWITHDRAW, JJWITHDRAW, BCOTCAIRDROPFAILLIST];
    this.time.push(this.getYesDay());
    this.time.push(this.getNowDate());
    this.getData();
  },
  computed: {
    getw() {
      let isSq = false;
      if (this.tableData) {
        for (let i = 0, il = this.tableData.length; i < il; i++) {
          if (this.tableData[i].stats == 0) {
            isSq = true;
            break;
          }
        }
      }

      let w = 110;
      if (isSq && this.$store.state.qx.bcprousercashaudit1) {
        w += 50;
      }
      if (isSq && this.$store.state.qx.bcprousercashaudit2) {
        w += 50;
      }
      if (this.$store.state.qx.bcproairdropdownload) {
        w += 110;
      }
      return w;
    }
  },
  methods: {
    handleDownload(v) {
      window.open(config.url+'/managers/v1/manager/bcproairdropdown?filename='+v.suburl);
    },

    getStatus(row) {
      if (this.options) {
        for (let i = 0, il = this.options.length; i < il; i++) {
          if (row.stats == this.options[i].value) {
            return this.options[i].label;
          }
        }
      }

      return "无";
    },

    getCzr(row) {
      if (row.stats == 0) {
        return "暂无";
      } else {
        return row.examine_name ? row.examine_name : "【系统自动】";
      }
    },

    search() {
      this.currentPage = 1;
      this.getData();
    },

    handletg(v) {
      this.dialogData = v;
      this.dialogType = 1;
      this.dialogTitle = "通过";
      this.dialogVisible = true;
      this.dialogOkBtn = "确认通过";
    },

    handleck(v) {
      this.dialogData = v;
      this.dialogType = 2;
      this.dialogTitle = "查看";
      this.dialogVisible = true;
      this.dialogOkBtn = "关闭";
    },

    handlejj(v) {
      this.dialogData = v;
      this.dialogType = 3;
      this.dialogTitle = "拒绝";
      this.dialogVisible = true;
      this.dialogOkBtn = "确认拒绝";
    },

    handleClose() {
      this.dialogVisible = false;
    },

    dialogOkClick() {
      this.dialogVisible = false;
      if (this.dialogType === 1) {
        //通过请求
        this.$api.bcotcairdropcheck({
          tag: {
            dataType: TGWITHDRAW,
            ttype: 1,
            Upid: this.dialogData.id
          }
        });
      } else if (this.dialogType === 3) {
        //拒绝请求
        this.$api.bcotcairdropcheck({
          tag: {
            dataType: JJWITHDRAW,
            ttype: 2,
            Upid: this.dialogData.id
          }
        });
      } else {
        //查看无操作
      }
    },
    handleFailSizeChange(val) {
      this.failPageNum = val;
      this.getFailedData();
    },

    handleFailChange(val) {
      this.failPage = val;
      this.getFailedData();
    },
    handleSizeChange(val) {
      this.currentPageNum = val;
      this.getData();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
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
    getYesDay() {
      var time = new Date().getTime() - 24 * 60 * 60 * 1000;
      var yesday = new Date(time); // 获取的是前一天日期
      return (
        yesday.getFullYear() +
        "-" +
        (yesday.getMonth() >= 9
          ? yesday.getMonth() + 1
          : "0" + (yesday.getMonth() + 1)) +
        "-" +
        (yesday.getDate() > 9 ? yesday.getDate() : "0" + yesday.getDate())
      );
    },
    getData() {
      let starttime = null,
        stoptime = null;
      if (this.time) {
        if (this.time.length === 2) {
          starttime = this.time[0];
          stoptime = this.time[1] + " 23:59:59";
        } else if (this.time.length === 1) {
          starttime = this.time[0];
        }
        console.log(this.time.length);
      } else {
        console.log("没有选择任何时间");
      }
      this.$api.getAirdropList({
        tag: {
          dataType: GETWITHDRAW,
          star: starttime,
          end: stoptime,
          pageNo: this.currentPage,
          pagesize: this.currentPageNum,
          ttype: this.selectedv
        }
      });
    },
    getFailedList(v) {
      this.dialogFailedVisible = true;
      this.getFailedData();
    },
    getFailedData() {
      this.failedData = [];
      this.$api.bcotcairdropfaillist({
        tag: {
          dataType: BCOTCAIRDROPFAILLIST,
          pid: this.dialogData.id,
          pageNo: this.failPage,
          pagesize: this.failPageNum
        }
      });
    },
    message(tag, data) {
      switch (tag.dataType) {
        case GETWITHDRAW:
          if (data.ret === 0) {
            let _data = data.data;
            this.tableData = (_data.list && _data.list) || [];
            this.datatotal = Number(data.data.total);
          }
          break;
        case TGWITHDRAW:
          if (data.ret == 0) {
            this.$msg({
              type: "success",
              message: "已确认通过",
              title: "成功"
            });
            this.getData();
          }
          break;
        case JJWITHDRAW:
          if (data.ret == 0) {
            this.$msg({
              type: "success",
              message: "已确认拒绝",
              title: "成功"
            });
            this.getData();
          }
          break;
        case BCOTCAIRDROPFAILLIST:
          if (data.ret === 0) {
            this.failedData = (data.data.list && data.data.list) || [];
            this.failtotal = Number(data.data.total);
          }
          break;
      }
    },
    //只能输入正整数的验证
    number() {
      this.input = this.input.replace(/[^\.\d]/g, "");
      this.input = this.input.replace(".", "");
    }
  },

  beforeDestroy() {
    this.$unRegister(this);
  }
};
</script>

<style lang="less" scoped>
.inputw {
  width: 150px;
  padding-right: 30px;
}

.inputs {
  padding-right: 30px;
}

.buttons {
  margin-left: 30px;
}

.withdraw {
  width: 100%;
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

  /deep/.el-dialog {
    width: 510px;
    .el-dialog__header {
      padding: 19px;
      border-bottom: 1px solid #e4e5e8;
      text-align: left;
    }
    .el-dialog__body {
      width: 80%;
      margin: 0 auto;
    }
    .el-dialog__footer {
      padding: 10px;
      border-top: 1px solid #e4e5e8;
    }
    .input_div {
      position: absolute;
      left: 0;
      top: 0;
    }
    .el-input__inner {
      outline: none;
      text-shadow: 0 0 0 transparent;
    }
    .banner-box {
      text-align: center;
    }
  }
}

.dialogc {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dialogstip {
  color: red;
  font-size: 12px;
  width: 100%;
  text-align: right;
  padding: 20px 0px;
}

</style>
