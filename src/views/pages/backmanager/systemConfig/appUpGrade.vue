<!--平台资产账户-->
<template>
  <div class="ptzczh">
    <div class="w_menu">
      <el-button
        type="primary"
        class="buttons"
        @click="addCoinfig"
        v-if="$store.state.qx.appcontrol"
      >版本控制</el-button>
      <el-button
        type="primary"
        class="buttons"
        @click="lishi"
        v-if="$store.state.qx.applist"
      >版本记录</el-button>
    </div>
    <div class="w_c">
      <el-table :data="tableData" style="width:100%">
        <el-table-column prop="created_time" label="更新时间">
          <template slot-scope="scope">
            <span>{{getYMDHMS(scope.row.created_time)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="min_version" label="最小支持版本(V)"></el-table-column>
        <el-table-column prop="max_version" label="最大支持版本(V)"></el-table-column>
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
      :close-on-click-modal="false"
      title="版本控制"
      :visible.sync="dialogVisible"
      width="510px"
      @close="handleClose"
    >
      <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
        <el-form-item label="最小支持版本(V)" prop="minversion" label-width="120px">
          <el-input v-model="ruleForm.minversion" placeholder="最小支持的版本号" clearable></el-input>
        </el-form-item>
        <el-form-item label="最大支持版本(V)" prop="maxversion" label-width="120px">
          <el-input v-model="ruleForm.maxversion" placeholder="最大支持的版本号" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="dialogOkClick">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { ADDVERSIONCONFIGLIST, GETVERSIONCONFIGLIST } from "@/constant";
export default {
  data() {
    let validateversion = (rule, value, callback) => {
      if (value === "" || value == null) {
        callback(new Error("版本号不能为空 "));
      } else if (!/^[.0-9]+$/.test(value)) {
        callback(new Error("只可以输入正整数及英文小数点"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        minversion: "",
        maxversion: ""
      },
      rules: {
        minversion: [{ validator: validateversion, trigger: "blur" }],
        maxversion: [{ validator: validateversion, trigger: "blur" }]
      },
      dialogVisible: false,
      tableData: [],
      datatotal: 0, //总数据条数
      currentPageNum: 10, //每页默认10条
      currentPage: 1 //当前页
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [GETVERSIONCONFIGLIST, ADDVERSIONCONFIGLIST];
    this.getData();
  },
  computed: {},
  methods: {
    getYMDHMS(timestamp) {
      let time = new Date(timestamp * 1000);
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
    dialogOkClick() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.$api.addVersionConfig({
            tag: {
              dataType: ADDVERSIONCONFIGLIST,
              min_version:this.ruleForm.minversion,
              max_version:this.ruleForm.maxversion
            }
          });
          this.dialogVisible = false;
        }
      });
    },
    handleClose() {
      this.$refs["ruleForm"].resetFields();
      this.dialogVisible = false;
    },
    lishi() {
      this.$router.push({
        path: "/systemConfig/versionRecords"
      });
    },
    addCoinfig() {
      this.dialogVisible = true;
    },
    getData() {
      this.$api.getGradeList({
        tag: {
          dataType: GETVERSIONCONFIGLIST,
          pageNo: this.currentPage,
          pagesize: this.currentPageNum
        }
      });
    },
    message(tag, data) {
      switch (tag.dataType) {
        case GETVERSIONCONFIGLIST:
          if (data.ret === 0) {
            this.tableData = data.data.list;
            this.datatotal = data.data.total;
          }
          break;
        case ADDVERSIONCONFIGLIST:
          if(data.ret === 0){
            this.$msg({
              title: "成功",
              message: "添加成功",
              type: "success"
            });
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
  height: 100%;
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
