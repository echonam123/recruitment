<template>
  <view class="success">
      <image
      src="../../static/success.png"
      mode="widthFix"
    />
    <text class="title">你已经成功报名</text>
    <button @tap="returnMyth">返回个人中心</button>
  </view>
</template>

<script lang="ts" setup>
function returnMyth() {
  uni.switchTab({
      url:'/pages/myth/myth'
    })
  }
</script>

<style scoped>
  .success{
    margin-top: 80rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  image{
    width: 200rpx;
  }
  .title{
    margin-top: 40rpx;
    font-size: 50rpx;
    font-weight: 700;
  }
  button{
    width: 80%;
    margin-top: 200rpx;
    color: #fff;
    background-color: #55b837;
  }
</style>