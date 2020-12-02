<!--账号列表-->
<template>
  <div class="zhlb">
    <div class="w_menu">
      <span class="searchTitle">UID</span>
      <el-input
        v-model="input"
        @keyup.native="number"
        placeholder="请输入UID"
        class="inputw"
        clearable
      ></el-input>
      <el-button type="primary" class="buttons" @click="search">搜索</el-button>
      <el-button
        class="tjzhbtn"
        type="primary"
        v-if="$store.state.qx.nontop"
        @click="addAgent"
      >开通非顶层代理</el-button>
    </div>

    <div class="w_c">
      <el-table :data="tableData" style="width:100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="userid" label="UID"></el-table-column>
        <el-table-column prop="name" label="用户名" min-width="120px"></el-table-column>
        <!-- <el-table-column prop="totalcomm" label="累计返佣金额" min-width="120px"></el-table-column>
        <el-table-column prop="agentrebateratio" label="返佣比例">
          <template slot-scope="scope">
            <span>{{scope.row.agentrebateratio+'%'}}</span>
          </template>
        </el-table-column>-->
        <el-table-column prop="agentnumbers" label="子节点数"></el-table-column>
        <el-table-column prop="invitecode" label="邀请码"></el-table-column>
        <el-table-column prop="usercreattime" label="注册时间" min-width="120px">
          <template slot-scope="scope">
            <span>{{scope.row.usercreattime.substring(0,scope.row.usercreattime.indexOf(" "))}}</span>
            <br />
            <span>{{scope.row.usercreattime.substring(scope.row.usercreattime.indexOf(" "))}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="regtime" label="开通代理时间" min-width="120px">
          <template slot-scope="scope">
            <span>{{scope.row.regtime.substring(0,scope.row.regtime.indexOf(" "))}}</span>
            <br />
            <span>{{scope.row.regtime.substring(scope.row.regtime.indexOf(" "))}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop
          v-if="$store.state.qx.bcproagenthistory || $store.state.qx.bcproagentupdate || $store.state.qx.bcproagentupdate1 || $store.state.qx.bcproagentupdate2"
          label="操作"
          :width="getw"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              v-if="$store.state.qx.bcproagentupdate"
              @click="updateAgent(scope.row)"
            >修改返佣</el-button>
            <el-button
              type="primary"
              size="mini"
              v-if="$store.state.qx.bcproagenthistory"
              @click="agentDetails(scope.row)"
            >查看详情</el-button>
            <el-button
              type="primary"
              size="mini"
              v-if="$store.state.qx.bcproagentupdate1"
              @click="handlezhmm(scope.row)"
            >重置密码</el-button>
            <el-button
              type="primary"
              size="mini"
              v-if="$store.state.qx.bcproagentupdate2"
              @click="handleggmm(scope.row)"
            >重置谷歌验证</el-button>
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
      title="开通代理"
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false"
      @close="addcloseclick"
      width="40%"
      :before-close="addhandleClose"
    >
      <el-form :rules="addRules" ref="addRuleForm" :model="addRuleForm">
        <div class="dialogc">
          <div class="zhdiv">
            <el-form-item label="代理UID" prop="userid" label-width="125px">
              <div style="display:flex">
                <el-input v-model="addRuleForm.userid"></el-input>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </div>
            </el-form-item>
            <el-form-item label="代理姓名" prop="name" label-width="125px">
              <div style="display:flex">
                <el-input v-model="addRuleForm.name"></el-input>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </div>
            </el-form-item>
            <el-form-item label="代理返佣比例" prop="ratio" label-width="125px">
              <div style="display:flex">
                <el-input v-model="addRuleForm.ratio"></el-input>
                <span>&nbsp;%</span>
              </div>
            </el-form-item>
            <el-form-item label="最高可设置代理返佣比例" label-width="175px">
              <span class="spanblock nameinput">84%</span>
            </el-form-item>
            <el-form-item label="最低可设置代理返佣比例" label-width="175px">
              <span class="spanblock nameinput">30%</span>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addDialogOkClick">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改代理设置"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="closeclick"
      width="40%"
      :before-close="handleClose"
    >
      <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
        <div class="dialogc">
          <div class="zhdiv">
            <el-form-item label="代理UID" label-width="125px">
              <span class="spanblock nameinput">{{dialogData?dialogData.userid:"--"}}</span>
            </el-form-item>
            <el-form-item label="代理用户名" label-width="125px">
              <span class="spanblock nameinput">{{dialogData?dialogData.name:"--"}}</span>
            </el-form-item>
            <el-form-item label="代理姓名" label-width="125px">
              <span
                class="spanblock nameinput"
              >{{dialogData&&dialogData.realname?dialogData.realname:"--"}}</span>
            </el-form-item>
            <el-form-item label="代理返佣比例" prop="agentrebateratio" label-width="125px">
              <div style="display:flex">
                <el-input v-model="ruleForm.agentrebateratio"></el-input>
                <span>&nbsp;%</span>
              </div>
            </el-form-item>
            <el-form-item label="最高可设置代理返佣比例" label-width="175px">
              <span class="spanblock nameinput">85%</span>
            </el-form-item>
            <el-form-item label="最低可设置代理返佣比例" label-width="175px">
              <span class="spanblock nameinput">30%</span>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="dialogOkClick">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { AGENTLIST, ADDAGENT, UPDATEAGENT, GETPARENTUID } from "@/constant";
export default {
  data() {
    let validatename = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      } else if (!/^[0-9]+$/.test(value)) {
        callback(new Error("只能输入数字"));
      } else if (!/^\w{1,14}$/.test(value)) {
        callback(new Error("长度最多14位"));
      } else {
        callback();
      }
    };
    let validateagentratio1 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("返佣比例不能为空"));
      } else if (!/^[0-9]+$/.test(value)) {
        callback(new Error("只能输入正整数"));
      } else if (value > 84) {
        callback(new Error("最高可设置代理返佣比例84%"));
      } else if (value < 30) {
        callback(new Error("最低可设置代理返佣比例30%"));
      } else {
        callback();
      }
    };
    let validateagentratio = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("返佣比例不能为空"));
      } else if (!/^[0-9]+$/.test(value)) {
        callback(new Error("只能输入正整数"));
      } else if (value > 85) {
        callback(new Error("最高可设置代理返佣比例85%"));
      } else if (value < 30) {
        callback(new Error("最低可设置代理返佣比例30%"));
      } else {
        callback();
      }
    };
    let validateusername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("姓名不能为空"));
      } else if (!/^[A-Za-z0-9\u4e00-\u9fa5]{1,20}$/.test(value)) {
        callback(new Error("只能输入中文/英文/数字,最多20个字符"));
      } else {
        callback();
      }
    };
    let validateuserid = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("UID不能为空"));
      } else if (!/^[1-9]\d*$/.test(value)) {
        callback(new Error("只能输入正整数"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      dialogVisibleType: 1,
      addDialogVisible: false,
      addDialogData: null,
      dialogData: null,
      datatotal: 0, //总数据条数
      currentPageNum: 10, //每页默认10条
      currentPage: 1, //当前页
      agentoptions: [
        { title: "30%", value: 30 },
        { title: "40%", value: 40 },
        { title: "50%", value: 50 },
        { title: "60%", value: 60 },
        { title: "70%", value: 70 }
      ],
      input: "",
      tableData: [],
      parentuid: "",
      ruleForm: {
        agentrebateratio: ""
      },
      rules: {
        agentrebateratio: [{ validator: validateagentratio, trigger: "blur" }]
      },
      addRuleForm: {
        ratio: "",
        name: "",
        userid: ""
      },
      addRules: {
        ratio: [{ validator: validateagentratio1, trigger: "blur" }],
        userid: [{ validator: validateuserid, trigger: "blur" }],
        name: [{ validator: validateusername, trigger: "blur" }]
      }
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [AGENTLIST, ADDAGENT, UPDATEAGENT, GETPARENTUID];
    this.getData();
  },
  computed: {
    getw() {
      let w = 80;
      if (this.$store.state.qx.bcproagenthistory) {
        w += 100;
      }
      if (this.$store.state.qx.bcproagentupdate) {
        w += 100;
      }
      if (this.$store.state.qx.bcproagentupdate1) {
        w += 100;
      }
      if (this.$store.state.qx.bcproagentupdate2) {
        w += 100;
      }
      return w;
    }
  },
  methods: {
    addDialogOkClick() {
      this.$refs["addRuleForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认开通吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.addDialogVisible = false;
              this.$api.addNontopAgent({
                tag: {
                  dataType: ADDAGENT,
                  uid: this.addRuleForm.userid,
                  relname: this.addRuleForm.name,
                  agentrebateratio: Number(this.addRuleForm.ratio)
                }
              });
            })
            .catch(() => {});
        }
      });
    },
    addAgent() {
      this.addDialogVisible = true;
    },
    addhandleClose() {
      this.addDialogVisible = false;
      this.addcloseclick();
    },
    addcloseclick() {
      this.$refs["addRuleForm"].resetFields();
    },
    closeclick() {
      this.$refs["ruleForm"].resetFields();
    },
    search() {
      this.currentPage = 1;
      this.getData();
    },

    handleSizeChange(val) {
      this.currentPageNum = val;
      this.getData();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    getData() {
      this.$api.getAgentList({
        tag: {
          dataType: AGENTLIST,
          uid: this.input,
          pageNo: this.currentPage,
          pagesize: this.currentPageNum
        }
      });
    },
    agentDetails(v) {
      // this.$alert('敬请期待', '代理详情', {
      //     confirmButtonText: '确定'
      //   });
      this.$router.push({
        path: "/agent/agentInfo",
        query: v
      });
    },
    //修改分组
    updateAgent(v) {
      this.ruleForm.agentrebateratio = v.agentrebateratio;
      this.dialogData = v;
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
      this.closeclick();
    },

    dialogOkClick() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          //修改分组
          this.$confirm("确认修改吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.dialogVisible = false;
              this.$api.updateAgent({
                tag: {
                  dataType: UPDATEAGENT,
                  uid: this.dialogData.userid,
                  type: 3,
                  inviteparent: this.dialogData.inviteparent,
                  agentrebateratio: Number(this.ruleForm.agentrebateratio)
                }
              });
            })
            .catch(() => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //重置账号密码
    handlezhmm(v) {
      this.$confirm("确认重置账号密码吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api.updateAgent({
            tag: {
              dataType: UPDATEAGENT,
              uid: v.userid,
              type: 1,
              invitedrebateratio: v.invitedrebateratio,
              agentrebateratio: v.agentrebateratio
            }
          });
        })
        .catch(() => {});
    },

    //重置谷歌密码
    handleggmm(v) {
      this.$confirm("确认重置谷歌密码吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api.updateAgent({
            tag: {
              dataType: UPDATEAGENT,
              uid: v.userid,
              type: 2,
              invitedrebateratio: v.invitedrebateratio,
              agentrebateratio: v.agentrebateratio
            }
          });
        })
        .catch(() => {});
    },

    toDaye(v) {
      let t = new Date(v * 1000);
      let y = t.getFullYear();
      let m = t.getMonth() + 1;
      let d = t.getDate();
      let h = t.getHours();
      let s = t.getMinutes();
      let c = t.getSeconds();
      let tt =
        y +
        "-" +
        (m < 10 ? "0" + m : m) +
        "-" +
        (d < 10 ? "0" + d : d) +
        " " +
        (h < 10 ? "0" + h : h) +
        ":" +
        (s < 10 ? "0" + s : s) +
        ":" +
        (c < 10 ? "0" + c : c);
      return tt;
    },
    number() {
      this.input = this.input.replace(/[^\.\d]/g, "");
      this.input = this.input.replace(".", "");
    },
    message(tag, data) {
      switch (tag.dataType) {
        case AGENTLIST:
          if (data.ret === 0) {
            this.tableData = (data.data.list && data.data.list) || [];
            this.datatotal = Number(data.data.total);
          }
          break;
        case ADDAGENT:
          if (data.ret === 0) {
            this.dialogVisible = false;
            this.$msg({ title: "成功", message: "添加成功", type: "success" });
            this.getData();
          }
          break;
        case UPDATEAGENT:
          if (data.ret === 0) {
            this.dialogVisible = false;
            this.$msg({ title: "成功", message: "修改成功", type: "success" });
            this.getData();
          }
          break;
        case GETPARENTUID:
          if (data.ret === 0) {
            this.parentuid = data.data.uid;
          }
          break;
      }
    },

    onChange() {
      this.zhname = this.zhname.replace(/[\W]/g, "");
    }
  },

  beforeDestroy() {
    this.$unRegister(this);
  }
};
</script>

<style lang="less" scoped>
.spanblock {
  display: inline-block;
  text-align: left;
}
.nameinput {
  width: 200px;
}
.zhdiv {
  padding: 10px 10px;
}
.inputw {
  width: 150px;
  padding-right: 30px;
}
.buttons {
  margin-left: 30px;
}

.tjzhbtn {
  position: absolute;
  z-index: 10;
  right: 20px;
  top: 10px;
  flex-shrink: 0;
  // width: 105px;
  align-self: flex-end;
}
.zhlb {
  position: relative;
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
