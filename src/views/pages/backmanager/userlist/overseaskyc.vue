<!--认证审核-->
<template>
  <div class="withdraw">
    <div class="w_menu">
      <span class="searchTitle">UID</span>
      <el-input
        v-model="input"
        @keyup.native="number"
        placeholder="请输入UID"
        class="inputw"
        clearable
      ></el-input>

      <span class="searchTitle">状态</span>
      <el-select v-model="selectedv" placeholder="请选择" class="inputs">
        <el-option
          v-for="(item,index) in options"
          :key="index"
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
      <el-table :data="tableData" style="width:100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="create_at" label="申请时间" min-width="92">
          <template slot-scope="scope">
            <span>{{scope.row.create_at.substring(0,scope.row.create_at.indexOf(" "))}}</span>
            <br />
            <span>{{scope.row.create_at.substring(scope.row.create_at.indexOf(" "))}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="billid_s" label="订单编号" min-width="120"></el-table-column>
        <el-table-column prop="user_id" label="UID" min-width="85"></el-table-column>
        <el-table-column prop="country_cn" label="国家地区" min-width="85"></el-table-column>
        <el-table-column prop label="状态">
          <template slot-scope="scope">
            <span>{{getStatus(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approvedtime" label="处理时间" min-width="95"></el-table-column>
        <el-table-column prop label="操作" :width="getw">
          <template slot-scope="scope">
            <div style="display:flex">
              <el-button
                type="primary"
                size="mini"
                @click="handleCheck(scope.row)"
                v-if="scope.row.state == 1 && $store.state.qx.bcupverifyhistory"
              >审核</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handleck(scope.row)"
                v-if="scope.row.state == 5 || scope.row.state == 6 || scope.row.state == 0"
              >查看</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handlereset(scope.row)"
                v-if="(scope.row.state == 5 || scope.row.state == 6) && $store.state.qx.bcupverifyreset"
              >重置</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人">
          <template slot-scope="scope">
            <span>{{getCzr(scope.row)}}</span>
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
      width="560px"
      height="320px"
      :before-close="handleClose"
    >
      <div class="dialogc">
        <Label
          :title="'国家地区：'"
          :value="dialogData.country_cn+'  +'+dialogData.area_code"
          titleWidth="90px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <Label
          :title="'UID：'"
          :value="dialogData.user_id"
          titleWidth="90px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <Label
          :title="'用户名：'"
          :value="dialogData.user_name"
          titleWidth="90px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <Label
          :title="'名：'"
          :value="dialogData.forename"
          titleWidth="90px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <Label
          :title="'姓：'"
          :value="dialogData.surname"
          titleWidth="90px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <Label
          :title="'证件号码：'"
          :value="dialogData.id_number"
          titleWidth="90px"
          valueWidth="200px"
          labelContainer="defaultLabelC"
          labelTitle="Labeltblack"
          labelContext="Labelvblack"
        ></Label>
        <div class="certificates">
          <span>提交证件图片:</span>
          <el-image :src="dialogData.id_photo" :preview-src-list="srcList">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </div>
        <div class="certificates">
          <div class="contant">
            <span class="title">出生日期:</span>
            <el-date-picker
              v-model="birthday"
              @change="birthdayChange"
              type="date"
              v-if="dialogData.state === 1"
              placeholder="请选择出生日期"
            ></el-date-picker>
            <span v-if="dialogData.state !== 1">{{dialogData.birthday}}</span>
            <!-- <span v-if="dialogData.state === 6">认证通过</span>
            <span v-if="dialogData.state === 0">已重置</span> -->
          </div>
        </div>
        <div class="certificates">
          <div class="contant">
            <span class="title">当前年龄:</span>
            <span v-if="dialogData.state === 1">{{age}}</span>
            <span v-else>{{dialogData.age}}</span>
          </div>
        </div>
        <div class="selectgroup" v-if="dialogData.state === 1">
          <el-select v-model="selectedResult" placeholder="请选择审核结果" class="inputs">
            <el-option
              v-for="(item,index) in resultOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-if="dialogData.state === 1 && selectedResult === 5"
            v-model="refuseReason"
            placeholder="请选择拒绝原因"
          >
            <el-option
              v-for="(item,index) in reasonOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="certificates" v-if="dialogData.state !== 1">
          <div class="contant">
            <span class="title">认证状态:</span>
            <span>{{getStatus(dialogData)}}</span>
          </div>
          <div class="contant" v-if="dialogData.state == 0">
            <span class="title">重置人:</span>
            <span>{{dialogData.ckeck_operator}}</span>
          </div>
          <div class="contant">
            <span class="title">审核结果:</span>
            <span>{{dialogData.state===0?'已重置':(dialogData.state===5?'审核拒绝':'审核通过')}}</span>
          </div>
          <div class="contant">
            <span class="title">审核人:</span>
            <span>{{dialogData.operator}}</span>
          </div>
          <div class="contant" v-if="dialogData.state === 5">
            <span class="title">拒绝理由:</span>
            <span>{{dialogData.err_info}}</span>
          </div>
        </div>
        <!-- <span class="dialogstip" v-if="dialogData.status == 1 && dialogType != 2">确认信息无误后请谨慎操作</span> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false" v-if="dialogType == 1">取 消</el-button>
        <el-button size="mini" type="primary" @click="dialogOkClick">{{dialogOkBtn}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Label from "@/components/label";
import { GETWITHDRAW, TGWITHDRAW, BCPROHEDGEWARNSWITCH } from "@/constant";
import { type } from "os";
var Long = require("long");
export default {
  data() {
    return {
      input: "",
      time: [],
      age: "--",
      selectedv: -1,
      datatotal: 0, //总数据条数
      currentPageNum: 10, //每页默认10条
      currentPage: 1, //当前页
      dialogVisible: false,
      dialogType: 1, // 1通过 2查看 3拒绝
      dialogOkBtn: "确认",
      dialogData: {},
      dialogTitle: "查看",
      birthday: null,
      srcList: [],
      options: [
        { value: -1, label: "全部状态" },
        { value: 1, label: "认证申请" },
        { value: 6, label: "认证通过" },
        { value: 5, label: "认证拒绝" },
        { value: 0, label: "已重置" }
      ],
      resultOptions: [
        { value: 6, label: "审核通过" },
        { value: 5, label: "审核拒绝" }
      ],
      reasonOptions: [
        {
          value: 1101,
          label: "*证件信息不清晰，证件信息不支持扫描和复印，仅支持原件照片"
        },
        {
          value: 1102,
          label: "*年龄未满18周岁，认证仅支持年满18周岁的成年用户"
        },
        { value: 1103, label: "*年龄超过75周岁，认证仅支持75周岁以下的用户" },
        { value: 1104, label: "*姓名与证件信息不一致" },
        { value: 1105, label: "*证件信息与注册时的国家地区不一致" }
      ],
      refuseReason: null,
      selectedResult: null,
      tableData: []
    };
  },
  components: {
    Label: Label
  },
  mounted() {
    this.$register(this);
    this.msg = [GETWITHDRAW, TGWITHDRAW, BCPROHEDGEWARNSWITCH];
    this.time.push(this.getYesDay());
    this.time.push(this.getNowDate());
    this.getData();
  },
  computed: {
    getw() {
      let isSq = false;
      if (this.tableData) {
        for (let i = 0, il = this.tableData.length; i < il; i++) {
          if (this.tableData[i].state !== 1) {
            isSq = true;
            break;
          }
        }
      }

      let w = 100;
      if (isSq && this.$store.state.qx.bcupverifyhistory) {
        w += 49;
      }
      if (isSq && this.$store.state.qx.bcupverifyreset) {
        w += 49;
      }
      return w;
    }
  },
  methods: {
    birthdayChange() {
      if (this.birthday) {
        let now = new Date();
        let time = now.getTime() - this.birthday.getTime();
        if (time <= 0) {
          this.$msg({
            type: "error",
            message: "出生日期要在当前日期之前",
            title: "错误"
          });
        } else {
          this.age = Math.floor((time * 0.001) / (60 * 60 * 24 * 365));
        }
      }
    },
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

    getStatus(row) {
      //认证状态: 0-未认证 1-身份信息认证中 2-身份信息认证失败 3-身份信息认证通过 4-人脸信息认证中 5-人脸信息认证失败 6-人脸信息认证通过，7-认证重置
      let result = "";
      switch (row.state) {
        case 0:
          result = "已重置";
          break;
        case 1:
          result = "认证申请";
          break;
        case 2:
          result = "身份信息认证失败";
          break;
        case 3:
          result = "身份信息认证通过";
          break;
        case 4:
          result = "人脸信息认证中";
          break;
        case 5:
          result = "认证拒绝";
          break;
        case 6:
          result = "认证通过";
          break;
      }
      return result;
    },

    getCzr(row) {
      if (row.state == 1) {
        return "暂无";
      } else {
        let approver;
        if (row.state === 1) {
          approver = "--.--";
        } else if (row.state === 0) {
          approver = row.ckeck_operator;
        } else {
          approver = row.operator;
        }
        return approver;
      }
    },

    search() {
      this.currentPage = 1;
      this.getData();
    },

    handleCheck(v) {
      this.dialogData = v;
      this.birthday = null;
      this.age = '--';
      this.selectedResult = null;
      this.refuseReason = null;
      this.srcList = [v.id_photo];
      this.dialogType = 1;
      this.dialogTitle = "认证资料";
      this.dialogVisible = true;
      this.dialogOkBtn = "确认";
    },

    handleck(v) {
      this.dialogData = v;
      this.srcList = [v.id_photo];
      this.dialogType = 2;
      this.dialogTitle = "认证资料";
      this.dialogVisible = true;
      this.dialogOkBtn = "关闭";
    },

    handlereset(v) {
      this.$confirm("请确认是否重置当前认证？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.$api.bcupverifyreset({
            tag: {
              dataType: BCPROHEDGEWARNSWITCH,
              stats: 0,
              upid: v.id,
              uid: v.user_id
            }
          });
        })
        .catch(action => {});
    },

    handleClose() {
      this.dialogVisible = false;
    },

    dialogOkClick() {
      this.dialogVisible = false;
      if (this.dialogType === 1) {
        if (this.birthday == null) {
          this.$msg({
            type: "error",
            message: "请选择出生日期",
            title: "错误"
          });
          return;
        }
        if (this.selectedResult == null) {
          this.$msg({
            type: "error",
            message: "请选择审核结果",
            title: "错误"
          });
          return;
        }
        if (this.selectedResult == 5 && this.refuseReason == null) {
          this.$msg({
            type: "error",
            message: "请选择拒绝原因",
            title: "错误"
          });
          return;
        }
        if ((this.age < 18 || this.age > 75) && this.selectedResult == 6) {
          this.$msg({
            type: "error",
            message: "年龄不符合要求，请拒绝该认证请求",
            title: "错误"
          });
          return;
        }
        this.$api.bcupverifyhistory({
          tag: {
            dataType: TGWITHDRAW,
            uid: this.dialogData.user_id,
            stats: this.selectedResult,
            upid: this.dialogData.billid_s,
            errcode: this.selectedResult === 6 ? 0 : this.refuseReason,
            errmsg:
              this.selectedResult === 6
                ? ""
                : this.reasonOptions.find(v => v.value === this.refuseReason)
                    .label,
            birthday: this.getYMDHMS(this.birthday.getTime()),
            age: this.age
          }
        });
      }
    },
    getYMDHMS(timestamp) {
      let time = new Date(timestamp);
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let date = time.getDate();
      let hours = time.getHours();
      let minute = time.getMinutes();
      let second = time.getSeconds();

      if (month < 10) {
        month = "0" + month;
      }
      if (date < 10) {
        date = "0" + date;
      }
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minute < 10) {
        minute = "0" + minute;
      }
      if (second < 10) {
        second = "0" + second;
      }
      return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hours +
        ":" +
        minute +
        ":" +
        second
      );
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
      this.$api.bcverifyhistorylist({
        tag: {
          dataType: GETWITHDRAW,
          uid: this.input,
          ttype: this.selectedv,
          star: starttime,
          end: stoptime,
          pageNo: this.currentPage,
          pagesize: this.currentPageNum
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case GETWITHDRAW:
          if (data.ret === 0) {
            let _data = data.data;
            this.tableData =
              (_data.list &&
                _data.list.map(v => {
                  v.billid_s = v.id.toString();
                  if (v.state === 1) {
                    v.approvedtime = "--.--";
                  } else if (v.state === 0) {
                    v.approvedtime = v.identity_update_at;
                  } else {
                    v.approvedtime = v.face_update_at;
                  }
                  return v;
                })) ||
              [];
            this.datatotal = Number(data.data.total);
          }
          break;
        case TGWITHDRAW:
          if (data.ret == 0) {
            this.$msg({
              type: "success",
              message: "审核成功",
              title: "成功"
            });
            this.getData();
          }
          break;
        case BCPROHEDGEWARNSWITCH:
          if (data.ret == 0) {
            this.$msg({
              type: "success",
              message: "重置成功",
              title: "成功"
            });
            this.getData();
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
  width: 150px;
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
  // align-items: center;
  justify-content: center;
}

.dialogstip {
  color: red;
  font-size: 12px;
  width: 490px;
  text-align: left;
  padding: 20px 0px;
}
.selectgroup {
  display: flex;
}
.image-slot{
  margin: 50% auto;
}
.certificates {
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: left;
  .el-image {
    width: 350px;
    height: 200px;
    padding: 5px 0px;
  }
  span {
    height: 20px;
    line-height: 20px;
    font-size: 15px;
    color: black;
    padding: 3px 0px;
  }
  .contant {
    width: 100%;
    display: flex;
    align-items: center;
    .title {
      height: 40px;
      line-height: 40px;
      font-size: 15px;
      color: black;
      padding: 3px 0px;
      width: 90px;
    }
  }
}
</style>
