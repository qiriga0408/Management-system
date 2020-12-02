/* eslint-disable prettier/prettier */
<!--合约配置 结算币种配置-->
<template>
  <div class="lsjl">
    <div class="w_menu">
      <el-button
        v-if="$store.state.qx.bcprocontractadd"
        type="primary"
        class="buttons"
        @click="addbz"
      >添加交易对</el-button>
    </div>
    <div id="wcdiv_lsjl" class="w_c">
      <el-table :data="tableData" style="width:100%" :cell-style="{ height: rowh + 'px' }">
        <el-table-column label="操作" min-width="580">
          <template slot-scope="scope">
            <el-button
              v-if="$store.state.qx.bcprocontractset_onlinestatus"
              type="primary"
              size="small"
              @click="online(scope.row,1)"
            >{{scope.row.shangjia_s}}</el-button>
            <el-button
              v-if="$store.state.qx.bcprocontractset_openorderenable"
              type="primary"
              :disabled="Boolean(scope.row.onlinestatus)"
              size="small"
              @click="online(scope.row,2)"
            >{{scope.row.kaicang_s}}</el-button>
            <el-button
              v-if="$store.state.qx.bcprocontractset_openorderenable"
              type="primary"
              :disabled="Boolean(scope.row.onlinestatus)"
              size="small"
              @click="online(scope.row,3)"
            >{{scope.row.pingcang_s}}</el-button>
            <el-button
              v-if="$store.state.qx.bcprocontractset_ispositions"
              type="primary"
              :disabled="Boolean(scope.row.onlinestatus)"
              size="small"
              @click="online(scope.row,4)"
            >全部平仓</el-button>
            <el-button
              v-if="$store.state.qx.bcprocontractset_islodge"
              type="primary"
              :disabled="Boolean(scope.row.onlinestatus)"
              size="small"
              @click="online(scope.row,5)"
            >全部撤单</el-button>
            <el-button
              v-if="$store.state.qx.bcprocontractadd"
              type="primary"
              size="small"
              @click="updatepz(scope.row)"
            >修改交易对配置</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="coinname" label="保证金币种" min-width="180"></el-table-column>
        <el-table-column prop="traderpairs" label="合约代码" min-width="180"></el-table-column>
        <el-table-column prop="feecomm" label="手续费" min-width="180"></el-table-column>
      </el-table>
    </div>

    <el-dialog
      width="1100px"
      class="dialogsize"
      @close="onDialogClose"
      :title="`合约账户${this.takeType==1?'修改':'新增'}交易对`"
      :visible.sync="dialogVisible"
    >
      <el-form :rules="rules" ref="ruleFormmr" :model="ruleForm">
        <div class="dialogc">
          <div class="divleftright">
            <div class="divliang">
              <el-form-item label="保证金币种" label-width="130px" prop="input_jsbz">
                <el-select
                  :disabled="this.takeType==1"
                  class="w156"
                  v-model="ruleForm.input_jsbz"
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in bzData"
                    :key="item.currencyid"
                    :label="item.currencyname"
                    :value="item.currencyname"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>

            <div class="divliang">
              <el-form-item label="方向" label-width="130px">
                <!-- <el-radio v-model="ruleForm.fanxiangheyue" label="0">币本位合约</el-radio> -->
                <el-radio v-model="ruleForm.fanxiangheyue" label="1">USDT合约</el-radio>
              </el-form-item>
            </div>
            <div class="divliang">
              <el-form-item label="合约单位" label-width="130px">
                <span>张数</span>
              </el-form-item>
            </div>
            <div class="divliang">
              <el-form-item label="交易对精度" label-width="130px" prop="input_digits">
                <el-input
                  class="w156"
                  placeholder="只可以输入整数包含0"
                  v-model="ruleForm.input_digits"
                  clearable
                ></el-input>
              </el-form-item>
            </div>
            <div class="divliang">
              <el-form-item label="最小变动价" label-width="130px" prop="input_minprice">
                <el-input
                  class="w156"
                  placeholder="最小可输入0.00000001"
                  v-model="ruleForm.input_minprice"
                  clearable
                ></el-input>
              </el-form-item>
            </div>

            <div class="divliang">
              <el-form-item label="手续费" label-width="130px" prop="input_takerfee">
                <el-input
                  class="w156"
                  placeholder="只可以输入大于-1小于1的小数"
                  v-model="ruleForm.input_takerfee"
                  clearable
                ></el-input>
              </el-form-item>
            </div>

            <div class="divliang">
              <el-form-item label="全仓杠杆倍数" label-width="130px" prop="input_qcgg">
                <el-select
                  class="w156"
                  multiple
                  v-model="ruleForm.input_qcgg"
                  filterable
                  placeholder="请选择"
                >
                  <el-option-group
                    v-for="group in qcggdata"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="item in group.options"
                      :key="item"
                      :label="item"
                      :value="item"
                      :disabled="qcselect.includes(item)"
                    ></el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </div>
            <div class="divliang">
              <el-form-item label="逐仓杠杆倍数" label-width="130px" prop="input_zcgg">
                <el-select
                  class="w156"
                  multiple
                  v-model="ruleForm.input_zcgg"
                  filterable
                  placeholder="请选择"
                >
                  <el-option-group
                    v-for="group in graduallymultData"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="item in group.options"
                      :key="item"
                      :label="item"
                      :value="item"
                      :disabled="graduallymult.includes(item)"
                    ></el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="divleftright">
            <div class="divliang">
              <el-form-item label="计价币种" label-width="130px" prop="input_jjbz">
                <el-input
                  :disabled="this.takeType==1"
                  class="w156"
                  placeholder="只可以输入大写英文字母"
                  v-model="ruleForm.input_jjbz"
                  clearable
                ></el-input>
              </el-form-item>
            </div>
            <div class="divliang">
              <el-form-item label="合约面值" label-width="130px" prop="input_mianzhi">
                <el-input
                  class="w156"
                  placeholder="只可以输入正数"
                  v-model="ruleForm.input_mianzhi"
                  clearable
                ></el-input>
                {{ruleForm.input_jjbz}}
              </el-form-item>
            </div>

            <div class="divliang">
              <el-form-item label="维持保证金率" label-width="130px" prop="input_wcbzjl">
                <el-input
                  class="w156"
                  placeholder="只可以输入0-1之间小数"
                  v-model="ruleForm.input_wcbzjl"
                  clearable
                ></el-input>
              </el-form-item>
            </div>

            <div class="divliang">
              <el-form-item label="单笔最大下单" label-width="130px" prop="input_maxnum">
                <el-input
                  class="w156"
                  placeholder="只可以输入大于0的正整数"
                  v-model="ruleForm.input_maxnum"
                  clearable
                ></el-input>
              </el-form-item>
            </div>

            <div class="divliang">
              <el-form-item label="单笔最小下单" label-width="130px" prop="input_minnum">
                <el-input
                  class="w156"
                  placeholder="只可以输入大于0的正整数"
                  v-model="ruleForm.input_minnum"
                  clearable
                ></el-input>
              </el-form-item>
            </div>

            <div class="divliang">
              <el-form-item label="最大持仓张数" label-width="130px" prop="input_maxccnum">
                <el-input
                  class="w156"
                  placeholder="只可以输入正整数"
                  v-model="ruleForm.input_maxccnum"
                  clearable
                ></el-input>
              </el-form-item>
            </div>
            <div class="divliang">
              <el-form-item label="合约指数精度" label-width="130px" prop="zhishudigits">
                <el-input
                  class="w156"
                  placeholder="只可以输入整数包含0"
                  v-model="ruleForm.zhishudigits"
                  clearable
                ></el-input>
              </el-form-item>
            </div>
            <div class="divliang">
              <el-form-item label="此合约中文名称" label-width="130px" prop="input_namezh">
                <el-input
                  class="w156"
                  placeholder="可输入中文和字母"
                  v-model="ruleForm.input_namezh"
                  clearable
                ></el-input>
              </el-form-item>
            </div>

            <div class="divliang">
              <el-form-item label="此合约英文名称" label-width="130px" prop="input_nameen">
                <el-input
                  class="w156"
                  placeholder="可输入中文和字母"
                  v-model="ruleForm.input_nameen"
                  clearable
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="this.addCancle">取 消</el-button>
        <el-button type="primary" @click="this.addok">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { HYPZ_JYD } from "@/constant";
export default {
  data() {
    //下拉菜单没选择校验
    let validate_select = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择正确内容"));
      } else {
        callback();
      }
    };

    //结算币种
    let validate_select_js = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择结算币种"));
      } else {
        callback();
      }
    };
    //计价币种
    let validate_select_jj = (rule, value, callback) => {
      let reg = /^[A-Z]+$/;
      if (!value) {
        return callback(new Error("请输入计价币种"));
      } else if (!reg.test(value)) {
        return callback(new Error("只能输入大写字母"));
      } else if (value == this.ruleForm.input_jsbz) {
        return callback(new Error("计价币种不能和结算币种相同"));
      } else {
        callback();
      }
    };

    //价格精度
    let validate_input_digits = (rule, value, callback) => {
      let reg = /^([0-8])$/;
      if (!reg.test(value)) {
        return callback(new Error("只能输入0-8正整数"));
      } else {
        callback();
      }
    };

    //最小变动价
    let validate_input_minprice = (rule, value, callback) => {
      let reg = /^([0-8])$/;
      if (!reg.test(this.ruleForm.input_digits)) {
        return callback(new Error("请先设置正确的交易对精度"));
      } else if (isNaN(value)) {
        return callback(new Error("只能输入数字"));
      } else if (parseFloat(value) < 0.00000001) {
        return callback(new Error("不能小于0.00000001"));
      } else if (
        value.indexOf(".") > -1 &&
        value.split(".")[1].length > this.ruleForm.input_digits
      ) {
        return callback(new Error("精度不能大于设置的价格精度"));
      } else {
        callback();
      }
    };

    //手续费
    let validate_input_fee = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手续费"));
      } else if (isNaN(value)) {
        return callback(new Error("只能输入数字"));
      } else if (parseFloat(value) <= -1 || parseFloat(value) >= 1) {
        return callback(new Error("只可以输入大于-1小于1的小数"));
      } else {
        callback();
      }
    };

    //杠杆倍数
    let validate_input_qcgg = (rule, value, callback) => {
      if (this.qcselect.length == 0 && (!value || value.length === 0)) {
        return callback(new Error("请选择杠杆倍数"));
      } else {
        callback();
      }
    };
    //杠杆倍数
    let validate_input_zcgg = (rule, value, callback) => {
      if (this.qcselect.length == 0 && (!value || value.length === 0)) {
        return callback(new Error("请选择杠杆倍数"));
      } else {
        callback();
      }
    };
    //信息来源xxly
    let validate_input_xxly = (rule, value, callback) => {
      if (
        !this.ruleForm.bitmax &&
        !this.ruleForm.huobi &&
        !this.ruleForm.bian
      ) {
        return callback(new Error("请选择"));
      } else {
        callback();
      }
    };

    //名字
    let validate_input_name = (rule, value, callback) => {
      let reg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
      if (!reg.test(value)) {
        return callback(new Error("只能输入中文和字母"));
      } else {
        callback();
      }
    };

    //正整数不包含0
    let validate_input_zzs = (rule, value, callback) => {
      let reg = /^\+?[1-9]\d*$/;
      if (!value || !reg.test(value)) {
        return callback(new Error("只能输入正整数"));
      } else {
        callback();
      }
    };
    //正数，包含0
    let validate_input_zs = (rule, value, callback) => {
      //
      let reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      if (!value || !reg.test(value)) {
        return callback(new Error("只能输入正数"));
      } else {
        callback();
      }
    };
    //正整数包含0
    let validate_input_zzs0 = (rule, value, callback) => {
      let reg = /^(0|\+?[1-9][0-9]*)$/;
      if (!value || !reg.test(value)) {
        return callback(new Error("只能输入正整数"));
      } else {
        callback();
      }
    };

    //0-1
    let validate_input_xs01 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入维持保证金率"));
      } else if (isNaN(value)) {
        return callback(new Error("只能输入数字"));
      } else if (parseFloat(value) <= 0 || parseFloat(value) >= 1) {
        return callback(new Error("只可以输入大于0小于1的小数"));
      } else {
        callback();
      }
    };

    return {
      rowh: 40, //行高
      dialogVisible: false,
      graduallymult: [], //发送数据时逐仓杠杆数组合并此数组，此数组里的杠杆在控件里无法选择
      graduallymultData: [],
      qcselect: [], //发送数据时全仓杠杆数组合并此数组，此数组里的杠杆在控件里无法选择
      qcggdata: [],

      ruleForm: {
        input_jsbz: "", //结算币种
        fanxiangheyue: "1", //反向合约 默认选中 禁止编辑
        input_digits: "", //结算精度
        input_minprice: "", //最小变动价
        input_takerfee: "", //taker手续费
        input_qcgg: [], //全仓杠杆
        input_zcgg: [], //逐仓杠杆
        input_namezh: "", //中文名字
        input_nameen: "", //英文名字
        zhishudigits: "", //指数精度
        // biaojidigits:'',//标记价格精度

        input_jjbz: "", //计价币种
        input_mianzhi: "", //合约面值
        input_wcbzjl: "", //维持保证金率
        input_minnum: "",
        input_maxnum: "", //单笔最大下单
        input_makerfee: "", //maker手续费
        input_maxccnum: "" //最大持仓张数
      },

      rules: {
        //结算币种
        input_jsbz: [{ validator: validate_select_js, trigger: "change" }],
        //结算精度
        input_digits: [{ validator: validate_input_digits, trigger: "blur" }],
        //最小变动价
        input_minprice: [
          { validator: validate_input_minprice, trigger: "blur" }
        ],
        //taker手续费
        input_takerfee: [{ validator: validate_input_fee, trigger: "blur" }],
        //全仓杠杆
        input_qcgg: [{ validator: validate_input_qcgg, trigger: "change" }],
        //逐仓杠杆
        input_zcgg: [{ validator: validate_input_zcgg, trigger: "change" }],
        //信息来源
        xxly: [{ validator: validate_input_xxly, trigger: "change" }],
        //中文名字
        input_namezh: [{ validator: validate_input_name, trigger: "blur" }],
        //英文名字
        input_nameen: [{ validator: validate_input_name, trigger: "blur" }],
        //指数精度
        zhishudigits: [{ validator: validate_input_digits, trigger: "blur" }],
        //标记价格精度
        biaojidigits: [{ validator: validate_input_digits, trigger: "blur" }],

        //计价币种
        input_jjbz: [{ validator: validate_select_jj, trigger: "blur" }],
        //合约面值
        input_mianzhi: [{ validator: validate_input_zs, trigger: "blur" }],
        //维持保证金率
        input_wcbzjl: [{ validator: validate_input_xs01, trigger: "blur" }],
        //单笔最大下单
        input_maxnum: [{ validator: validate_input_zzs, trigger: "blur" }],
        //单笔最大下单
        input_minnum: [{ validator: validate_input_zzs, trigger: "blur" }],
        //maker手续费
        input_makerfee: [{ validator: validate_input_fee, trigger: "blur" }],
        //最大持仓张数
        input_maxccnum: [{ validator: validate_input_zzs0, trigger: "blur" }]
      },
      takeType: 1, //1修改币种 2添加
      bzData: [], //币种列表
      tableData: []
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [HYPZ_JYD];
    this.getData();

    // 1.合约币种列表
    // 地址：/managers/v1/manager/bcprocontractcoinlist
    // 传参：{}
    // 返回：{"ret": 0,"msg": "","data":{"list": [{}],"total": 1}}
    // 字段解释： status 状态，coinname币种 ，accassets账户资产，availbalance可用余额，bondbalance 保证金余额，warehousebond 仓位保证金，dealbond未成交保证金
    this.bzData = [];
    this.$api.bcprocontractset({
      tag: {
        dataType: HYPZ_JYD,
        url: "/managers/v1/manager/bcprocontractcoinlist",
        take: 4, //合约币种列表
        params: {} //参数
      }
    });
  },
  computed: {},
  methods: {
    updatepz(v) {
      this.takeType = 1;
      this.traderid = v.traderid;
      this.qcselect = [];
      let lvl = v.fullmult.split(",");
      lvl.map(lvl => {
        if (lvl && !this.qcselect.includes(lvl)) {
          this.qcselect.push(lvl);
        }
      });
      let qcgg = [2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 50, 100];
      let _editqcgg = qcgg.filter(s => !this.qcselect.includes(s.toString()));
      this.qcggdata = [
        {
          label: "已选择杠杆",
          options: this.qcselect
        },
        {
          label: "可选择杠杆",
          options: _editqcgg
        }
      ];

      this.graduallymult = [];
      let gradually = v.graduallymult.split(",");
      gradually.map(lvl => {
        if (lvl && !this.graduallymult.includes(lvl)) {
          this.graduallymult.push(lvl);
        }
      });
      let zcgg = [2,3,4,5,6, 7, 8, 9, 10,15,20,25,30,35,40,45,50,60,70,80,90,100];
      let _editzcgg = zcgg.filter(
        s => !this.graduallymult.includes(s.toString())
      );
      this.graduallymultData = [
        {
          label: "已选择杠杆",
          options: this.graduallymult
        },
        {
          label: "可选择杠杆",
          options: _editzcgg
        }
      ];
      this.ruleForm.input_jsbz = v.coinname; //结算币种
      this.ruleForm.fanxiangheyue = v.positive.toString(); //反向合约
      this.ruleForm.input_digits = v.accuracy; //结算精度
      this.ruleForm.input_minprice = Number(v.changeprice)
        .toFixed(v.indexprecision || 8)
        .replace(/\.?0+$/, ""); //最小变动价
      this.ruleForm.input_takerfee = v.feecomm; //taker手续费
      this.ruleForm.input_qcgg = this.qcselect; //全仓杠杆
      this.ruleForm.input_zcgg = this.graduallymult; //逐仓杠杆
      this.ruleForm.input_namezh = v.contractname; //中文名字
      this.ruleForm.input_nameen = v.contractnameen; //英文名字
      this.ruleForm.zhishudigits = v.indexprecision; //指数精度

      this.ruleForm.input_jjbz = v.pricecoinname; //计价币种
      this.ruleForm.input_mianzhi = v.mumber; //合约面值
      this.ruleForm.input_wcbzjl = v.keepbond; //维持保证金率
      this.ruleForm.input_maxnum = v.maxorder; //单笔最大下单
      this.ruleForm.input_minnum = v.minordervolume; //单笔最大下单
      this.ruleForm.input_maxccnum = v.buyposivolume; //最大持仓张数

      this.dialogVisible = true;
    },
    onDialogClose() {
      // console.log('onDialogClose');
      // if (this.$refs.ruleFormmr) {
        // 延时执行
        // this.$nextTick(function() {
          // this.ruleForm = {}
          this.$refs.ruleFormmr.resetFields();
        // });
      // }
    },
    addbz() {
      this.takeType = 2;
      this.traderid = 0;
      this.dialogVisible = true;
      this.graduallymult = [];
      this.qcselect = [];
      this.qcggdata = [
        {
          label: "可选择杠杆",
          options: [2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 50, 100]
        }
      ];
      this.graduallymultData = [
        {
          label: "可选择杠杆",
          options: [2,3,4,5,6, 7, 8, 9, 10,15,20,25,30,35,40,45,50,60,70,80,90,100]
        }
      ];
    },

    addCancle() {
      // if (this.$refs.ruleFormmr) {
        // 延时执行
        // this.$nextTick(function() {
          // this.ruleForm = {}
          this.$refs.ruleFormmr.resetFields();
        // });
      // }
      this.dialogVisible = false;
    },
    addok() {
      let that = this;
      this.$refs["ruleFormmr"].validate(valid => {
        if (valid) {
          this.$confirm("请确认是否配置正确?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              that.dialogVisible = false;
              // 7.添加交易对
              // 地址：/v1/manager/bcprocontractadd
              // 传参：coinid结算币种id，coinname结算币种名字， valuationcoin计价币种，positive正反方向，合约面值1张 mumber,交易对精度accuracy,keepbond维持保证金率，changeprice最小变动价，maxorder最大下单，takercomm taker手续费，makercomm maker手续费，逐仓倍数graduallymult，fullmult全仓倍数，contractfrom 合约指数来源
              // 返回： {"ret": 0,"msg": ""}
              let input_jsbzid = null;
              for (let i = 0; i < that.bzData.length; i++) {
                if (that.bzData[i].currencyname == that.ruleForm.input_jsbz) {
                  input_jsbzid = that.bzData[i].currencyid;
                  break;
                }
              }
              console.log(that.bzData);
              let url = "/managers/v1/manager/bcprocontractadd";
              that.$api.bcprocontractset({
                tag: {
                  dataType: HYPZ_JYD,
                  url: url,
                  take: 3, //合约交易对列表
                  params: {
                    ttype: that.takeType, //操作方式 1修改 2添加
                    traderid: that.traderid, //交易对id
                    coinid: Number(input_jsbzid), //结算币种id，
                    coinname: that.ruleForm.input_jsbz.toUpperCase(), //结算币种名字，
                    valuationcoin: that.ruleForm.input_jjbz, //计价币种
                    positive: Number(that.ruleForm.fanxiangheyue), //正反方向， 写死0
                    mumber: Number(that.ruleForm.input_mianzhi), //合约面值1张,
                    accuracy: Number(that.ruleForm.input_digits), //交易对精度,
                    contractname: that.ruleForm.input_namezh, //中文名称
                    contractnameen: that.ruleForm.input_nameen, //英文名称
                    buyposivolume: Number(that.ruleForm.input_maxccnum), //最大持仓

                    indexprecision: Number(that.ruleForm.zhishudigits), //合约指数精度, 新增 还不确定key
                    // markprecision:Number(that.ruleForm.biaojidigits),//标记价格精度,
                    keepbond: Number(that.ruleForm.input_wcbzjl), //维持保证金率，
                    changeprice: Number(that.ruleForm.input_minprice), //最小变动价，
                    maxorder: Number(that.ruleForm.input_maxnum), //最大下单，
                    minordervolume: Number(that.ruleForm.input_minnum), //最小下单，
                    feecomm: Number(that.ruleForm.input_takerfee), // 手续费，
                    fullmult: that.ruleForm.input_qcgg.join(","), //全仓倍数，
                    graduallymult: that.ruleForm.input_zcgg.join(",") //逐仓倍数，
                  } //参数
                }
              });
            })
            .catch(() => {});
        }
      });
    },

    online(v, type) {
      switch (type) {
        case 1: //上下架
          this.$confirm("请确认是否" + v.shangjia_s + "此合约 ", "确认信息", {
            distinguishCancelAndClose: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          })
            .then(() => {
              this.$api.bcprocontractset({
                tag: {
                  dataType: HYPZ_JYD,
                  url: "/managers/v1/manager/bcprocontractup",
                  take: 2, //更改交易对配置
                  params: {
                    onlinestatus: v.onlinestatus == 0 ? 1 : 0, //上架状态0：上架  1：下架
                    openorderenable: v.openorderenable, //可开仓0开，1关
                    closeorderenable: v.closeorderenable, //可平仓0开1关
                    ispositions: 0, // //全部平仓1平仓
                    islodge: 0, //全部撤单 1撤单
                    traderid: v.traderid, //traderid合约id
                    procode: v.traderpairs //traderid合约code
                  } //参数
                }
              });
            })
            .catch(action => {});
          break;
        case 2: //开仓
          this.$confirm("请确认此合约是否" + v.kaicang_s, "确认信息", {
            distinguishCancelAndClose: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          })
            .then(() => {
              this.$api.bcprocontractset({
                tag: {
                  dataType: HYPZ_JYD,
                  url: "/managers/v1/manager/bcprocontractup",
                  take: 2, //更改交易对配置
                  params: {
                    onlinestatus: v.onlinestatus,
                    openorderenable: v.openorderenable == 0 ? 1 : 0, //可开仓0开，1关
                    type: v.closeorderenable == 0 ? 1 : 0,
                    closeorderenable: v.closeorderenable,
                    ispositions: 0,
                    islodge: 0, //traderid合约id
                    traderid: v.traderid, //traderid合约id
                    procode: v.traderpairs //traderid合约code
                  } //参数
                }
              });
            })
            .catch(action => {});
          break;
        case 3: //平仓
          this.$confirm("请确认此合约是否" + v.pingcang_s, "确认信息", {
            distinguishCancelAndClose: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          })
            .then(() => {
              this.$api.bcprocontractset({
                tag: {
                  dataType: HYPZ_JYD,
                  url: "/managers/v1/manager/bcprocontractup",
                  take: 2, //更改交易对配置
                  params: {
                    onlinestatus: v.onlinestatus,
                    openorderenable: v.openorderenable,
                    closeorderenable: v.closeorderenable == 0 ? 1 : 0, //可平仓0开1关
                    type: v.closeorderenable == 0 ? 1 : 0,
                    ispositions: 0,
                    islodge: 0,
                    traderid: v.traderid, //traderid合约id
                    procode: v.traderpairs //traderid合约code
                  } //参数
                }
              });
            })
            .catch(action => {});
          break;
        case 4: //全部平仓
          this.$confirm("请确认此合约是否全部平仓", "确认信息", {
            distinguishCancelAndClose: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          })
            .then(() => {
              this.$api.bcprocontractset({
                tag: {
                  dataType: HYPZ_JYD,
                  url: "/managers/v1/manager/bcprocontractup",
                  take: 2, //更改交易对配置
                  params: {
                    onlinestatus: v.onlinestatus,
                    openorderenable: v.openorderenable,
                    closeorderenable: v.closeorderenable,
                    ispositions: 1, //全部平仓1平仓
                    islodge: 0,
                    traderid: v.traderid, //traderid合约id
                    procode: v.traderpairs //traderid合约code
                  } //参数
                }
              });
            })
            .catch(action => {});
          break;
        case 5: //全部撤单
          this.$confirm("请确认此合约是否全部撤单", "确认信息", {
            distinguishCancelAndClose: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          })
            .then(() => {
              this.$api.bcprocontractset({
                tag: {
                  dataType: HYPZ_JYD,
                  url: "/managers/v1/manager/bcprocontractup",
                  take: 2, //更改交易对配置
                  params: {
                    onlinestatus: v.onlinestatus,
                    openorderenable: v.openorderenable,
                    closeorderenable: v.closeorderenable,
                    ispositions: 0,
                    islodge: 1, //全部撤单 1撤单
                    traderid: v.traderid, //traderid合约id
                    procode: v.traderpairs //traderid合约code
                  } //参数
                }
              });
            })
            .catch(action => {});
          break;
      }
    },
    getData() {
      // 5.合约交易对列表
      // 地址：/v1/manager/qbprocontractset
      // 传参{}
      // 返回：{"ret": 0,"msg": "","data":{"list": [{}],"total": 1}}
      // 字段解释：onlinestatus 上架状态，traderstatus交易状态，ispositions 是否持仓，islodge是否有挂单，coinname结算币种，traderpairs交易对，takercomm taker手续费，makercomm maker手续费，traderid合约id
      this.tableData = [];
      this.$api.bcprocontractset({
        tag: {
          dataType: HYPZ_JYD,
          url: "/managers/v1/manager/bcprocontractset",
          take: 1, //合约交易对列表
          params: {} //参数
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case HYPZ_JYD:
          if (data.ret === 0) {
            switch (tag.take) {
              case 1: //交易对列表
                if (data.data) {
                  data.data.map(v => {
                    // onlinestatus 上架状态 0 上架 1下架
                    if (Number(v.onlinestatus) == 0) {
                      v["shangjia_s"] = "下架";
                    } else {
                      v["shangjia_s"] = "上架";
                    }
                    // openorderenable可开仓（开关）0开，1关,
                    if (Number(v.openorderenable) == 1) {
                      v["kaicang_s"] = "关闭开仓";
                    } else {
                      v["kaicang_s"] = "开启开仓";
                    }

                    //closeorderenable可平仓（开关）0开1关
                    if (Number(v.closeorderenable) == 1) {
                      v["pingcang_s"] = "关闭平仓";
                    } else {
                      v["pingcang_s"] = "开启平仓";
                    }
                  });
                  this.tableData = data.data;
                }
                break;
              case 2: //更改交易对配置
                this.$msg({
                  title: "成功",
                  message: "操作成功",
                  type: "success"
                });
                this.getData();
                break;
              case 3: //添加交易对
                this.$msg({
                  title: "成功",
                  message: "操作成功",
                  type: "success"
                });
                this.getData();
                break;
              case 4: //合约币种列表
                if (data.data) {
                  this.bzData = data.data.filter(v => v.status == 1);
                  for (let i = 0; i < this.bzData.length; i++) {
                    this.bzData[i].currencyname = this.bzData[
                      i
                    ].currencyname.toUpperCase();
                  }
                }
                break;
            }
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
  margin-left: 30px;
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
}

.dialogc {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  .divleftright {
    width: 50%;
  }
  .spantitle {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 20px;
    flex-shrink: 0;
  }

  .w156 {
    width: 250px;
  }
  .w157 {
    width: 300px;
    display: flex;
  }
  .dialoginput {
    width: 156px;
  }
  .divliang {
    display: flex;
    align-items: center;
  }
  .liang {
    font-size: 14px;
  }
}
</style>
