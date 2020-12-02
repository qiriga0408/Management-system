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
      <span class="searchTitle">类型</span>
       <el-select v-model="typeSelected" placeholder="请选择类型" class="inputs" >
        <el-option   v-for="(item,index) in typeData"  :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button type="primary" class="buttons" @click="search">搜索</el-button>
      <!-- <el-button class="tjzhbtn" type="primary"  v-if="$store.state.qx.manageadd" @click="addAgent">添加经纪人</el-button> -->
    </div>

    <div class="w_c">
      <el-table :data="tableData" style="width:100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="userid" label="UID"></el-table-column>
        <el-table-column prop="name" label="用户名" min-width="180px"></el-table-column>
        <el-table-column prop="isagent" label="类型">
          <template slot-scope="scope">
            <span>{{scope.row.isagent===1?'代理':'普通直推'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="invitecode" label="邀请码"></el-table-column>
        <el-table-column prop="createdtime" label="注册时间" min-width="180px"></el-table-column>
        <el-table-column
          prop
          v-if="$store.state.qx.bcproagenthistory || $store.state.qx.bcproagentupdate || $store.state.qx.bcproagentupdate1 || $store.state.qx.bcproagentupdate2"
          label="操作"
          :width="getw"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini" :disabled="scope.row.isagent===1"
              v-if="$store.state.qx.bcproagentupdate"
              @click="updateAgent(scope.row)"
            >{{scope.row.isagent===1?'已开代理':'开通代理'}}</el-button>
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
              <span class="spanblock nameinput">{{dialogData?dialogData.userid:""}}</span>
            </el-form-item>
            <el-form-item label="代理用户名" label-width="125px">
              <span class="spanblock nameinput">{{dialogData?dialogData.name:""}}</span>
            </el-form-item>
            <el-form-item label="代理姓名" prop="name" label-width="125px">
              <div style="display:flex"><el-input v-model="ruleForm.name"></el-input><span>&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
            </el-form-item>
            <el-form-item label="代理返佣比例" prop="ratio" label-width="125px">
              <div style="display:flex"><el-input v-model="ruleForm.ratio"></el-input><span>&nbsp;%</span></div>
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
        return callback(new Error("姓名不能为空"));
      } else if (!/^[A-Za-z0-9\u4e00-\u9fa5]{1,20}$/.test(value)) {
        callback(new Error("只能输入中文/英文/数字,最多20个字符"));
      } else {
        callback();
      }
    };
    let validateatio = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("返佣比例不能为空"));
      } else if (!/^[0-9]+$/.test(value)) {
        callback(new Error("只能输入正整数"));
      } else if (value>85) {
        callback(new Error("最高可设置代理返佣比例85%"));
      } else if (value<30) {
        callback(new Error("最低可设置代理返佣比例30%"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      dialogData: null,
      datatotal: 0, //总数据条数
      currentPageNum: 10, //每页默认10条
      currentPage: 1, //当前页
      input: "",
      typeSelected:0,
      typeData:[{label:'全部',value:0},{label:'普通直推',value:1},{label:'代理',value:2}],
      tableData: [],
      parentuid: "",
      ruleForm: {
        ratio: "",
        name:''
      },
      rules: {
        ratio: [
          { validator: validateatio, trigger: "blur" }
        ],
        name: [
          { validator: validatename, trigger: "blur" }
        ]
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
      return w;
    }
  },
  methods: {
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
      this.$api.getTopAgentList({
        tag: {
          dataType: AGENTLIST,
          uid: this.input,
          ttype:this.typeSelected,
          pageNo: this.currentPage,
          pagesize: this.currentPageNum
        }
      });
    },
    //修改分组
    updateAgent(v) {
      this.ruleForm.uid = v.userid;
      this.ruleForm.ratio = v.agentrebateratio;
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
            this.$confirm("确认开通吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.dialogVisible = false;
                this.$api.addAgent({
                  tag: {
                    dataType: UPDATEAGENT,
                    uid: this.dialogData.userid,
                    relname: this.ruleForm.name,
                    agentrebateratio: Number(this.ruleForm.ratio)
                  }
                });
              })
              .catch(() => {});
        }
      });
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
        case UPDATEAGENT:
          if (data.ret === 0) {
            this.dialogVisible = false;
            this.$msg({ title: "成功", message: data.msg, type: "success" });
            this.getData();
          }
          break;
      }
    },
  },

  beforeDestroy() {
    this.$unRegister(this);
  }
};
</script>

<style lang="less" scoped>
.inputs {
  margin-right: 20px;
  width: 200px;
}
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
