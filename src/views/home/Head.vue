<template>
  <!-- 头部 -->
  <div class="head">
    <!-- 上层头部 -->
    <div class="head_top">
      <div class="head_top_left">
        <!-- 收缩展开侧栏导航点击图标 -->
        <i class="el-icon-s-grid isCollapse" @click="collapseClick()" title="收缩/展开"></i>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <!-- :to="{ path: '/user/yhxx' }" -->
          <el-breadcrumb-item v-for="(item,index) in breadlist" :key="index">{{item.meta.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="head_top_right">
        <!-- 消息 -->
        <!-- <div>
          <el-badge is-dot class="item">
            <i class="el-icon-bell bell"></i>
          </el-badge>
        </div>-->
        <!-- 用户头像 -->
        <!-- <div class="user_img">
          <img src="@/assets/icon_four.png" alt />
        </div>-->
        <!-- 下拉菜单 -->
        <div>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{mgreal}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="xgmm">修改密码</el-dropdown-item>
              <!-- <el-dropdown-item command="tcdl" divided>退出登录</el-dropdown-item> -->
              <el-dropdown-item command="tcdl" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!-- 下层头部 -->
    <!-- <div class="head_bottom">
      <div class="head_bottom_left">
        <el-tag
          v-for="tag in tags"
          :key="tag.name"
          closable
          :type="tag.type"
          @close="handleClose(tag)"
        >{{tag.name}}</el-tag>
      </div>
      <div class="head_bottom_right">
        <i class="el-icon-refresh"></i>
      </div>
    </div>-->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogFormVisible"
      @close="closexgmm"
      :close-on-click-modal="false"
    >
      <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
        <el-form-item label="输入原密码" prop="oldPass" label-width="83px">
          <el-input
            type="password"
            placeholder="请填写原密码"
            v-model="ruleForm.oldPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="输入新密码" prop="newPass" label-width="83px">
          <el-input
            type="password"
            placeholder="请填写4~16位数新密码"
            v-model="ruleForm.newPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass" label-width="83px">
          <el-input
            type="password"
            placeholder="请再次确认新密码"
            v-model="ruleForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel()">取 消</el-button>
        <el-button size="mini" type="primary" @click="entry()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { XGMM ,LOGINOUT} from "@/constant";
import Service from "@/http.js";
import { resetRouter } from "@/router/router";
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("原密码不能为空"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!/^[0-9a-zA-Z]+$/.test(value)) {
        callback(new Error("只能输入英文和数字"));
      } else if (!/^\w{4,16}$/.test(value)) {
        callback(new Error("长度必须在4~16位"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (!/^[0-9a-zA-Z]+$/.test(value)) {
        callback(new Error("只能输入英文和数字"));
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      breadlist: [], //面包屑
      tags: [
        //
        { name: "标签一", type: "info" },
        { name: "标签二", type: "info" },
        { name: "标签三", type: "info" }
      ],
      mgreal:'',
      dialogFormVisible: false,
      ruleForm: {
        oldPass: "",
        newPass: "",
        checkPass: ""
      },

      rules: {
        newPass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        oldPass: [{ validator: checkAge, trigger: "blur" }]
      }
    };
  },
  components: {},
  watch: {
    $route() {
      this.getBread();
    }
  },
  mounted() {
    this.getBread();
    this.$register(this);
    this.msg = [XGMM,LOGINOUT];
    let mgreal = JSON.parse(localStorage.getItem('mgreal'))
    if(mgreal){
      this.mgreal = JSON.parse(localStorage.getItem('mgreal'))
    }else{
      this.mgreal = '个人账户'
    }
  },
  computed: {
    // 菜单栏
    menuItems() {
      return this.$store.state.routerData;
    }
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "xgmm":
          this.dialogFormVisible = true;
          break;
        case "tcdl":
          this.message({"dataType":LOGINOUT})
          break;
      }
    },
    cancel() {
      this.dialogFormVisible = false;
      this.ruleForm.oldPass = "";
      this.ruleForm.newPass = "";
      this.ruleForm.checkPass = "";
    },
    closexgmm() {
      this.$refs["ruleForm"].resetFields();
    },
    entry() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          // 地址：/user/manage/save_up
          // 方式 POST
          // 参数：vpass1 第一次密码 vpass2确认密码 id 数据id    lever选择模板
          // 返回
          //  {"res":200,"msg":""}
          this.$api.updataPass({
            tag: {
              dataType: XGMM,
              ypwd: this.ruleForm.oldPass,
              inputPwd1: this.ruleForm.newPass,
              inputPwd: this.ruleForm.checkPass
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    message(tag, data) {
      switch (tag.dataType) {
        case XGMM:
          if (data.ret === 0) {
            this.dialogFormVisible = false;
            this.ruleForm.oldPass = "";
            this.ruleForm.newPass = "";
            this.ruleForm.checkPass = "";

            localStorage.removeItem("token");
            localStorage.removeItem("router");
            localStorage.removeItem("models");
            this.$router.push({
              path: "/login",
              query: {
                resirect: location.hostname
              }
            });
          }
          break;

          case LOGINOUT:

                      // 退出登陆 清除用户资料
          // localStorage.removeItem("token");
          // localStorage.removeItem("router");
          // localStorage.removeItem("models");
          localStorage.clear();
          // 重设路由
          resetRouter();
          //1 跳转到登陆页 2 清空登陆状态
          this.$store.commit("setLoginOut");
          Service.getInstance().setToken("");

          this.$router.push("/login");
            break;
      }
    },
    collapseClick() {
      //控制侧栏导航横向展开收缩
      this.$store.commit("setIsCollapse", !this.$store.state.isCollapse);
    },
    handleClose(tag) {
      //关闭标签
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
    getBread() {
      this.breadlist = this.$route.matched;
      this.$route.matched.forEach((item, index) => {
        //先判断父级路由是否是空字符串或者meta是否为首页，直接复写路径到根路径
        // if(this.$route.matched.indexOf(item.meta.title)==1){
        //   this.breadlist.push(arr[i]);
        // }
      });
    }
  }
};
</script>

<style lang="less">
.head {
  // height: 80px;
  color: #333333;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
  .head_top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    padding: 0 20px;
    box-sizing: border-box;
    div {
      display: flex;
      align-content: space-between;
      align-items: center;
    }
    .head_top_left {
      display: flex;
      align-items: center;
      .isCollapse {
        margin-right: 15px;
        &:hover {
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .head_top_right {
      div {
        margin-left: 20px;
      }
      .item {
        &:hover {
          cursor: pointer;
        }
        .bell {
          font-size: 20px;
        }
      }
      .user_img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #ddd;
        .user_avatar {
          width: 100%;
        }
        img {
          width: 100%;
        }
      }
      .el-dropdown-link {
        cursor: pointer;
      }
      .el-icon-arrow-down {
        font-size: 12px;
      }
    }
  }
  .head_bottom {
    border-top: 1px solid hsla(0, 0%, 90.2%, 0.5);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 30px;
    .head_bottom_left {
      height: 24px;
      .el-tag {
        height: 24px;
        line-height: 24px;
        margin-right: 10px;
      }
    }
  }

  /deep/.el-dialog {
    width: 510px;
    .el-dialog__header {
      padding: 19px;
      border-bottom: 1px solid #e4e5e8;
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
</style>
