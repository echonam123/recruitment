<template>
  <view>
    <image src="../../static/cat.jpg" mode="scaleToFill" />
  </view>
  <Login></Login>
  <uni-list>
    <uni-list-item
      title="招新流程
      "
      link
      to="/pages/process/process"
      @click="onClick()"
    ></uni-list-item>
    <uni-list-item
      title="预约"
      link
      to="/pages/book/chooseBook"
      @click="onClick()"
    ></uni-list-item>
  </uni-list>
</template>
<script setup lang="ts">
import Login from "../../components/login/login.vue";
const onClick = () => {
  console.log(1);
};
</script>
<style>
page {
  background-color: rgb(218, 243, 234);
}
image {
  width: 100%;
  z-index: 1000;
  margin-bottom: 0;
  height: 180px;
}
</style>
