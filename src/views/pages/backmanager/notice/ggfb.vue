<!--公告发布-->
<template>
  <div class="withdraw">
    <div class="w_c">
      <div class="article_title">
        <span>文章标题：</span>
        <el-input style="width:280px;" v-model="articleTitle" placeholder="请输入内容"></el-input>
        <span class="zhuyi_span">最多输入28个字符，最少输入4个字符；</span>
      </div>
      <div class="article_content">
        <p>正文：</p>
        <div style=" width:100%;">
          <!-- 图片上传组件辅助-->
          <el-upload
            v-show="false"
            id="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            name="file"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="beforeUpload"
            enctype="multipart/form-data"
          ></el-upload>

          <!--富文本编辑器组件-->
          <el-row v-loading="quillUpdateImg">
            <quill-editor v-model="detailContent" ref="myQuillEditor" :options="editorOption"></quill-editor>
          </el-row>
        </div>
        <div class="handle_div">
          <!-- <el-button class="buttons" @click="cancel()">取消</el-button> -->
          <el-button type="primary" class="buttons" @click="entry()">发布</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { quillEditor } from "vue-quill-editor"; //调用编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
// 工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["link", "image", "video"],
  ["clean"] // remove formatting button
];
import { Notification } from "element-ui";
import { GETXGZJGG } from "@/constant";
export default {
  data() {
    return {
      quillUpdateImg: false,
      detailContent: "", // 富文本内容
      editorOption: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function(value) {
                if (value) {
                  document.querySelector("#avatar-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        }
      }, // 富文本编辑器配置

      datatotal: 0, //总数据条数
      currentPageNum: 10, //每页默认10条
      currentPage: 1, //当前页

      detailContent: "", // 富文本内容
      articleTitle: "", //文章标题

      disabledFB: false
    };
  },
  mounted() {
    this.$register(this);
    this.msg = [GETXGZJGG];
  },
  components: {
    quillEditor
  },
  computed: {},
  methods: {
    cancel() {},
    entry() {
      if (!this.articleTitle) {
        this.$msg({
          title: "警告",
          message: "请填写文章标题",
          type: "warning"
        });
        return false;
      }
      // let res = /^[\u4e00-\u9fff]{4,28}$/   !res.test(this.articleTitle)
      if (this.articleTitle.length > 28 || this.articleTitle.length < 4) {
        this.$msg({
          title: "警告",
          message: "文章标题请输入4-28个字符",
          type: "warning"
        });
        return false;
      }
      if (!this.detailContent) {
        this.$msg({
          title: "警告",
          message: "请填写文本内容",
          type: "warning"
        });
        return false;
      }
      this.$confirm("是否添加该公告?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.getData();
        })
        .catch(() => {
          this.$msg({
            type: "info",
            message: "已取消发布",
            title: "提示"
          });
        });
    },

    getData() {
      this.$api.getAddupNotice({
        tag: {
          dataType: GETXGZJGG,
          type: 1,
          title: this.articleTitle,
          abstract: "",
          content: this.detailContent,
          content_en: "",
          abstract_en: "",
          title_en: "",
          id: 0
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case GETXGZJGG:
          if (data.ret == 0) {
            this.$msg({
              title: "成功",
              message: "发布成功",
              type: "success"
            });
            this.$router.push("/notice/gglb");
          }
          break;
      }
    },

    // 上传图片前
    beforeUpload(res, file) {
      console.log("上传图片前");
      // 显示loading动画
      this.quillUpdateImg = true;
    },
    // 上传图片成功
    uploadSuccess(res, file) {
      console.log("上传图片成功");
      var self = this;
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = self.$refs.myQuillEditor.quill;
      console.log(quill);
      // 如果上传成功
      if (res.statusCode === "200" && res.result !== null) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, "image", self.$Api.imgUrlBase + res.result);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$msg.error({
          title: "错误",
          message: "图片插入失败"
        });
      }
      // loading动画消失
      this.quillUpdateImg = false;
    },
    // 上传图片失败
    uploadError(res, file) {
      console.log("上传图片失败");
      console.log(res);
      // loading动画消失
      this.quillUpdateImg = false;
      this.$msg.error({
        title: "错误",
        message: "图片插入失败"
      });
    }
  },

  beforeDestroy() {
    this.$unRegister(this);
  }
};
</script>

<style lang="less" scoped>

.buttons {
  margin-left: 30px;
}

.withdraw {
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .w_c {
    width: 100%;
    flex-grow: 1;
    box-sizing: border-box;
    display: flex;
    align-self: center;
    align-items: flex-start;
    flex-direction: column;
    justify-content: flex-start;
    .article_title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      white-space: nowrap;
      width: 100%;
      .zhuyi_span {
        font-size: 14px;
        padding-left: 10px;
      }
    }
    .article_content {
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      p {
        margin: 10px 0 5px;
      }

      /deep/ .quill-editor .ql-toolbar {
        text-align: left;
      }
      /deep/ .quill-editor .ql-container {
        min-height: 350px !important;
        .ql-editor{
          min-height: 350px !important;
        }
      }
    }
    .handle_div {
      width: 100%;
      padding-top: 10px;
      text-align: right;
      .el-button{
        margin: 0;
      }
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
  align-items: center;
  justify-content: center;
}

.dialogstip {
  color: red;
  padding: 20px 10px;
}
</style>
