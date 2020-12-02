<!--用户信息详情-->
<template>
  <div class="userinfo">
    <div class="dc1">
      <div class="dc1_left" style="line-height:50px">
        <!-- <div>下载地址:{{'https://www.basecoin.pro/download'}}</div> -->
        <div>
          <span>安卓APP安装包</span>
          <!-- <el-button
            v-if="$store.state.qx.bcproandroidupload"
            type="primary"
            class="buttons"
            @click="apkUpload"
          >上传安装包</el-button>-->
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
            :auto-upload="true"
          >
            <div>
              <el-button slot="trigger" size="small" type="primary">上传安装包</el-button>
            </div>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="dc2">
      <span class="dc2_title">操作记录</span>
      <el-table :data="opData" style="width:100%">
        <el-table-column prop="created_time" label="上传日期" min-width="120">
          <template slot-scope="scope">
            <span>{{getYMDHMS(scope.row.created_time)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="os_type" label="安装包类型" min-width="50">
          <template slot-scope="scope">
            <span>{{scope.row.os_type===1?'安卓APP':'IOSAPP'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="安装包名称" min-width="50"></el-table-column>
        <el-table-column prop="link" label="下载地址" min-width="50"></el-table-column>
        <el-table-column prop="create_admin" label="操作人" min-width="50"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import Label from "@/components/label";
import { GETOPERATELIST } from "@/constant";
export default {
  data() {
    return {
      opData: [],
      uploading: false,
      actionUrl: "",
      fileList: [],
      uploadData: {}
    };
  },
  components: {
    Label: Label
  },
  mounted() {
    this.$register(this);
    this.msg = [GETOPERATELIST];
    this.getData();
    this.actionUrl = config.url + "/managers/v1/manager/app/upload";
  },
  computed: {},
  methods: {
    beforeAvatarUpload(file) {
      var fileName = new Array();
      fileName = file.name.split(".");
      console.log(fileName)
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
        this.$msg({
          title: "成功",
          message: "上传成功",
          type: "successful"
        });
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
      this.$msg({
          title: "失败",
          message: "上传失败，请重试",
          type: "error"
        });
    },
    getData() {
      this.$api.getVersionList({
        tag: {
          dataType: GETOPERATELIST,
          // pageNo: this.currentPage,
          // pagesize: this.currentPageNum
        }
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
    apkUpload() {},
    message(tag, data) {
      switch (tag.dataType) {
        case GETOPERATELIST:
          if (data.ret === 0) {
            this.opData = data.data;
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
.userinfo {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dc(@h: 28px) {
  display: flex;
  padding: 20px 0px;
  box-sizing: border-box;
  border-bottom: 1px solid#F0F2F5;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
}
.dc1 {
  .dc(100px);
  justify-content: flex-start;
  .dc1_left {
    padding-right: 100px;
    text-align: left;
  }
}
.dc2 {
  .dc2_title {
    display: block;
    text-align: left;
    height: 30px;
    line-height: 30px;
    flex-shrink: 0;
    box-sizing: border-box;
    font-weight: 900;
    width: 100%;
  }
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.dc3 {
  .dc3_title {
    display: block;
    text-align: left;
    height: 30px;
    line-height: 30px;
    flex-shrink: 0;
    box-sizing: border-box;
    font-weight: 900;
    width: 100%;
  }
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.dc4 {
  .dc4_title {
    display: inline-block;
    width: 100%;
    text-align: left;
    height: 30px;
    line-height: 30px;
    flex-shrink: 0;
    box-sizing: border-box;
    font-weight: 900;
  }
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.w_menu {
  width: 100%;
  flex-shrink: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding-bottom: 10px;
}

.buttons {
  margin-left: 30px;
}
</style>
