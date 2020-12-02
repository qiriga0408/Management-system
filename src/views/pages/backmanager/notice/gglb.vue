<!--公告列表-->
<template>
  <div class="withdraw">
    <div class="w_c">
      <draggable
        element="div"
        class="w100"
        v-model="toplist"
        v-bind="dragOptions"
        :move="onMove"
        @change="change"
        @start="start"
        @end="end"
        @add='addCollectionD'
      >
        <transition-group type="transition" class="title_ul" tag="ul" name="flip-list">
          <li v-for="(item) in toplist" :key="item.id">
            <div class="content_div">
              <p class="title_p">{{item.title}}</p>
              <p class="date_p">发布时间：{{item.createdat}}</p>
            </div>
            <div class="handle_div">
              <el-button type="primary" size="mini" v-if="$store.state.qx.bcpronoticedel" @click="handleDelete(item)">删除</el-button>
              <el-button type="primary" size="mini" v-if="$store.state.qx.bcpronoticeupadd" @click="handleEdit(item)">修改</el-button>
              <el-button type="primary" size="mini" v-if="$store.state.qx.bcpronoticeupadd" @click="handleToTopOrNo('0',item)">取消置顶</el-button>
            </div>
          </li>
        </transition-group>
      </draggable>
      <div class="tishi_div" v-if="toplist.length<=0">暂无置顶数据</div>
      <div class="online_div"></div>
      <draggable
        v-if="tableData.length>0"
        class="title_ul"
        tag="ul"
        v-model="tableData"
        v-bind="dragOptions"
        :move="onMove"
        @change="change"
        @start="start"
        @end="end"
        @add='addCollection'
      >
        <transition-group type="transition" name="flip-list">
          <li v-for="(item) in tableData" :key="item.id">
            <div class="content_div">
              <p class="title_p">{{item.title}}</p>
              <p class="date_p">发布时间：{{item.createdat}}</p>
            </div>
            <div class="handle_div">
              <el-button
                type="primary"
                size="mini"
                v-if="$store.state.qx.bcpronoticedel"
                @click="handleDelete(item)"
              >删除</el-button>
              <el-button
                type="primary"
                size="mini"
                v-if="$store.state.qx.bcpronoticeupadd"
                @click="handleEdit(item)"
              >修改</el-button>
              <el-button
                type="primary"
                size="mini"
                v-if="$store.state.qx.bcpronoticeupadd"
                @click="handleToTopOrNo('1',item)"
              >置顶</el-button>
            </div>
          </li>
        </transition-group>
      </draggable>
      <div class="tishi_div" v-else>暂无数据</div>
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
  </div>
</template>
<script>
import { GETGGLB, SCGG, ZDORNO } from "@/constant";
import {getgg} from '@/api.js'
import draggable from "vuedraggable"; //引入拖拽
export default {
  data() {
    return {
      datatotal: 0, //总数据条数
      listQuery:{
         currentPageNum: 10, //每页默认10条
       currentPage: 1, //当前页
      },
      currentPageNum: 10, //每页默认10条
      currentPage: 1, //当前页

      isDragging: false,
      toplist: [], //置顶数组
      tableData: []
    };
  },
  mounted() {
    this.$register(this);
    this.msg = [GETGGLB, SCGG,ZDORNO];
    this.getData();
  },
  components: {
    draggable
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        // disabled: !this.editable,
        ghostClass: "ghost"
      };
    }
  },
  methods: {
    whichArr(id){
      let aa = false
      for (let i = 0; i < this.toplist.length; i++) { 
        if(this.toplist[i].id == id){
          aa = true
          return true
        }else{
          aa = false
        }
      }
      return aa
    },
    change: function(evt) {
      // console.log(evt); 
      // console.log("!!!",evt.added); 
      // console.log("!!!",evt.removed); 
      // console.log("!!!",evt.moved); 
      if(evt.moved){
        //判断拖拽的是否是置顶数组
        if(this.whichArr(evt.moved.element.id)){//是
          //判断是否拖拽到第 0 个
          if(evt.moved.newIndex == 0){
            this.$api.zdOrqxNotice({
              tag: {
                dataType: ZDORNO,
                id: evt.moved.element.id,
                weight: Number(this.toplist[evt.moved.newIndex+1].weight) + 1,
                type: 1,
              }
            });
            //判断是否拖拽到最后
          }else if(evt.moved.newIndex == this.toplist.length-1){
            this.$api.zdOrqxNotice({
              tag: {
                dataType: ZDORNO,
                id: evt.moved.element.id,
                weight: Number(this.toplist[evt.moved.newIndex-1].weight) - 1,
                type: 1,
              }
            });
          }else{
            this.$api.zdOrqxNotice({
              tag: {
                dataType: ZDORNO,
                id: evt.moved.element.id,
                weight: (Number(this.toplist[evt.moved.newIndex+1].weight)+Number(this.toplist[evt.moved.newIndex-1].weight))/2,
                type: 1,
              }
            });
          }
        }else{//否
          //判断是否拖拽到第 0 个
          // if(evt.moved.newIndex == 0){
          //   this.$api.zdOrqxNotice({
          //     tag: {
          //       dataType: ZDORNO,
          //       id: evt.moved.element.id,
          //       weight: Number(this.tableData[evt.moved.newIndex+1].weight) + 1,
          //       type: 0,
          //     }
          //   });
          //   //判断是否拖拽到最后
          // }else if(evt.moved.newIndex == this.tableData.length-1){
          //   this.$api.zdOrqxNotice({
          //     tag: {
          //       dataType: ZDORNO,
          //       id: evt.moved.element.id,
          //       weight: Number(this.tableData[evt.moved.newIndex-1].weight) - 1,
          //       type: 0,
          //     }
          //   });
          // }else{
          //   this.$api.zdOrqxNotice({
          //     tag: {
          //       dataType: ZDORNO,
          //       id: evt.moved.element.id,
          //       weight: (Number(this.tableData[evt.moved.newIndex+1].weight)+Number(this.tableData[evt.moved.newIndex-1].weight))/2,
          //       type: 0,
          //     }
          //   });
          // }
        }
      }else{
        // 判断是拖到置顶还是拖出置顶
        
        // console.log(evt,this.toplist,evt.added.element.id)
        // let aa = false
        // let addedID = evt.added.element.id
        // for (let i = 0; i < this.toplist.length; i++) { 
        //   if(this.toplist[i].id == addedID){
        //     aa = true
        //     return true
        //   }else{
        //     aa = false
        //   }
        // }

        // if(aa){//拖到置顶
        //   // //判断是否拖拽到第 0 个
        //   if(evt.moved.newIndex == 0){
        //     this.$api.zdOrqxNotice({
        //       tag: {
        //         dataType: ZDORNO,
        //         id: evt.moved.element.id,
        //         weight: Number(this.toplist[evt.moved.newIndex+1].weight) + 1,
        //         type: 1,
        //       }
        //     });
        //     //判断是否拖拽到最后
        //   }else if(evt.moved.newIndex == this.toplist.length-1){
        //     this.$api.zdOrqxNotice({
        //       tag: {
        //         dataType: ZDORNO,
        //         id: evt.moved.element.id,
        //         weight: Number(this.toplist[evt.moved.newIndex-1].weight) - 1,
        //         type: 1,
        //       }
        //     });
        //   }else{
        //     this.$api.zdOrqxNotice({
        //       tag: {
        //         dataType: ZDORNO,
        //         id: evt.moved.element.id,
        //         weight: (Number(this.toplist[evt.moved.newIndex+1].weight)+Number(this.toplist[evt.moved.newIndex-1].weight))/2,
        //         type: 1,
        //       }
        //     });
        //   }
        // }
      }
    },
    start: function(evt) {
      // console.log(evt)
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      // return (
      //   (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      // );
    },
    end(){},
    addCollectionD(evt){//拖拽置顶
      //判断是否拖拽到第 0 个
      if(evt.newIndex == 0){
        if(this.toplist.length>1){
          this.$api.zdOrqxNotice({
            tag: {
              dataType: ZDORNO,
              id: this.toplist[evt.newIndex].id,
              weight: Number(this.toplist[evt.newIndex+1].weight) + 1,
              type: 1,
            }
          });
        }else{
          this.$api.zdOrqxNotice({
            tag: {
              dataType: ZDORNO,
              id: this.toplist[evt.newIndex].id,
              weight: 1,
              type: 1,
            }
          });
        }
        
        //判断是否拖拽到最后
      }else if(evt.newIndex == this.toplist.length-1){
        this.$api.zdOrqxNotice({
          tag: {
            dataType: ZDORNO,
            id: this.toplist[evt.newIndex].id,
            weight: Number(this.toplist[evt.newIndex-1].weight) - 1,
            type: 1,
          }
        });
      }else{
        this.$api.zdOrqxNotice({
          tag: {
            dataType: ZDORNO,
            id: this.toplist[evt.newIndex].id,
            weight: (Number(this.toplist[evt.newIndex+1].weight)+Number(this.toplist[evt.newIndex-1].weight))/2,
            type: 1,
          }
        });
      }
    },
    addCollection(evt) {//拖拽取消置顶
      // evt.item //可以知道拖动的本身
      // evt.to    // 可以知道拖动的目标列表
      // evt.from  // 可以知道之前的列表
      // evt.oldIndex  // 可以知道拖动前的位置
      // evt.newIndex  // 可以知道拖动后的位置

      //判断是否拖拽到第 0 个
      if(evt.newIndex == 0){
        this.$api.zdOrqxNotice({
          tag: {
            dataType: ZDORNO,
            id: this.tableData[evt.newIndex].id,
            weight: Number(this.tableData[evt.newIndex+1].weight) + 1,
            type: 0,
          }
        });
        //判断是否拖拽到最后
      }else if(evt.newIndex == this.tableData.length-1){
        this.$api.zdOrqxNotice({
          tag: {
            dataType: ZDORNO,
            id: this.tableData[evt.newIndex].id,
            weight: Number(this.tableData[evt.newIndex-1].weight) - 1,
            type: 0,
          }
        });
      }else{
        this.$api.zdOrqxNotice({
          tag: {
            dataType: ZDORNO,
            id: this.tableData[evt.newIndex].id,
            weight: (Number(this.tableData[evt.newIndex+1].weight)+Number(this.tableData[evt.newIndex-1].weight))/2,
            type: 0,
          }
        });
      }
    },
    handleDelete(item) {
      this.$confirm("是否删除该公告?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //  36.删除公告
          //   地址：/customer/customer_owner/del_notice_msg
          //  方式：post
          //   参数id
          //  返回
          // {"res":200,"msg":""}
          this.$api.deleteNotice({
            tag: {
              dataType: SCGG,
              id: item.id
            }
          });
        })
        .catch(() => {
          this.$msg({
            type: "info",
            message: "已取消删除",
            title: "提示"
          });
        });
    },
    handleEdit(item) {
      this.$router.push({
        path: "/notice/ggxg",
        query: {
          data: JSON.stringify(item)
        }
      });
    },
    handleToTopOrNo(zdType,item) {
      let setWeight = null
      if(this.toplist.length>0){
        setWeight = Number(this.toplist[0].weight)+1
      }
      this.$confirm(`是否${zdType=='0'?'取消置顶':'置顶'}该公告?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //         49.修改公告置顶信息
          //  地址：/Customer_owner/up_top_notice_msg
          //  参数：id公告id，type （0取消置顶，1置顶）， weight置顶权重值

          //  返回{"res":200,"msg":""}
          this.$api.zdOrqxNotice({
            tag: {
              dataType: ZDORNO,
              id: item.id,
              weight: setWeight,
              type: zdType,
            }
          });
        })
        .catch(() => {
          this.$msg({
            type: "info",
            message: "已取消",
            title: "提示"
          });
        });
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
    
     
      //     .获取公告列表
      // 地址：/customer/Customer_owner/get_notice_msg
      // 方式：POST
      // 参数：pageNo，pagesize， star，end
      // 返回：title标题，abstract中文摘要，content中文正文，content_en英文正文，abstract_en英文摘要，title_en英文标题
      // {"res":200,"msg":"","data":{"rowCount":"1","list":[{"id":"1","title":"\u4e0a\u7ebf","abstract":"\u4e0a\u7ebf\u4ecb\u7ecd","content":"\u968f\u4fbf\u8bf4\u8bf4","content_en":"say yes","abstract_en":"online haha","title_en":"online","created_at":"2019-08-08 23:16:11"}]}}
      this.$api.getNoticeMsg({
        tag: {
          dataType: GETGGLB,
          pageNo: this.currentPage,
          pagesize: this.currentPageNum,
          star: "",
          end: ""
        }
      });
    },

    message(tag, data) {
      switch (tag.dataType) {
        case GETGGLB:
          if(data.ret === 0 && data.data.list){
            this.tableData = data.data.list;
            this.tableData.sort((a, b)=> b.weight-a.weight); //分数从高到低 排序
            this.toplist = this.tableData.filter(v=>v.istop===1);//data.data.toplist;  //置顶数组
            if(this.toplist.length>0){
              this.toplist.map(v=>{
                let idx = this.tableData.findIndex(t=>t.id === v.id);
                if(idx>=0){
                  this.tableData.splice(idx,1)
                }
              });
            }
            this.datatotal = Number(data.data.total)-this.toplist.length;
          }else{
            this.tableData = [];
            this.toplist = [];
            this.datatotal = 0;
          }
          break;
        case SCGG:
          if(data.ret === 0){
            this.$msg({ message: data.msg, type: "success", title: "成功" });
            if(this.tableData.length-1 == 0){
              //删除后已经不再有数据 页数减1
              this.currentPage -= 1;
              this.currentPage = this.currentPage<1?1:this.currentPage;
            }
            //刷新
            this.getData();
          }
          break;
        case ZDORNO:
          if(data.ret === 0){
            this.$msg({ message: data.msg, type: "success", title: "成功" });
            if(this.tableData.length == 0 || this.tableData.length-1 == 0){
              //删除后已经不再有数据 页数减1
              this.currentPage -= 1;
              this.currentPage = this.currentPage<1?1:this.currentPage;
            }
            //刷新
            this.getData();
          }
          break;
      }
    }
  },
  watch: {
    isDragging(newValue) {
      if (newValue) {
        this.delayedDragging = true;
        return;
      }
      this.$nextTick(() => {
        this.delayedDragging = false;
      });
    }
  },
  beforeDestroy() {
    this.$unRegister(this);
  }
};
</script>

<style lang="less" scoped>
.withdraw {
  width: 100%;
  display: flex;
  flex-direction: column;
  .w_c {
    width: 100%;
    flex-grow: 1;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    .online_div {
      height: 1px;
      width: 100%;
      border-top: 1px solid #ccc;
      margin-top: 15px;
      margin-bottom: 25px;
    }
    .title_ul {
      width: 100%;
      min-height: 10px;
      li {
        &:hover {
          cursor: move;
        }
        border: 1px solid #ccc;
        display: flex;
        // justify-content: space-between;
        align-items: center;
        justify-content: space-between;
        padding: 12px;
        margin-bottom: 10px;
        .content_div {
          width: 80%;
          white-space: nowrap;
          overflow: hidden;
          p {
            text-align: left;
          }
          .title_p {
            font-size: 18px;
            line-height: 30px;
            font-weight: 700;
          }
          .date_p {
            line-height: 18px;
            font-weight: 500;
            font-size: 14px;
          }
        }
        .handle_div {
          width: 20%;
          justify-content: flex-end;
          display: flex;
          align-items: center;
        }
      }
    }
    .tishi_div {
      line-height: 60px;
      color: #909399;
      font-size: 14px;
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
.w100{
  width: 100%;
}

.flip-list-move {
  transition: transform 0.375s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
