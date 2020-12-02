<template>
  <div :class="[labelContainer]">
    <span :class="[labelTitle]" :style= {width:titleWidth}>{{title}}</span>
    <span :class="[labelContext]" :style= {width:valueWidth}>{{(value == null)?"--":value}}</span>
  </div>
</template>
<script>
export default {
  props: {
    labelContainer :{
      type: String,
      default: ""
    },
    labelTitle :{
      type: String,
      default: ""
    },
    labelContext :{
      type: String,
      default: ""
    },

    titleWidth:{
      default: null
    },

    valueWidth:{
      default: null
    },

    title: {
      type: String,
      default: ""
    },

    value: {
      default: ""
    },
  },
  data() {
    return {
      
    };
  },
  computed: {},
  mounted() {},
  watch: {},
  methods: {
    click(item) {
     this.$emit("labelClick", this.context);
    },
  }
};
</script>

