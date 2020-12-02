<!--平台资产账户-->
<template>
  <div class="ptzczh">
    <div class="w_menu">
      <el-button
        type="primary"
        class="buttons"
        @click="addVersion"
        v-if="$store.state.qx.applistadd"
      >添加版本记录</el-button>
    </div>
    <div class="w_c">
      <el-table :data="tableData" style="width:100%">
        <el-table-column prop="created_time" label="版本发布日期" min-width="100px">
          <template slot-scope="scope">
            <span>{{getYMDHMS(scope.row.created_time)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="os_type" label="安装包类型" min-width="60px">
          <template slot-scope="scope">
            <span>{{scope.row.os_type===1?'安卓APP':'IOSAPP'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="数字版本号(R)" min-width="60px"></el-table-column>
        <el-table-column prop="version_string" label="版本号(V)" min-width="50px"></el-table-column>
        <el-table-column prop="file_name" label="安装包名称" min-width="120px"></el-table-column>
        <el-table-column prop="content" label="更新内容" min-width="120px"></el-table-column>
        <el-table-column prop="create_admin" label="操作人" min-width="80px"></el-table-column>
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
      title="添加版本记录"
      :visible.sync="dialogVisible"
      width="510px"
      class="version-dialog"
      @close="handleClose"
    >
      <!-- <div class="uploaddisplay">
        <el-upload
          ref="upload"
          class="upload"
          :action="actionUrl"
          :data="uploadData"
          :file-list="fileList"
          accept=".apk, .APK"
          :limit="1"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :before-upload="beforeAvatarUpload"
          :auto-upload="false"
        >
          <div>
            <el-button slot="trigger" size="small" type="primary">选择安装包</el-button>
          </div>
          <div slot="tip" class="el-upload__tip"></div>
        </el-upload>
      </div>-->
      <el-form
        :rules="rules"
        ref="ruleForm"
        :model="ruleForm"
        label-position="top"
        class="form-item"
      >
        <el-form-item label="版本发布日期" prop="time" label-width="120px">
          <el-date-picker
            v-model="ruleForm.time"
            value-format="yyyy-MM-dd HH:mm:SS"
            type="datetime"
            placeholder="请选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="数字版本号(R)" prop="rversion" label-width="120px">
          <el-input v-model="ruleForm.rversion" placeholder="请输入数字版本号" clearable></el-input>
        </el-form-item>
        <el-form-item label="版本号(V)" prop="version" label-width="120px">
          <el-input v-model="ruleForm.version" placeholder="请输入版本号" clearable></el-input>
        </el-form-item>
        <el-form-item label="完整下载地址" prop="address" label-width="120px">
          <el-input v-model="ruleForm.address" placeholder="请输入下载地址" clearable></el-input>
        </el-form-item>
        <el-form-item label="更新内容" prop="describe">
          <el-input
            v-model="ruleForm.describe"
            type="textarea"
            placeholder="最多可输入 120个字符。"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" :loading="uploading" type="primary" @click="dialogOkClick">确定</el-button>
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
    let validaterversion = (rule, value, callback) => {
      if (value === "" || value == null) {
        callback(new Error("数字版本号不能为空 "));
      } else if (!/^([1-9]|\+?[1-9][0-9]*)$/.test(value)) {
        callback(new Error("只可以输入正整数"));
      } else {
        callback();
      }
    };
    let validate_http = (rule, value, callback) => {
      let reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      if (!reg.test(value)) {
        return callback(new Error("链接格式不正确"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        time: new Date(),
        version: "",
        rversion: "",
        address: "",
        describe: ""
      },
      rules: {
        time: {
          type: "date",
          required: true,
          message: "请选择日期",
          trigger: "change"
        },
        version: [
          { required: true, validator: validateversion, trigger: "blur" }
        ],
        rversion: [
          { required: true, validator: validaterversion, trigger: "blur" }
        ],
        address: [
          { required: true, validator: validate_http, trigger: "blur" }
        ],
        describe: [
          //   { required: true, message: "请输入更新内容", trigger: "blur" },
          {
            max: 120,
            message: "最多可输入 120个字符",
            trigger: "blur"
          }
        ]
      },
      uploading: false,
      actionUrl: "",
      fileList: [],
      uploadData: {},
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
    this.actionUrl = config.url + "/upload/v1/manager/app";
  },
  computed: {},
  methods: {
    beforeAvatarUpload(file) {
      var fileName = new Array();
      fileName = file.name.split(".");
      const extension = fileName[fileName.length - 1] === "apk";
      const extension1 = fileName[fileName.length - 1] === "APK";
      if (!extension && !extension1) {
        this.$msg({
          message: "只支持上传安卓安装包",
          type: "warning"
        });
      } else {
        let time = parseInt(new Date().getTime() / 1000) + "";
        let sin = md5(
          md5(config.secretKey) + time
        );
        this.uploadData["sign"] = sin;
        this.uploadData["ts"] = time;
      }

      return extension;
    },
    uploadSuccess(response, file, fileList) {
      this.$refs.upload.clearFiles();
      if (response.ret === 0) {
        this.$api.addVersionRecords({
          tag: {
            dataType: ADDVERSIONCONFIGLIST,
            content: this.ruleForm.describe,
            version: Number(this.ruleForm.rversion),
            version_string: this.ruleForm.version,
            file_name: response.data,
            created_time: parseInt(this.ruleForm.time.getTime() * 0.001)
          }
        });
      } else {
        this.uploading = false;
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
        message: "上传失败，请重试",
        type: "error"
      });
    },
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
          // if (this.$refs.upload.uploadFiles.length > 0) {
          //   if (this.beforeAvatarUpload(this.$refs.upload.uploadFiles[0])) {
          //     this.uploading = true;
          //     this.$refs.upload.submit();
          //   } else {
          //     this.$refs.upload.clearFiles();
          //   }
          // } else {
          //   this.$msg({
          //     title: "错误",
          //     message: "请选择需要上传的安装包",
          //     type: "error"
          //   });
          // }
          this.$api.addVersionRecords({
            tag: {
              dataType: ADDVERSIONCONFIGLIST,
              content: this.ruleForm.describe,
              version: Number(this.ruleForm.rversion),
              version_string: this.ruleForm.version,
              file_name: this.ruleForm.address,
              created_time: parseInt(this.ruleForm.time.getTime() * 0.001)
            }
          });
        }
      });
    },
    handleClose() {
      this.$refs["ruleForm"].resetFields();
      this.dialogVisible = false;
    },
    addVersion() {
      this.ruleForm.time = new Date();
      this.dialogVisible = true;
    },
    getData() {
      this.$api.getVersionList({
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
          this.uploading = false;
          if (data.ret === 0) {
            this.dialogVisible = false;
            this.getData();
            this.$msg({
              title: "成功",
              message: "添加成功",
              type: "success"
            });
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
<style lang="less">
.version-dialog {
  .el-dialog__body {
    width: 80%;
    margin: 0 auto;
    padding: 10px 20px;
  }
  .el-form-item {
    text-align: left;
    line-height: 20px;
    .el-form-item__label {
      line-height: 20px;
    }
  }
}
</style>
<style lang="less" scoped>
.uploaddisplay {
  width: 100%;
  display: flex;
  text-align: left;
  padding-bottom: 10px;
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
