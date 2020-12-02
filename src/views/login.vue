<!--登录-->
<template>
  <div class="container">
    <p class="height_set"></p>
    <div class="main">
      <ul>
        <li class="first_information">welcome</li>
        <li :class="accountErr ? 'input_li error_display' : 'input_li'">
          <input-move
            :type="'text'"
            :pbText="'账号'"
            :errorText="accountErr"
            v-model="accountVal"
            @leaveInput="leaveAccInput"
          ></input-move>
        </li>
        <li class="input_li">
          <input-move
            :type="'password'"
            :pbText="'密码'"
            :errorText="passwordErr"
            v-model="passwordVal"
            @leaveInput="leavePassInput"
          ></input-move>
        </li>
        <li class="res_btn_li">
          <button @click="loginClick()" class="res_btn">登录</button>
        </li>
      </ul>
    </div>
    <el-dialog
      title="扫描下方谷歌二维码"
      width="510px"
      :visible.sync="dialogErWeiMa"
      @open="init()"
      :close-on-click-modal="false"
    >
      <div class="banner-box">
        <canvas ref="qrc" id="qrccode-canvas"></canvas>
        <p>{{ this.vkey }}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="entrySendewm()">下一步</el-button>
      </div>
    </el-dialog>

    <el-dialog
      @close="closexgmm"
      class
      title="输入谷歌二维码"
      width="510px"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
        <el-form-item label="验证码" prop="yzmVal" label-width="56px">
          <div class="sixcode_div">
            <el-input v-model="ruleForm.yzmVal" class="input_div" autocomplete="off" maxlength="6"></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="entrySendyzm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import inputMove from "@/components/inputMove.vue";
import Service from "@/http.js";
import { LOGINOK, GETDLYZ, LOGINOUT } from "../constant";
var QRCode = require("qrcode");
var canvas = "";
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("验证码不能为空"));
      } else {
        callback();
      }
    };
    return {
      tabActiveIdx: 0, //切换方式
      isChecked: true, //是否已阅读服务条款

      accountVal: "", //15600530060
      passwordVal: "", //123abc

      accountErr: "",
      passwordErr: "",

      dialogFormVisible: false, //用户输入验证码弹出对话框
      dialogErWeiMa: false, //二维码弹出框
      ruleForm: {
        yzmVal: "" //验证码
      },
      rules: {
        yzmVal: [{ validator: checkAge, trigger: "blur" }]
      },

      vkey: null //暂存vkey
    };
  },
  components: {
    inputMove
  },
  created() {
    window.scrollTo(0, 0);
    let that = this;
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        // console.log("登录回车事件");
        if (that.dialogErWeiMa) {
          //二维码
          that.entrySendewm();
        } else if (that.dialogFormVisible) {
          //输入框
          that.entrySendyzm();
        } else {
          //登录
          that.loginClick();
        }
      }
    };
  },

  mounted() {
    this.$register(this);
    this.msg = [LOGINOK, GETDLYZ, LOGINOUT];
  },
  methods: {
    closexgmm() {
      this.$refs["ruleForm"].resetFields();
    },
    leaveAccInput(val) {},
    leavePassInput(val) {},
    loginClick() {
      //登录操作
      if (!this.accountVal) {
        this.$msg.warning({ message: "请输入手机号/邮箱", title: "警告" });
        return false;
      }
      if (!this.passwordVal) {
        this.$msg.warning({ message: "请输入密码", title: "警告" });
        return false;
      }
      this.$api.login({
        tag: {
          dataType: LOGINOK,
          username: this.accountVal,
          pwd: this.passwordVal
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case LOGINOK:
          if (data.ret === 0){
            this.$store.commit("setLogin", {
              login: true,
              token: data.data.token
            });
            Service.getInstance().setToken(data.data.token);
            if (data.data.vkey == "") {
              //绑定谷歌验证 展示验证码输入界面
              this.dialogFormVisible = true;
            } else {
              //未绑定谷歌验证 展示绑定界面
              this.dialogErWeiMa = true;
              this.vkey = data.data.vkey;
            }
          }
          break;
        case GETDLYZ:
          // data.data.model_id = 1;
          if (data.ret === 0){
            this.dialogFormVisible = false;
            let objQX = {};
            // 获取权限信息
            // data.data.model_id = 1;
            if (data.data.model_id === 1) {
              objQX.iscg = true;
              objQX.models = {
                //公告管理
                bcpronoticelist: true, //查看 公告列表
                bcpronoticeupadd: true, //修改 公告列表
                bcpronoticedel: true, //删除 公告列表
                //用户数据
                bcprouserlist: true, //查看 用户信息
                bcprouserup: true, //编辑 用户编辑
                bcuserpionts: true,
                // 跟单管理
                tradersListLook: false, // 交易员列表 - 查看
                tradersListSet: false,  // 交易员列表 - 操作
                tradersReviewLook: false, // 交易员审核 - 查看
                tradersReviewAdd: false,  // 交易员审核 - 添加
                tradersReviewSet: false,  // 交易员审核 - 操作
                tradersOrdersLook: false,   // 交易员带单 - 查看
                tradersProfitLook: false, // 交易员分佣 - 查看
                followParameterSet: false, // 带单参数设置 - 操作
                //资产账户
                bcprouserwalletbill1: true, //财务记录
                bcprouserwalletbill2: true, //查看  资产账户-提现审核
                bcprousercashaudit1: true, //通过  资产账户-提现审核
                bcprousercashaudit2: true, //拒绝  资产账户-提现审核
                bcprocoinlist: true, //币种列表
                bcprocionupdate: true, //.币种修改
                bcprocionsetup: true, //币种设置
                bcprocommissiondetails: true, //邀请奖励-查看
                bcotcorderdaytotal: true,
                bcotcorderlist: true,
                bcpiontslist: true,
                //交易账户
                bcaccountlist: true, //财务记录
                bcproffundingfee: true, //资金费率历史
                bcprofitloss: true,
                bcprofunding: true, //资金费用扣除
                bcprocontractcoinlist: true, //保证金币种配置
                //按钮权限
                bcprocontractcoinset: true, //上下架
                bcprocontractcoinadd: true, //添加币种
                bcprocontractsort: true, //合约交易对排序
                bcprocontractset: true, //交易对配置
                //按钮权限
                bcprocontractset_onlinestatus: true, //上下架
                bcprocontractset_openorderenable: true, //开关开仓
                bcprocontractset_ispositions: true, //全部平仓
                bcprocontractset_islodge: true, //全部撤单
                bcprocontractadd: true, //添加/修改交易对配置

                bcprotraderhistory: true, //合约交易永续合约成交记录
                bcproconditionorder: true, //合约交易条件单
                //权限按钮
                bcproconditionsheetcancel: true, //撤单
                bcprotraderhistoryside: true,
                bcproposition: true, //合约交易持仓数据
                bcproindexhistory: true, //合约交易指数信息
                //财务系统
                bcprofinacewallet1: true, //财务系统-资产表查看
                bcprofinaceasst1: true, //财务系统-/平台资产账户查看
                bcprofinaceckeckvkey: true, //财务系统-平台资产账户-提币
                bcprofinaceassethistory: true, //财务系统-平台资产账户-历史记录
                bcprofinaceasst2: true, //财务系统-平台交易账户查看
                bcprofinacecapitalhistory: true, //财务系统-平台交易账户-历史记录
                bcprofinaceasst3: true,
                bcprofinacec2chistroy: true,
                bcprofinacetransfer: true,
                bcotcairdroplist: true,
                bcproairdropdownload: true,
                bcotcairdropcheck1: true,
                bcotcairdropcheck2: true,
                bcproairdropsubmit: true,
                bcotcairdropfaillist: true,
                bcdataaudit1: true,
                bcdataaudit2: true,
                bcdataaudit3: true,
                bcdataaudit5: true,
                bcdataaudit4: true,
                bcdataaudit6: true,
                bcdataaudit7: true,
                bcdataaudit8: true,
                bcdataaudit9: true,
                bcdataaudit11: true,
                bcdataaudit10: true,
                //权限管理
                manageadd: true, //添加账号  账号管理-账号列表
                managedel: true, //删除  账号管理-账号列表
                managesave: true, //修改  账号管理-账号列表
                managesave1: true, //重置登陆密码  账号管理-账号列表
                managesave2: true, //重置谷歌密码  账号管理-账号列表
                moldeladd: true, //添加分组 账号管理-角色分组
                moldeldel: true, //删除 账号管理-角色分组
                managesave: true, //修改 账号管理-角色分组
                managesave3: true,
                //经纪人管理
                bcprogettopagent: true,
                bcproagentlist: true, //查看
                nontop: true,
                bcproagentadd: true, //添加
                bcproagentupdate: true, //修改
                bcproagenthistory: true, //查看明细
                bcproagentupdate1: true, //重置登陆密码
                bcproagentupdate2: true, //重置谷歌密码
                //对冲系统
                bcprohedgeposition: true,
                bcprohedge: true,
                bcprohedgepositionhistory: true,
                bcprohedgeconfig: true,
                bcprohedgeconfigup: true,
                bcprohedgeconfigset: true,
                //预警系统
                bcprohedgewarnset: true, //配置阈值
                bcprohedgewarnswitch: true, //开启/关闭预警
                bcprohedgenotice: true, //预警历史记录
                bcprohedgemailup: true,
                //系统配置-banner配置
                bcprobannerlist: true,
                bcprobannerupload: true,
                bcprobannerup0: true,
                bcprobannerup1: true,
                appcontrolhistory: true,
                appcontrol: true,
                applist: true,
                applistadd: true,
                // bcprooperatelist: true,
                // bcproandroidupload: true,
                bcplatformprofit:true,
                bcverifyhistorylist: true, 
                bcupverifyhistory: true, 
                bcupverifyreset: true,
                bcmarkettick:true,
                bcproqutationconfig: true, 
                bcproqutationmailup: true, 
                bcproqutationwarnset: true, 
                bcproqutationwarnswitch: true, 
                bcproqutationnotice: true,
              };
              localStorage.setItem(
                "router",
                JSON.stringify(this.getTree(true))
              );
            } else {
              objQX.iscg = false;
              objQX.models = JSON.parse(JSON.parse(data.data.ModelRols));
              localStorage.setItem(
                "router",
                JSON.stringify(this.getTree(false, objQX.models))
              );
            }
            // console.log(JSON.stringify(objQX));
            this.$store.commit("setModelId", data.data.model_id);
            this.$store.commit("setQx", objQX);
            localStorage.setItem("level", JSON.stringify(data.data.model_id));
            localStorage.setItem("mgreal", JSON.stringify(data.data.name));
            localStorage.setItem(
              "token",
              JSON.stringify(this.$store.state.token)
            );
            localStorage.setItem("models", JSON.stringify(objQX));
            //1 关闭谷歌验证码输入框 2跳转路由
            if (this.$router.currentRoute.query.redirect) {
              this.$router.push(this.$router.currentRoute.query.redirect);
            } else {
              this.$router.push("/home");
            }
          }
          break;
        case LOGINOUT:
          //1 跳转到登陆页 2 清空登陆状态
          this.$store.commit("setLoginOut");
          Service.getInstance().setToken("");
          break;
      }
    },
    init() {
      this.$nextTick(function() {
        // console.log('---------','otpauth://totp/sugar?secret='+this.vkey)
        canvas = this.$refs.qrc;
        this.createQrc("otpauth://totp/dxop?secret=" + this.vkey);
      });
    },
    createQrc(val) {
      QRCode.toCanvas(this.$refs.qrc, val, error => {
        if (error) {
          console.log(error);
        }
      });
    },
    entrySendyzm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          //输入后确定发送代码
          this.$api.loginyz({
            tag:{
              dataType: GETDLYZ,
              vkey: this.vkey,
              vcode: this.ruleForm.yzmVal
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    entrySendewm() {
      this.dialogErWeiMa = false;
      this.dialogFormVisible = true;
    },
    getNodeO(
      _path,
      _component,
      _title,
      _icon = "",
      _name = "",
      _isHidden = ""
    ) {
      let o = {
        path: _path,
        component: _component,
        name: _name,
        hidden: _isHidden,
        meta: {
          title: _title,
          icon: _icon
        },
        children: []
      };
      return o;
    },
    //iscg 超级管理  qx权限列表
    getTree(iscg, qx){
      let m = [];
      //
      //公告管理菜单
      let noticeManager = this.getNodeO(
        "/notice",
        "Layout",
        "公告管理",
        "el-icon-s-platform",
        "notice"
      );
      noticeManager.redirect = "/notice/gglb";
      if (
        iscg ||
        qx.bcpronoticelist || //查看 公告列表
        qx.bcpronoticeupadd || //修改 公告列表
        qx.bcpronoticedel //删除 公告列表
      )
        noticeManager.children.push(
          this.getNodeO("gglb", "notice/gglb", "公告列表", "", "gglb")
        );
      if (iscg || qx.bcpronoticeupadd) {
        noticeManager.children.push(
          this.getNodeO("ggfb", "notice/ggfb", "公告发布", "", "ggfb")
        );
        noticeManager.children.push(
          this.getNodeO("ggxg", "notice/ggxg", "公告修改", "", "ggxg", "true")
        );
      }

      if (noticeManager.children.length > 0) m.push(noticeManager);
      //用户管理菜单
      let yhgl = this.getNodeO(
        "/userlist",
        "Layout",
        "用户管理",
        "el-icon-s-custom",
        "user"
      );
      yhgl.redirect = "/user/userList";
      if (iscg || qx.bcprouserlist || qx.bcprouserup)
        yhgl.children.push(
          this.getNodeO(
            "userList",
            "userlist/userList",
            "用户信息",
            "",
            "userList"
          )
        );
      if (yhgl.children.length > 0)
        yhgl.children.push(
          this.getNodeO(
            "userInfo",
            "userlist/userInfo",
            "用户信息详情",
            "",
            "userInfo",
            "true"
          )
        );
      if (iscg || qx.bcverifyhistorylist || qx.bcupverifyhistory || qx.bcupverifyreset)
        yhgl.children.push(
          this.getNodeO(
            "overseaskyc",
            "userlist/overseaskyc",
            "海外地区KYC审核",
            "",
            "overseaskyc"
          )
        );
      if (yhgl.children.length > 0) m.push(yhgl);
      //跟单管理
      let follow = this.getNodeO(
        "/traderslist",
        "Layout",
        "跟单管理",
        "el-icon-document-copy",
        "follow"
      );
      follow.redirect = "/follow/traderslist";
      if (iscg || qx.tradersListLook || qx.traderslistSet)
        follow.children.push(
          this.getNodeO(
            "traderslist",
            "follow/traderslist",
            "交易员列表",
            "",
            "traderslist"
          )
        );
      if (iscg || qx.tradersReviewLook || qx.tradersReviewAdd || qx.tradersReviewSet)
        follow.children.push(
          this.getNodeO(
            "tradersReview",
            "follow/tradersReview",
            "交易员审核",
            "",
            "tradersReview"
          )
        );
      if (iscg || qx.tradersOrdersLook )
        follow.children.push(
          this.getNodeO(
            "tradersOrders",
            "follow/tradersOrders",
            "带单查询",
            "",
            "tradersOrders"
          )
        );
      if (iscg || qx.tradersProfitLook )
        follow.children.push(
          this.getNodeO(
            "tradersProfit",
            "follow/tradersProfit",
            "分佣查询",
            "",
            "tradersProfit"
          )
        );
      if (follow.children.length > 0) m.push(follow);
      //资产账户
      let zczh = this.getNodeO(
        "/assetsaccount",
        "Layout",
        "资产账户",
        "el-icon-s-claim",
        "assetaccount"
      );
      zczh.redirect = "/assetaccount/financerecords";
      if (iscg || qx.bcprouserwalletbill1) {
        //财务记录
        zczh.children.push(
          this.getNodeO(
            "financerecords",
            "assetaccount/financerecords",
            "财务记录",
            "",
            "financerecords"
          )
        );
        zczh.children.push(
          this.getNodeO(
            "assetPerspective",
            "assetaccount/assetPerspective",
            "财务透视",
            "",
            "assetPerspective"
          )
        );
      }
      if (
        iscg ||
        qx.bcprouserwalletbill2 || //查看  资产管理-资产账户-提现审核
        qx.bcprousercashaudit1 || //通过  资产管理-资产账户-提现审核
        qx.bcprousercashaudit2
      )
        //拒绝  资产管理-资产账户-提现审核
        zczh.children.push(
          this.getNodeO(
            "withdrawVerify",
            "assetaccount/withdrawVerify",
            "提币审核",
            "",
            "withdrawVerify"
          )
        );

      if (iscg || qx.bcprocionsetup)
        //结算币种配置
        zczh.children.push(
          this.getNodeO(
            "coinconfig",
            "assetaccount/coinconfig",
            "币种配置",
            "",
            "coinconfig"
          )
        );
      if (iscg || qx.bcprocommissiondetails)
        zczh.children.push(
          this.getNodeO(
            "commissiondetails",
            "assetaccount/commissiondetails",
            "邀请奖励",
            "",
            "commissiondetails"
          )
        );
      if (iscg || qx.bcotcorderdaytotal || qx.bcotcorderlist) {
        zczh.children.push(
          this.getNodeO(
            "currencyTrade",
            "assetaccount/currencyTrade",
            "法币交易",
            "",
            "currencyTrade"
          )
        );
        zczh.children.push(
          this.getNodeO(
            "currencyTradeDetails",
            "assetaccount/currencyTradeDetails",
            "法币交易订单",
            "",
            "currencyTradeDetails",
            "true"
          )
        );
      }
      if (iscg || qx.bcpiontslist) {
        zczh.children.push(
          this.getNodeO(
            "integralRecords",
            "assetaccount/integralRecords",
            "积分记录",
            "",
            "integralRecords"
          )
        );
      }
      if (zczh.children.length > 0) m.push(zczh);
      //交易账户
      let jyzh = this.getNodeO(
        "/tradeaccount",
        "Layout",
        "交易账户",
        "el-icon-s-data",
        "tradeaccount"
      );
      jyzh.redirect = "/tradeaccount/financerecords";
      if (iscg || qx.bcaccountlist) {
        //财务记录
        jyzh.children.push(
          this.getNodeO(
            "financerecords",
            "tradeaccount/financerecords",
            "财务记录",
            "",
            "financerecords"
          )
        );
        jyzh.children.push(
          this.getNodeO(
            "tradePerspective",
            "tradeaccount/tradePerspective",
            "财务透视",
            "",
            "tradePerspective"
          )
        );
      }
      if (iscg || qx.bcprofitloss) {
        jyzh.children.push(
          this.getNodeO(
            "profitrank",
            "tradeaccount/profitrank",
            "总盈亏排名",
            "",
            "profitrank"
          )
        );
      }
      if (iscg || qx.bcproffundingfee)
        //资金费率历史
        jyzh.children.push(
          this.getNodeO(
            "capitalratehistory",
            "tradeaccount/capitalratehistory",
            "资金费率数据",
            "",
            "capitalratehistory"
          )
        );
      if (iscg || qx.bcprofunding) {
        //资金费用扣除
        jyzh.children.push(
          this.getNodeO(
            "capitalfee",
            "tradeaccount/capitalfee",
            "资金费用扣除",
            "",
            "capitalfee"
          )
        );
        jyzh.children.push(
          this.getNodeO(
            "capitalfeedetail",
            "tradeaccount/capitalfeedetail",
            "资金费用明细",
            "",
            "capitalfeedetail",
            true
          )
        );
      }
      let contractconfig = this.getNodeO(
        "/tradeaccount/contractconfig",
        "threeView",
        "合约配置",
        "",
        "contractconfig"
      );
      contractconfig.redirect = "/tradeaccount/contractconfig/coinconfig";
      if (iscg || qx.bcprocontractcoinlist)
        //结算币种配置
        contractconfig.children.push(
          this.getNodeO(
            "coinconfig",
            "tradeaccount/contractconfig/coinconfig",
            "保证金币种配置",
            "",
            "coinconfig"
          )
        );
      if (iscg || qx.bcprocontractset)
        //交易对配置
        contractconfig.children.push(
          this.getNodeO(
            "tradepairconfig",
            "tradeaccount/contractconfig/tradepairconfig",
            "交易对配置",
            "",
            "tradepairconfig"
          )
        );

      if (iscg || qx.bcprocontractset)
        //手续费配置
        contractconfig.children.push(
          this.getNodeO(
            "contractlist",
            "tradeaccount/contractconfig/contractlist",
            "合约列表排序",
            "",
            "contractlist"
          )
        );
      if (contractconfig.children.length > 0)
        jyzh.children.push(contractconfig);
      let contracttrade = this.getNodeO(
        "/tradeaccount/contracttrade",
        "threeView",
        "合约交易",
        "",
        "contracttrade"
      );
      if (iscg || qx.bcprotraderhistory) {
        //合约成交记录
        contracttrade.children.push(
          this.getNodeO(
            "traderecords",
            "tradeaccount/contracttrade/traderecords",
            "合约成交记录",
            "",
            "traderecords"
          )
        );
        contracttrade.children.push(
          this.getNodeO(
            "traderecordsPerspective",
            "tradeaccount/contracttrade/traderecordsPerspective",
            "成交记录透视",
            "",
            "traderecordsPerspective"
          )
        );
      }
      if (iscg || qx.bcprotraderhistoryside) {
        //合约成交记录
        contracttrade.children.push(
          this.getNodeO(
            "graduallyCloseRecords",
            "tradeaccount/contracttrade/graduallyCloseRecords",
            "逐仓强平记录",
            "",
            "graduallyCloseRecords"
          )
        );
        // contracttrade.children.push(
        //   this.getNodeO(
        //     "graduallyCloseRecordsPerspective",
        //     "tradeaccount/contracttrade/graduallyCloseRecordsPerspective",
        //     "逐仓强平记录透视",
        //     "",
        //     "graduallyCloseRecordsPerspective"
        //   )
        // );
      }
      if (iscg || qx.bcproconditionorder)
        //条件单
        contracttrade.children.push(
          this.getNodeO(
            "planorder",
            "tradeaccount/contracttrade/planorder",
            "计划单",
            "",
            "planorder"
          )
        );
      if (iscg || qx.bcproposition)
        //持仓数据
        contracttrade.children.push(
          this.getNodeO(
            "positionInfo",
            "tradeaccount/contracttrade/positionInfo",
            "持仓数据",
            "",
            "positionInfo"
          )
        );
      if (iscg || qx.bcproindexhistory)
        //指数信息
        contracttrade.children.push(
          this.getNodeO(
            "indexinfo",
            "tradeaccount/contracttrade/indexinfo",
            "指数信息",
            "",
            "indexinfo"
          )
        );
      if (iscg || qx.bcmarkettick)
        //指数信息
        contracttrade.children.push(
          this.getNodeO(
            "tickstore",
            "tradeaccount/contracttrade/tickstore",
            "TICK数据存储",
            "",
            "tickstore"
          )
        );
      if (contracttrade.children.length > 0) jyzh.children.push(contracttrade);
      if (jyzh.children.length > 0) m.push(jyzh);

      //财务系统
      let caiwuxitong = this.getNodeO(
        "/caiwuxitong",
        "Layout",
        "财务系统",
        "el-icon-s-custom",
        "caiwuxitong"
      );
      caiwuxitong.redirect = "/caiwuxitong/caiwuxitong_zcb";
      if (iscg || qx.bcprofinacewallet1)
        //资产表
        caiwuxitong.children.push(
          this.getNodeO(
            "caiwuxitong_zcb",
            "caiwuxitong/caiwuxitong_zcb",
            "资产表",
            "",
            "caiwuxitong_zcb"
          )
        );
      if (
        iscg ||
        qx.bcprofinaceasst1 || //充币
        qx.bcprofinaceckeckvkey || //提币
        qx.bcproairdropsubmit || //提币
        qx.bcprofinaceassethistory //历史
      ) {
        caiwuxitong.children.push(
          this.getNodeO(
            "ptzczh",
            "caiwuxitong/ptzczh",
            "平台资产账户",
            "",
            "ptzczh"
          )
        );
        caiwuxitong.children.push(
          this.getNodeO(
            "zhlsjl",
            "caiwuxitong/zhlsjl",
            "平台资产历史记录",
            "",
            "zhlsjl",
            "true"
          )
        );
      }
      if (
        iscg ||
        qx.bcprofinaceasst2 || //充币
        qx.bcprofinacecapitalhistory //提币
      ) {
        caiwuxitong.children.push(
          this.getNodeO(
            "plataccountTrade",
            "caiwuxitong/plataccountTrade",
            "平台交易账户",
            "",
            "plataccountTrade"
          )
        );
        caiwuxitong.children.push(
          this.getNodeO(
            "tradeAccountHistory",
            "caiwuxitong/tradeAccountHistory",
            "平台交易历史记录",
            "",
            "tradeAccountHistory",
            "true"
          )
        );
      }
      if (
        iscg ||
        qx.bcprofinaceasst3 || //充币
        qx.bcprofinacec2chistroy || //提币
        qx.bcprofinacetransfer
      ) {
        caiwuxitong.children.push(
          this.getNodeO(
            "c2cCharge",
            "caiwuxitong/c2cCharge",
            "平台充币地址C2C使用",
            "",
            "c2cCharge"
          )
        );
        caiwuxitong.children.push(
          this.getNodeO(
            "c2cChargeHistory",
            "caiwuxitong/c2cChargeHistory",
            "平台充币地址C2C使用-历史记录",
            "",
            "c2cChargeHistory",
            "true"
          )
        );
      }
      if (
        iscg ||
        qx.bcotcairdroplist || //充币
        qx.bcproairdropdownload || //提币
        qx.bcotcairdropfaillist || //充币
        qx.bcotcairdropcheck1 || //充币
        qx.bcotcairdropcheck2 //提币
      ) {
        caiwuxitong.children.push(
          this.getNodeO(
            "airdropVerify",
            "caiwuxitong/airdropVerify",
            "空投审核",
            "",
            "airdropVerify"
          )
        );
      }
      let auditandstatistics = this.getNodeO(
        "/caiwuxitong/auditandstatistics",
        "threeView",
        "统计及审计",
        "",
        "auditandstatistics"
      );
      if (
        iscg ||
        qx.bcdataaudit1 || //充币
        qx.bcdataaudit2 || //提币
        qx.bcdataaudit3 || //充币
        qx.bcdataaudit5 || //充币
        qx.bcdataaudit4 //提币
      ) {
        let assetstatistics = this.getNodeO(
          "/caiwuxitong/auditandstatistics/assetsStatistics",
          "threeView",
          "资产账户清算统计",
          "",
          "assetsStatistics"
        );
        if (iscg || qx.bcdataaudit3) {
          assetstatistics.children.push(
            this.getNodeO(
              "charge",
              "caiwuxitong/auditandstatistics/assetsStatistics/charge",
              "充币清算统计",
              "",
              "charge"
            )
          );
        }
        if (iscg || qx.bcdataaudit2) {
          assetstatistics.children.push(
            this.getNodeO(
              "withdraw",
              "caiwuxitong/auditandstatistics/assetsStatistics/withdraw",
              "提币清算统计",
              "",
              "withdraw"
            )
          );
        }
        if (iscg || qx.bcdataaudit5) {
          assetstatistics.children.push(
            this.getNodeO(
              "legal",
              "caiwuxitong/auditandstatistics/assetsStatistics/legal",
              "法币购买清算统计",
              "",
              "legal"
            )
          );
        }
        if (iscg || qx.bcdataaudit4) {
          assetstatistics.children.push(
            this.getNodeO(
              "transferout",
              "caiwuxitong/auditandstatistics/assetsStatistics/transferout",
              "转出清算统计",
              "",
              "transferout"
            )
          );
        }
        if (iscg || qx.bcdataaudit1) {
          assetstatistics.children.push(
            this.getNodeO(
              "transferin",
              "caiwuxitong/auditandstatistics/assetsStatistics/transferin",
              "转入清算统计",
              "",
              "transferin"
            )
          );
        }
        if (assetstatistics.children.length > 0) auditandstatistics.children.push(assetstatistics);
      }

      if (
        iscg ||
        qx.bcdataaudit6 || //充币
        qx.bcdataaudit7 || //提币
        qx.bcdataaudit8 || //充币
        qx.bcdataaudit9 || //充币
        qx.bcdataaudit10 || //充币
        qx.bcdataaudit11 //提币
      ) {
        let usdtstatistics = this.getNodeO(
          "/caiwuxitong/auditandstatistics/usdtStatistics",
          "threeView",
          "USDT交易账户清算统计",
          "",
          "usdtStatistics"
        );
        if (iscg || qx.bcdataaudit6) {
          usdtstatistics.children.push(
            this.getNodeO(
              "accountassets",
              "caiwuxitong/auditandstatistics/usdtStatistics/accountassets",
              "账户资产清算统计",
              "",
              "accountassets"
            )
          );
        }
        if (iscg || qx.bcdataaudit7) {
          usdtstatistics.children.push(
            this.getNodeO(
              "available",
              "caiwuxitong/auditandstatistics/usdtStatistics/available",
              "可用余额清算统计",
              "",
              "available"
            )
          );
        }
        if (iscg || qx.bcdataaudit8) {
          usdtstatistics.children.push(
            this.getNodeO(
              "deposite",
              "caiwuxitong/auditandstatistics/usdtStatistics/deposite",
              "保证金清算统计",
              "",
              "deposite"
            )
          );
        }
        if (iscg || qx.bcdataaudit9) {
          usdtstatistics.children.push(
            this.getNodeO(
              "profit",
              "caiwuxitong/auditandstatistics/usdtStatistics/profit",
              "已实现盈亏清算统计",
              "",
              "profit"
            )
          );
        }
        if (iscg || qx.bcdataaudit10) {
          usdtstatistics.children.push(
            this.getNodeO(
              "transferin",
              "caiwuxitong/auditandstatistics/usdtStatistics/transferin",
              "转入清算统计",
              "",
              "transferin"
            )
          );
        }
        if (iscg || qx.bcdataaudit11) {
          usdtstatistics.children.push(
            this.getNodeO(
              "transferout",
              "caiwuxitong/auditandstatistics/usdtStatistics/transferout",
              "转出清算统计",
              "",
              "transferout"
            )
          );
        }
        if (usdtstatistics.children.length > 0) auditandstatistics.children.push(usdtstatistics);
      }
      if (auditandstatistics.children.length > 0) caiwuxitong.children.push(auditandstatistics);
      if (iscg || qx.bcplatformprofit)
        //资产表
        caiwuxitong.children.push(
          this.getNodeO(
            "incomestatement",
            "caiwuxitong/incomestatement",
            "平台内利润表",
            "",
            "incomestatement"
          )
        );
      if (caiwuxitong.children.length > 0) m.push(caiwuxitong);
      //系统配置
      let systemConfig = this.getNodeO(
        "/systemConfig",
        "Layout",
        "系统配置",
        "el-icon-setting",
        "systemConfig"
      );
      systemConfig.redirect = "/systemConfig/bannerConfig";
      if (
        iscg ||
        qx.appcontrolhistory ||
        qx.appcontrol ||
        qx.applist ||
        qx.applistadd
      ) {
        systemConfig.children.push(
          this.getNodeO(
            "appUpGrade",
            "systemConfig/appUpGrade",
            "安卓APP升级",
            "",
            "appUpGrade"
          )
        );
        systemConfig.children.push(
          this.getNodeO(
            "versionRecords",
            "systemConfig/versionRecords",
            "版本记录",
            "",
            "versionRecords",
            "true"
          )
        );
      }
      // if (iscg ||
      //     qx.bcprooperatelist ||
      //     qx.bcproandroidupload) {
      //   systemConfig.children.push(
      //     this.getNodeO(
      //       "installPackageUpload",
      //       "systemConfig/installPackageUpload",
      //       "下载地址上传安装包",
      //       "",
      //       "installPackageUpload"
      //     )
      //   );
      // }
      if (
        iscg ||
        qx.bcprobannerlist ||
        qx.bcprobannerupload ||
        qx.bcprobannerup0 ||
        qx.bcprobannerup1
      ) {
        systemConfig.children.push(
          this.getNodeO(
            "bannerConfig",
            "systemConfig/bannerConfig",
            "首页BANNER配置",
            "",
            "bannerConfig"
          )
        );
      }
      if (iscg || qx.followParameterSet )
        systemConfig.children.push(
          this.getNodeO(
            "followSet",
            "systemConfig/followSet",
            "带单参数设置",
            "",
            "followSet"
          )
        );
      if (systemConfig.children.length > 0) m.push(systemConfig);
      //对冲系统
      let hedging = this.getNodeO(
        "/hedgingSystem",
        "Layout",
        "对冲系统",
        "el-icon-s-data",
        "hedgingSystem"
      );
      hedging.redirect = "/hedgingSystem/contractPos";
      if (iscg || qx.bcprohedgeposition) {
        hedging.children.push(
          this.getNodeO(
            "contractPos",
            "hedgingSystem/contractPos",
            "USDT合约持仓数据",
            "",
            "contractPos"
          )
        );
      }
      if (iscg || qx.bcprohedge) {
        hedging.children.push(
          this.getNodeO(
            "hedgingAsset",
            "hedgingSystem/hedgingAsset",
            "USDT对冲子账号资产",
            "",
            "hedgingAsset"
          )
        );
      }
      if (iscg || qx.bcprohedgepositionhistory) {
        hedging.children.push(
          this.getNodeO(
            "hedgingPosHis",
            "hedgingSystem/hedgingPosHis",
            "USDT对冲子账号持仓数据",
            "",
            "hedgingPosHis"
          )
        );
      }
      if (
        iscg ||
        qx.bcprohedgeconfig ||
        qx.bcprohedgeconfigup ||
        qx.bcprohedgeconfigset
      ) {
        hedging.children.push(
          this.getNodeO(
            "hedgeAccountConfig",
            "hedgingSystem/hedgeAccountConfig",
            "USDT对冲子账号配置",
            "",
            "hedgeAccountConfig"
          )
        );
      }
      if (hedging.children.length > 0) m.push(hedging);
      //预警系统
      let warning = this.getNodeO(
        "/warningSystem",
        "Layout",
        "预警系统",
        "el-icon-warning",
        "warningSystem"
      );
      warning.redirect = "/warningSystem/hedgeWarning";
      if (
        iscg ||
        qx.bcprohedgeconfig ||
        qx.bcprohedgemailup ||
        qx.bcprohedgewarnset ||
        qx.bcprohedgewarnswitch ||
        qx.bcprohedgenotice
      ) {
        warning.children.push(
          this.getNodeO(
            "hedgeWarning",
            "warningSystem/hedgeWarning",
            "对冲预警",
            "",
            "hedgeWarning"
          )
        );
        warning.children.push(
          this.getNodeO(
            "hedgeWarningHistory",
            "warningSystem/hedgeWarningHistory",
            "预警记录",
            "",
            "hedgeWarningHistory",
            "true"
          )
        );
      }
      if (
        iscg ||
        qx.bcmarketconfig ||
        qx.bcprohedgemailup2 ||
        qx.bcmarketconfigup1 ||
        qx.bcmarketconfigup2 ||
        qx.bcpromarketnotice
      ) {
        warning.children.push(
          this.getNodeO(
            "quotationWarning",
            "warningSystem/quotationWarning",
            "行情接口预警",
            "",
            "quotationWarning"
          )
        );
        warning.children.push(
          this.getNodeO(
            "quotationWarningHistory",
            "warningSystem/quotationWarningHistory",
            "预警记录",
            "",
            "quotationWarningHistory",
            "true"
          )
        );
      }
      if (warning.children.length > 0) m.push(warning);
      //权限管理菜单
      let qxgl = this.getNodeO(
        "/permissions",
        "Layout",
        "账号管理",
        "el-icon-s-help",
        "permissions"
      );
      qxgl.redirect = "/permissions/zhlb";
      if (
        iscg || //超级管理
        qx.manageadd || //添加账号  账号管理-账号列表
        qx.managedel || //删除  账号管理-账号列表
        qx.managesave3 || //修改  账号管理-账号列表
        qx.managesave1 || //重置登陆密码  账号管理-账号列表
        qx.managesave2 //重置谷歌密码  账号管理-账号列表
      )
        qxgl.children.push(
          this.getNodeO("zhlb", "permissions/zhlb", "账号列表", "", "zhlb")
        );
      if (
        iscg || //超级管理
        qx.moldeladd || //添加分组 账号管理-角色分组
        qx.moldeldel || //删除 账号管理-角色分组
        qx.managesave //修改 账号管理-角色分组
      )
        qxgl.children.push(
          this.getNodeO("jsfz", "permissions/jsfz", "角色分组", "", "jsfz")
        );
      if (qxgl.children.length > 0)
        qxgl.children.push(
          this.getNodeO(
            "jsbj",
            "permissions/jsbj",
            "角色编辑",
            "",
            "jsbj",
            "true"
          )
        );
      if (qxgl.children.length > 0) m.push(qxgl);

      //权限管理菜单
      let agent = this.getNodeO(
        "/agent",
        "Layout",
        "代理管理",
        "el-icon-s-custom",
        "agent"
      );
      agent.redirect = "/agent/agentList";
      if (
        iscg || //超级管理
        qx.bcprogettopagent || //添加账号  账号管理-账号列表
        qx.bcproagentadd //删除  账号管理-账号列表
      )
        agent.children.push(
          this.getNodeO(
            "topAgentAdd",
            "agent/topAgentAdd",
            "添加顶层代理",
            "",
            "topAgentAdd"
          )
        );
      if (
        iscg || //超级管理
        qx.bcproagentlist || //添加账号  账号管理-账号列表
        qx.bcproagentadd || //删除  账号管理-账号列表
        qx.nontop ||
        qx.bcproagentupdate || //修改  账号管理-账号列表
        qx.bcproagenthistory || //重置登陆密码  账号管理-账号列表
        qx.bcproagentupdate1 || //重置谷歌密码  账号管理-账号列表
        qx.bcproagentupdate2 //重置谷歌密码  账号管理-账号列表
      ) {
        agent.children.push(
          this.getNodeO(
            "agentList",
            "agent/agentList",
            "代理列表",
            "",
            "agentList"
          )
        );
        agent.children.push(
          this.getNodeO(
            "agentInfo",
            "agent/agentInfo",
            "代理详情",
            "",
            "agentInfo",
            "true"
          )
        );
      }
      if (agent.children.length > 0) m.push(agent);
      return m;
    }
  },
  destroyed() {
    document.onkeydown = null;
  }
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  // background-image: url("~@/assets/loginBg.svg");
  background: #1f222a;
  background-repeat: no-repeat;
  background-size: contain;
  // display: flex;
  // justify-content: space-around;
  // align-items: center;
  position: relative;
  // .height_set {
  //   padding-bottom: 56.24%;
  // }
  .main {
    position: absolute;
    width: 470px;
    top: 17.2%;
    left: 50%;
    margin-left: -242.5px;
    // height: 41%;
    ul {
      width: 100%;
      height: 100%;
      li {
        width: 100%;
        height: 49px;
        margin: 5% 0;
        display: flex;
        .check_div {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 20px;
          height: 20px;
          margin-right: 9px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 1);
          &:hover {
            cursor: pointer;
          }
          .icon-check {
            font-size: 17px;
            color: #fff;
          }
        }
        .checked_div {
          background: #ff9900;
          border-color: #ff9900;
        }
        .clause_span {
          font-size: 14px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          a {
            color: #ff9900;
            text-decoration: none;
          }
        }
      }
      .tabs_li {
        display: flex;
        align-items: center;
        font-size: 16px;
        height: 49px;
        div {
          margin-right: 16px;
        }
        .tab_div:hover {
          cursor: pointer;
        }
        .tab_active {
          font-family: PingFangSC-Medium;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          font-size: 18px;
        }
      }
      .input_li {
        width: 100%;
        height: 49px;
        min-height: 32px;
      }
      .res_btn_li {
        width: 100%;
        height: 49px;
        min-height: 32px;
        .res_btn {
          width: 100%;
          height: 100%;
          background: #00a0ff;
          border-radius: 6px;
          border: none;
          font-size: 15px;
          font-family: PingFangSC-Medium;
          font-weight: 400;
          outline: none;
          color: rgba(255, 255, 255, 1);
          &:hover {
            cursor: pointer;
            background: #0080cc;
          }
          &:active {
            background: #34b3ff;
          }
        }
      }
      .first_information {
        font-size: 35px;
        font-family: Arial-BoldMT;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
      }
      .error_display {
        margin-bottom: 30px;
      }
      @media screen and (max-width: 992px) {
        .first_information {
          font-size: 30px;
        }
        .tabs_li {
          font-size: 15px;
        }
        li {
          .check_div {
            width: 16px;
            height: 16px;
            .icon-check {
              font-size: 15px;
            }
          }
          .clause_span {
            font-size: 12px;
          }
        }
        .res_btn_li {
          .res_btn {
            font-size: 14px;
          }
        }
      }
    }
  }
  /deep/.el-dialog {
    .el-form-item {
      margin-bottom: 0;
    }
    .banner-box {
      text-align: center;
    }
  }
}
</style>
