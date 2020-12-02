<!--资产表-->
<template>
   <table :class="[t_table]">
      <tr :class="[t_trh]">
        <th v-for="item in thdata" :key="item.id" :class="[t_th,item.style]" :style="{width:item.width||100/thdata.length+'%'}">{{item.value}}</th>
      </tr>
      <tr  v-for="_item in trdata" :key="_item.id" :class="[t_tr,_item.style]">
        <td v-for="item in _item.data" :key="item.id" :class="[t_td,item.style]"  :style="{width:item.width||100/thdata.length+'%'}">{{item.value}}</td>
      </tr>
    </table>
</template>
<script>
export default {
  props: {
    t_table :{type: String, default: "t_table"},
    t_trh :{type: String, default: "t_trh"},
    t_tr :{type: String, default: "t_tr"},
    t_th :{type: String, default: "t_th"},
    t_td :{type: String, default: "t_td"},
    thdata: { type: Array, default: []},
    trdata: {type: Array,default: []},
  },
};
</script>

