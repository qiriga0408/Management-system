<!--带单参数配置-->
<template>
  <div class="followPSet">
    <div class="row_wrap">
      <el-row style="width:100%">
        <el-col :span="10">
          <div class="key_wrap">比例跟单倍数</div>
          <div class="val_wrap">
            <span v-show="!amountEdit">{{min_multiple}}倍</span>
            <el-input
              v-show="amountEdit"
              style="width:80px"
              placeholder=""
              v-model.number="min_multiple"
            >
              <i slot="suffix" style="font-style:normal">倍</i>
            </el-input>
            &nbsp;&nbsp;&nbsp;&nbsp;
            -
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span v-show="!amountEdit">{{max_multiple}}倍</span>
            <el-input
              v-show="amountEdit"
              style="width:80px"
              placeholder=""
              v-model.number="max_multiple"
            >
              <i slot="suffix" style="font-style:normal">倍</i>
            </el-input>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="key_wrap">单笔下单量</div>
          <div class="val_wrap">
            <span v-show="!amountEdit">{{min_number}}张</span>
            <el-input
              v-show="amountEdit"
              style="width:80px"
              placeholder=""
              v-model.number="min_number"
            >
              <i slot="suffix" style="font-style:normal">张</i>
            </el-input>
            &nbsp;&nbsp;&nbsp;&nbsp;
            -
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span v-show="!amountEdit">{{max_number}}张</span>
            <el-input
              v-show="amountEdit"
              style="width:80px"
              placeholder=""
              v-model.number="max_number"
            >
              <i slot="suffix" style="font-style:normal">张</i>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="btn_wrap">
            <el-button type="primary" size="small" @click="handlerAmount" :icon="!weightEdit?'el-icon-edit':'el-icon-check'" circle></el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="row_wrap">
      <div class="key_wrap">交易员带单人数</div>
      <div class="val_wrap">
        <table>
          <tr>
            <th style="width:200px">带单账户余额(USDT)</th>
            <th style="width:100px">跟单人数</th>
            <th style="width:32px">编辑</th>
          </tr>
          <tr v-for="(item,index) in dealer_people_config" :key="index">
            <td>
              <span v-show="!item.isEdit">{{item.min_amount+(item.max_amount==0?"+":'  -  '+item.max_amount)}}</span>
              <div style="display: flex;" v-show="item.isEdit">
                <el-input
                  size="mini"
                  style="width:120px"
                  placeholder=""
                  v-model="item.min_amount"
                  onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')"
                >
                </el-input>
                <span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
                <el-input
                  size="mini"
                  style="width:120px"
                  placeholder=""
                  v-model="item.max_amount"
                  onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g,'$1')"
                >
                </el-input>
              </div>

            </td>
            <td>
              <span v-show="!item.isEdit">{{item.number}}</span>
              <el-input
                v-show="item.isEdit"
                size="mini"
                style="width:80px"
                placeholder=""
                v-model.number="item.number"
                onkeyup="value=value.replace(/[^\d]/g,'')"
              >
              </el-input>
            </td>
            <td style="width:32px">
              <el-button type="primary" size="small" @click="handlerFollow(item,index)" :icon="!item.isEdit?'el-icon-edit':'el-icon-check'" circle></el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="btn_wrap">
        <el-button type="primary" size="small" @click="handlerFollowPlus" icon="el-icon-plus" circle></el-button>
      </div>
    </div>
    <div class="row_wrap" style="border:none">
      <div class="key_wrap">评分周期</div>
      <div class="val_wrap">
        <span style="line-height:40px" v-show="!weightEdit">{{day_number+''}}日</span>
        <el-input
          v-show="weightEdit"
          style="width:120px"
          placeholder=""
          v-model.number="day_number"
          onkeyup="value=value.replace(/[^\d]/g,'')"
        >
          <i slot="suffix" style="font-style:normal">日</i>
        </el-input>
      </div>
      <div class="btn_wrap">
        <el-button type="primary" size="small" @click="handlerWeight" :icon="!weightEdit?'el-icon-edit':'el-icon-check'" circle></el-button>
      </div>
    </div>
    <div class="row_wrap clearStyle">
      <div class="key_wrap">综合评分权重</div>
      <div class="val_wrap">
        <table border="1" cellspacing="0">
          <tr>
            <th>指标</th>
            <th>权重</th>
          </tr>
          <tr>
            <td>{{'近'+day_number+'日收益率'}}</td>
            <td>
              <span v-show="!weightEdit">{{weightConfig.day_profit}}%</span>
              <el-input
                size="mini"
                v-show="weightEdit"
                style="width:120px"
                placeholder=""
                v-model="weightConfig.day_profit"
                onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"
              >
                <i slot="suffix" style="font-style:normal">%</i>
              </el-input>
            </td>
          </tr>
          <tr>
            <td>累计收益</td>
            <td>
              <span v-show="!weightEdit">{{weightConfig.total_profit}}%</span>
              <el-input
                size="mini"
                v-show="weightEdit"
                style="width:120px"
                placeholder=""
                v-model="weightConfig.total_profit"
              >
                <i slot="suffix" style="font-style:normal">%</i>
              </el-input>
            </td>
          </tr>
          <tr>
            <td>{{'近'+day_number+'日胜率'}}</td>
            <td>
              <span v-show="!weightEdit">{{weightConfig.winning}}%</span>
              <el-input
                size="mini"
                v-show="weightEdit"
                style="width:120px"
                placeholder=""
                v-model="weightConfig.winning"
                onkeyup="value=value.replace(/[^\d^\.]+/g,'')"
              >
                <i slot="suffix" style="font-style:normal">%</i>
              </el-input>
            </td>
          </tr>
          <tr>
            <td>{{'近'+day_number+'日交易量'}}</td>
            <td>
              <span v-show="!weightEdit">{{weightConfig.traders}}%</span>
              <el-input
                size="mini"
                v-show="weightEdit"
                style="width:120px"
                placeholder=""
                v-model="weightConfig.traders"
                onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"
              >
                <i slot="suffix" style="font-style:normal">%</i>
              </el-input>
            </td>
          </tr>
          <tr>
            <td>累计收益率</td>
            <td>
              <span v-show="!weightEdit">{{weightConfig.total_profit_rate}}%</span>
              <el-input
                size="mini"
                v-show="weightEdit"
                style="width:120px"
                placeholder=""
                v-model="weightConfig.total_profit_rate"
                onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"
              >
                <i slot="suffix" style="font-style:normal">%</i>
              </el-input>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div>
      <el-row justify='end'>
        <el-col :span="16"></el-col>
        <el-col :span="8">
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { GET_FOLLOW_CONFIG,SET_FOLLOW_CONFIG,SET_DEALER_PEOPLE_CONFIG,SET_DEALER_CONFIG  } from "@/constant";
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
      min_multiple: '',
      max_multiple: '',
      min_number: '',
      max_number: '',
      day_number: '',
      dealer_people_config: [],
      amountEdit:false,
      weightEdit:false,
      weightConfig: {
        "day_profit":0.0, //近n日收益率权重
        "total_profit":0.0, //累计收益权重
        "winning":0.0, //近n日胜率权重
        "traders":0.0, //近n日交易量权重
        "total_profit_rate":0.0 //近n日累计收益率权重
      },
      dialogVisible: false,
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [GET_FOLLOW_CONFIG, SET_FOLLOW_CONFIG,SET_DEALER_PEOPLE_CONFIG,SET_DEALER_CONFIG];
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
    handlerAmount(){
      if(this.amountEdit){
        this.$api.setFollowConfig({
          tag: {
            dataType: SET_FOLLOW_CONFIG,
            min_multiple: Number(this.min_multiple),// 
            max_multiple: Number(this.max_multiple),
            min_number: Number(this.min_number),//
            max_number: Number(this.max_number),
          }
        });
      }
      this.amountEdit = !this.amountEdit
    },
    handlerFollowPlus(){
      let data = {
        "id": null, //数据id
        "min_amount": 0, //最小金额
        "max_amount": 0, //区间最大金额
        "number": 0, //允许跟单人数
        "isEdit": true,
      }
      this.dealer_people_config.push(data)
      console.log('338',this.dealer_people_config)
    },
    handlerFollow(v,i){
      // this.followType = 2
      if(v.isEdit){
        this.$api.setDealerPeopleConfig({
          tag: {
            dataType: SET_FOLLOW_CONFIG,
            id: v.id,
            number: v.number,
            min_amount: Number(v.min_amount),// 最小金额
            max_amount: Number(v.max_amount),
            stype: v.id == null?1:2,//1添加 2更新
          }
        });
      }
      v.isEdit = !v.isEdit
    },
    handlerWeight(){
      if(this.weightEdit){
        this.$api.setDealerConfig({
          tag: {
            dataType: SET_FOLLOW_CONFIG,
            day_profit: Number(this.weightConfig.day_profit),
            total_profit: Number(this.weightConfig.total_profit),
            winning: Number(this.weightConfig.winning),
            traders: Number(this.weightConfig.traders),
            total_profit_rate: Number(this.weightConfig.total_profit_rate),
            day_number: this.day_number,//天数
          }
        });
      }
      this.weightEdit = !this.weightEdit
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
      this.$api.getFollowConfig({
        tag: {
          dataType: GET_FOLLOW_CONFIG,
        }
      });
    },
    message(tag, data) {
      switch (tag.dataType) {
        case GET_FOLLOW_CONFIG:
          if (data.ret === 0) {
            this.min_multiple = data.data.followconfig.min_multiple
            this.max_multiple = data.data.followconfig.max_multiple
            this.min_number = data.data.followconfig.min_number
            this.max_number = data.data.followconfig.max_number
            this.dealer_people_config = data.data.dealer_people_config.map((item,index)=>{
              item.isEdit = false
              return item
            })
            this.weightConfig = data.data.dealer_weight_config
            this.day_number = data.data.dealer_weight_config.day_number
          }
          break;
        case SET_FOLLOW_CONFIG:
          this.getData();
          if(data.ret === 0){
            this.$msg({
              title: "成功",
              message: "操作成功",
              type: "success"
            });
          }
          break;
        case SET_DEALER_PEOPLE_CONFIG:
          this.getData();
          if (data.ret === 0) {
            this.$msg({
              title: "成功",
              message: "操作成功",
              type: "success"
            });
          }
          break;
        case SET_DEALER_CONFIG:
          this.getData();
          if(data.ret === 0){
            this.$msg({
              title: "成功",
              message: "操作成功",
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

<style lang="less" scoped>
.followPSet {
  width: 100%;
  height: 100%;
  text-align: left;
  /deep/.el-row{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .el-col{
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
  }
  /deep/.el-input__suffix {
    display: flex;
    align-items: center;
  }
  .row_wrap{
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    border-bottom: 1px solid #ccc;
    padding: 25px 0;
    .key_wrap{
      line-height: 40px;
      width: 120px;
    }
    .val_wrap{
      display: flex;
      align-items: center;
      table,table tr th, table tr td { 
        border:1px solid #ccc; 
        padding: 5px 10px;
        width: 150px;
        font-size: 14px;
      }
      table { 
        table-layout:fixed;
        word-break:break-all;
        height: 30px; 
        line-height: 30px; 
        text-align: left; 
        border-collapse: collapse; 
        padding:2px;
      }   
    }
    .btn_wrap{
      height: 40px;
      line-height: 40px;
      margin-left: 15px;
    }
  }
  .clearStyle{
    border-bottom: none;
    padding: 0;
  }
}
</style>
