<!--合约配置 手续费-->
<template>
  <div class="lsjl">
    <div class="w_menu">
      <el-button
        v-if="$store.state.qx.bcprobannerupload"
        type="primary"
        class="buttons"
        @click="addbanner"
      >添加BANNER</el-button>
    </div>
    <div id="wcdiv_lsjl" class="w_c">
      <el-table
        :data="tableData"
        style="width:100%"
        sort-by="index"
        sortable
        :cell-style="{height:'60px','min-width':'300px'}"
      >
        <el-table-column min-width="300px">
          <template slot-scope="scope">
            <div class="titlediv">
              <span
                class="titleSpan"
                style="font-size:18px;font-weight:bold;"
              >文件名称:{{scope.row.title}}</span>
              <br />
              <span class="titleSpan">链接地址:{{scope.row.link}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" style="width:100px">
          <template slot-scope="scope">
            <div style="min-width:300px">
              <el-button
                v-if="$store.state.qx.bcprobannerup0"
                :disabled="!upBtnAble||scope.$index==0"
                type="primary"
                size="small"
                @click="sortBannerList(0,scope)"
              >{{scope.$index==0?"已到顶":"上移"}}</el-button>
              <el-button
                v-if="$store.state.qx.bcprobannerup0"
                :disabled="!downBtnAble||scope.$index==tableData.length-1"
                type="primary"
                size="small"
                @click="sortBannerList(1,scope)"
              >{{scope.$index==tableData.length-1?"已到底":"下移"}}</el-button>
              <el-button
                v-if="$store.state.qx.bcprobannerup1"
                plain
                size="small"
                @click="deleteBanner(scope.row)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="添加BANNER"
      :visible.sync="dialogVisible"
      width="710px"
      height="320px"
      :before-close="handleDialogClose"
    >
      <div class="dialogc">
        <div class="dialogc2">
          <el-divider class="devide" content-position="left">中文BANNER</el-divider>
          <div class="uploaddisplay">
            <el-upload
              :limit="1"
              :action="actionUrl"
              accept="image/png"
              drag
              :data="uploadData"
              :auto-upload="false"
              :on-error="uploadError"
              ref="uploadzh"
              :on-success="uploadSuccessZh"
              list-type="picture"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </el-upload>
            <div style="margin-left:10px">
              图片格式必须为png格式
              <br />最大可上传700kb
              <br />图片尺寸：1029*383
              <br />
            </div>
          </div>
          <el-divider class="devide" content-position="left">英文BANNER</el-divider>
          <div class="uploaddisplay">
            <el-upload
              :limit="1"
              :action="actionUrl"
              accept="image/png"
              drag
              :data="uploadData"
              :auto-upload="false"
              :on-error="uploadError"
              :on-success="uploadSuccessEn"
              ref="uploaden"
              list-type="picture"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </el-upload>
            <div style="margin-left:10px">
              图片格式必须为png格式
              <br />最大可上传700kb
              <br />图片尺寸：1029*383
              <br />
            </div>
          </div>
        </div>
        <div style="margin-top:20px">
          <el-form :rules="rules" ref="ruleFormmr" :model="ruleForm">
            <div class="divliang">
              <el-form-item label="中文BANNER指向链接" label-width="180px" prop="linkaddrzh">
                <el-input
                  class="w156"
                  placeholder="请输入链接地址"
                  v-model="ruleForm.linkaddrzh"
                  clearable
                ></el-input>
              </el-form-item>
            </div>
            <div class="divliang">
              <el-form-item label="英文BANNER指向链接" label-width="180px" prop="linkaddren">
                <el-input
                  class="w156"
                  placeholder="请输入链接地址"
                  v-model="ruleForm.linkaddren"
                  clearable
                ></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleDialogClose">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleDialogOkClick"
          :loading="uploading"
        >{{uploading?'上传中...':'确定'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  GETBANNERLIST,
  SORTBANNER,
  DELETEBANNER,
  ADDBANNER,
  BCPROBANNERUPLOAD
} from "@/constant";
export default {
  data() {
    let validate_http = (rule, value, callback) => {
      if (value === "") {
        callback();
      }
      let reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      if (!reg.test(value)) {
        return callback(new Error("链接格式不正确"));
      } else {
        callback();
      }
    };
    return {
      tableData: [],
      uploading: false,
      dialogVisible: false,
      upBtnAble: true,
      downBtnAble: true,
      uploadData: {},
      actionUrl:'',
      imageCn: "",
      ruleForm: {
        linkaddrzh: "",
        linkaddren: ""
      },
      rules: {
        linkaddrzh: [{ validator: validate_http, trigger: "blur" }],
        linkaddren: [{ validator: validate_http, trigger: "blur" }]
      },
      fileListzh: [],
      fileListen: []
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [
      GETBANNERLIST,
      SORTBANNER,
      DELETEBANNER,
      ADDBANNER,
      BCPROBANNERUPLOAD
    ];
    this.getData();
    
    this.actionUrl = config.url+'/managers/v1/manager/bcprobannerupload';
    // console.log(this.actionUrl)
  },
  computed: {},
  methods: {
    uploadError(error, file, fileList) {
      this.$refs.uploadzh.clearFiles();
      this.$refs.uploaden.clearFiles();
      this.uploading = false;
      this.$msg({
        title: "失败",
        message: "BANNER上传失败，请重新尝试",
        type: "error"
      });
    },
    beforeAvatarUpload(image) {
      let file = image.raw;
      const isPNG = file.type === "image/png";
      const isLt700K = file.size / 1024 < 700;
      if (!isPNG) {
        this.$message.error("上传图片只能是 PNG 格式!");
        this.uploading = false;
      }
      if (!isLt700K) {
        this.$message.error("上传图片大小不能超过 700K!");
        this.uploading = false;
      }
      return isPNG && isLt700K;
    },
    uploadSuccessEn(response, file, fileList) {
      this.$refs.uploaden.clearFiles();
      if (response.ret === 0) {
        this.$api.bcprobanneradd({
          tag: {
            dataType: ADDBANNER,
            title: this.imageCn?this.imageCn:response.data,
            image: this.imageCn,
            imageen: response.data,
            link: this.ruleForm.linkaddrzh,
            linken: this.ruleForm.linkaddren
          }
        });
        this.imageCn = "";
      } else {
        this.$msg({
          title: "失败",
          message: "英文BANNER上传失败，请重新尝试",
          type: "error"
        });
      }
    },
    uploadSuccessZh(response, file, fileList) {
      this.$refs.uploadzh.clearFiles();
      if (response.ret === 0) {
        if (this.$refs.uploaden.uploadFiles.length > 0) {
          this.imageCn = response.data;
          this.$refs.uploaden.submit();
        } else {
          // this.uploading = false;
          // this.imageCn = response.data;
          this.$api.bcprobanneradd({
            tag: {
              dataType: ADDBANNER,
              title: response.data,
              image: response.data,
              imageen: "",
              link: this.ruleForm.linkaddrzh,
              linken: ""
            }
          });
        }
      } else {
        this.uploading = false;
        this.$msg({
          title: "失败",
          message: "中文BANNER上传失败，请重新尝试",
          type: "error"
        });
      }
    },
    handleDialogOkClick() {
      this.$refs["ruleFormmr"].validate(valid => {
        if (valid) {
          let time = parseInt(new Date().getTime() / 1000) + "";
          let sin = md5(
            md5(config.secretKey) + time
          );
          this.uploadData["sign"] = sin;
          this.uploadData["ts"] = time;
          if (this.$refs.uploadzh.uploadFiles.length > 0) {
            if (this.beforeAvatarUpload(this.$refs.uploadzh.uploadFiles[0])) {
              if (this.$refs.uploaden.uploadFiles.length > 0) {
                if (
                  this.beforeAvatarUpload(this.$refs.uploaden.uploadFiles[0])
                ) {
                  this.uploading = true;
                  this.$refs.uploadzh.submit();
                } else {
                  this.$refs.uploaden.clearFiles();
                }
              } else {
                this.uploading = true;
                this.$refs.uploadzh.submit();
              }
            } else {
              this.$refs.uploadzh.clearFiles();
            }
          } else if (this.$refs.uploaden.uploadFiles.length > 0) {
            if (this.beforeAvatarUpload(this.$refs.uploaden.uploadFiles[0])) {
              this.uploading = true;
              this.$refs.uploaden.submit();
            }
          } else {
            this.$msg({
              title: "错误",
              message: "请选择需要上传的图片",
              type: "error"
            });
          }
        }
      });
    },
    handleDialogClose() {
      this.$refs.uploadzh.clearFiles();
      this.$refs.uploaden.clearFiles();
      this.$refs["ruleFormmr"].resetFields();
      this.dialogVisible = false;
    },
    getData() {
      this.tableData = [];
      //获取全部banner
      this.$api.getbcprobannerlist({
        tag: {
          dataType: GETBANNERLIST
        }
      });
    },
    addbanner() {
      if (this.tableData.length >= 5) {
        this.$msg({
          title: "警告",
          message: "BANNER最多可添加5个",
          type: "warning"
        });
        return;
      }
      this.imageCn = "";
      this.dialogVisible = true;
    },
    async sortBannerList(type, item) {
      let weight;
      if (type == 0) {
        //上移
        if (item.$index == 1) {
          weight = this.tableData[0].weight + 1;
        } else {
          weight =
            (this.tableData[item.$index - 1].weight +
              this.tableData[item.$index - 2].weight) *
            0.5;
        }
        this.upBtnAble = false;
      } else {
        if (item.$index == this.tableData.length - 2) {
          weight = this.tableData[this.tableData.length - 1].weight - 1;
        } else {
          weight =
            (this.tableData[item.$index + 1].weight +
              this.tableData[item.$index + 2].weight) *
            0.5;
        }
        this.downBtnAble = false;
      }
      await this.$api.bcprobannerup({
        tag: {
          dataType: SORTBANNER,
          id: item.row.id,
          weight: weight,
          type: 0
        }
      });
    },
    deleteBanner(v) {
      this.$confirm('请确认是否删除"' + v.title + '"', "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$api.bcprobannerup({
          tag: {
            dataType: DELETEBANNER,
            id: v.id,
            weight: v.weight,
            type: 1
          }
        });
      });
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log(file);
    },
    message(tag, data) {
      switch (tag.dataType) {
        case GETBANNERLIST:
          if (data.ret === 0) {
            this.tableData = data.data;
          }
          break;
        case SORTBANNER:
          if (data.ret === 0) {
            this.$msg({ title: "成功", message: "操作成功", type: "success" });
            this.upBtnAble = true;
            this.downBtnAble = true;
            this.getData();
          }
          break;
        case DELETEBANNER:
          if (data.ret === 0) {
            this.$msg({ title: "成功", message: "删除成功", type: "success" });
            this.getData();
          }
          break;
        case ADDBANNER:
          this.uploading = false;
          if (data.ret === 0) {
            this.$msg({ title: "成功", message: "上传成功", type: "success" });
            this.getData();
          }
          this.$refs["ruleFormmr"].resetFields();
          this.dialogVisible = false;
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
.uploaddisplay {
  width: 100%;
  display: flex;
}
.inputw {
  width: 180px;
  padding-right: 30px;
}
.titlediv{
  max-width: 70%;
  display: flex;
  flex-direction: column;
  line-height: 20px;
  .titleSpan {
    // max-width: 400px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.inputs {
  padding-right: 30px;
  width: 140px;
}

.buttons {
  margin-left: 30px;
}
.devide:not(:first-child) {
  font-size: 16px;
  margin-top: 60px;
}
.divliang {
  margin-bottom: 20px;
  //border: 1px solid #ff8866;
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
    justify-content: flex-end;
  }
  .w_c {
    width: 100%;
    // height: 100%;
    flex-grow: 1;
    box-sizing: border-box;
    display: flex;
    // align-items:center;
    justify-content: flex-start;
    .el-aside {
      background: none;
      color: #000;
      min-width: 400px;
      text-align: left;
      line-height: 25px;
      height: 60px;
      padding-left: 50px;
    }

    .el-main {
      background: none;
      color: #000;
      text-align: left;
      line-height: 58px;
      height: 60px;
      padding: 0;
    }
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  .spantitle {
    display: inline-block;
    width: 110px;
    text-align: left;
    padding-right: 20px;
    flex-shrink: 0;
  }
  .dialogc2 {
    display: block;
    width: 100%;
    padding-top: 10px;
    text-align: left;
  }
  .spanleft {
    padding-left: 80px;
  }
  .w156 {
    width: 380px;
  }

  .divfee {
    display: flex;
    align-items: center;
    padding-top: 20px;
    padding-bottom: 20px;
  }
}

.dialogstip {
  color: red;
  padding: 20px 10px;
}
</style>
