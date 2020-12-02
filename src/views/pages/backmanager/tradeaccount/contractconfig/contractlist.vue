<!--合约配置 手续费-->
<template>
  <div class="lsjl">
    <div id="wcdiv_lsjl" class="w_c">
      <el-table
        :data="tableData"
        style="width:100%"
        sort-by="index"
        sortable
        :cell-style="{height:'60px','min-width':'300px'}"
      >
        <!-- <el-table-column type="index"></el-table-column> -->
        <el-table-column min-width="300px">
          <template slot-scope="scope">
              <div>
                <span style="width:350px;font-size:18px;font-weight:bold;">合约代码:{{scope.row.traderpairs}}</span><br>
                <span style="width:350px">{{scope.row.positive?'金本位合约':'币本位合约'}}</span>
              </div>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" style="width:100px">
          <template slot-scope="scope">
            <div style="min-width:300px">
              <el-button  v-if="$store.state.qx.bcprocontractsort" 
                plain size="small" @click="sortPair(2,scope)" :disabled="!showBtnAble">{{scope.row.isshow?'隐藏':'显示'}}</el-button>
              <el-button  v-if="$store.state.qx.bcprocontractsort" :disabled="!upBtnAble||scope.$index==0"
                type="primary" size="small" @click="sortPair(0,scope)">{{scope.$index==0?"已到顶":"上移"}}</el-button>
              <el-button  v-if="$store.state.qx.bcprocontractsort" :disabled="!downBtnAble||scope.$index==tableData.length-1||!scope.row.orderby" 
                type="primary" size="small" @click="sortPair(1,scope)">{{scope.$index==tableData.length-1?"已到底":"下移"}}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { HYPZ_SXF } from "@/constant";
export default {
  data() {
    return {
      tableData: [{traderpairs:'13123'}],
      showBtnAble:true,
      upBtnAble:true,
      downBtnAble:true
    };
  },
  components: {},
  mounted() {
    this.$register(this);
    this.msg = [HYPZ_SXF];
    this.getData();

  },
  computed: {},
  methods: {
    getData() {
      this.tableData = [];
      //获取全部合约
      this.$api.bcprocontractset({
        tag: {
          dataType: HYPZ_SXF,
          url:"/managers/v1/manager/bcprocontractset",
          take:1,//获取全部合约
          params:{}//参数
        }
      });
    },
    async sortPair(type,item){
      if(type == 2){//隐藏
        this.showBtnAble = false;
        await this.$api.bcprocontractset({
          tag: {
            dataType: HYPZ_SXF,
            url:"/managers/v1/manager/bcprocontractsort",
            take:2,//s设置
            params:{
              isshow:item.row.isshow?0:1,
              contractid:item.row.traderid,
              contractcode:item.row.traderpairs,
              orderby:item.row.orderby
            }//参数
          }
        });
      }else if(type == 0){
        let orderby;
        // if(item.row.orderby === 0){
          if(item.$index == 1){
            orderby = this.tableData[0].orderby+1;
          }else{
            if(this.tableData[item.$index-1].orderby + this.tableData[item.$index-2].orderby > 0){
              orderby = this.tableData[item.$index-1].orderby+(this.tableData[item.$index-2].orderby - this.tableData[item.$index-1].orderby)*0.5;
            }else{
              orderby = 1;
            }
          }
        // }else{
        //   orderby = this.tableData[item.$index-1].orderby+1;
        // }
        // console.log();
        this.upBtnAble = false;
        await this.$api.bcprocontractset({
          tag: {
            dataType: HYPZ_SXF,
            url:"/managers/v1/manager/bcprocontractsort",
            take:2,//s设置
            params:{
              isshow:item.row.isshow,
              contractid:item.row.traderid,
              contractcode:item.row.traderpairs,
              orderby:orderby
            }//参数
          }
        });
      }else{
        let orderby;
        if(item.row.orderby !== 0){
          if(item.$index == this.tableData.length-2){
            if(this.tableData[this.tableData.length-1].orderby === 0){
              orderby = 0;
            }else{
              orderby = this.tableData[this.tableData.length-1].orderby*0.5;
            }
          }else{
            if(this.tableData[item.$index+1].orderby + this.tableData[item.$index+2].orderby > 0){
              orderby = this.tableData[item.$index+1].orderby - (this.tableData[item.$index+1].orderby - this.tableData[item.$index+2].orderby)*0.5;
            }else{
              orderby = 0;
            }
          }
        }
        
        orderby = Math.max(orderby,0)
        this.downBtnAble = false;
        await this.$api.bcprocontractset({
          tag: {
            dataType: HYPZ_SXF,
            url:"/managers/v1/manager/bcprocontractsort",
            take:2,//s设置
            params:{
              isshow:item.row.isshow,
              contractid:item.row.traderid,
              contractcode:item.row.traderpairs,
              orderby:orderby
            }//参数
          }
        });
      }
      
    },
    message(tag, data) {
      switch (tag.dataType) {
        case HYPZ_SXF:
          if(data.ret === 0){
            switch(tag.take){
              case 1://合约列表
                if (data.data) {
                    this.tableData = data.data;
                    this.tableData.sort((a, b)=> b.orderby-a.orderby);
                }
                break;
              case 2://获取币
                this.getData();
                this.showBtnAble = true;
                this.upBtnAble = true;
                this.downBtnAble = true;
                // this.$msg({title:'错误',message:'设置失败',type:'error'})
                break;
            }
          }else{
            if(tag.take == 2){
              this.$msg({title:'错误',message:'设置失败',type:'error'})
              this.showBtnAble = true;
              this.upBtnAble = true;
              this.downBtnAble = true;
              this.getData();
            }
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
.inputw {
  width: 180px;
  padding-right: 30px;
}

.inputs {
  padding-right: 30px;
  width: 140px;
}

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
    justify-content: space-between;
    padding-bottom: 10px;
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
      padding:0;
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
  .spantitle{
    display:inline-block;
    width: 110px;
    text-align: left;
    padding-right: 20px;
    flex-shrink: 0;
  }
  .spanleft{
    padding-left: 80px;
  }
  .w156{
    width:150px;
  }

  .divfee{
    display: flex;
    align-items: center;
    padding-top: 20px;
    padding-bottom:20px;
  }
}

.dialogstip {
  color: red;
  padding: 20px 10px;
}
</style>
