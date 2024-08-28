<template>
  <view class="homePage" @tap="showBtn">
        <view class="logo" :class="{upLogo:isShow}">
          <image
          src="../../static/logo.png"
          mode="widthFix"
          :class="{logoImg:!isShow}"
        />
        </view>
      <view >
        <button class="baseBtn" :class="isShow==true ?'showBtn' :''" @tap="navToIntro">欢迎来到CAT</button>
      </view>
  </view>
</template>

<script lang="ts" setup>
import {  ref } from 'vue'
let isShow = ref(false)
function showBtn() {
  isShow.value = true
}
function navToIntro() {
  uni.switchTab({
    url:'/pages/intro/intro'
  })
}
</script>

<style scoped lang="css">
.homePage{
  position: relative;
  width: 100%;
  height: 100vh;
}
/* log-poping animation */
@keyframes logoPop{
  0%{
    transform: scale(1);
  }
  50%{
    transform: scale(1.5);
  }
  100%{
    transform: scale(1);
  }
}
/* logo-up animation */
@keyframes logoUp{
  0%{
    transform: translateX(-50%)  translateY(-50%) scale(1);
  }
  100%{
   transform: translateX(-50%)  translateY(-500rpx) scale(0.6);
  }
}
/* logo图片样式，大小和动画效果 */
.logoImg{
  width: 444rpx;
  animation: logoPop 1s linear infinite;
}
/* logoBox样式 主要定外面的位置*/
.logo{
  position:absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.upLogo{
  animation:logoUp 1s linear;
  animation-fill-mode:forwards;
  transition: 1s;
}
/* logo结束 */

@keyframes come{
  0%{
    transform: translateX(-50%) scale(0);
  }
  75%{
    transform: translateX(-50%) scale(1.5);
  }
  100%{
    background: linear-gradient(#a7e0b6,#73c088);
    transform: translateX(-50%) scale(1);
  }
}
/* btn */
.baseBtn{
  display: none;
  position: absolute;
  top: 65%;
  left: 50%;
  width: 350rpx;
  height: 100rpx;
  border-radius: 10%;
  color:#fff;
  transition: 1.3s;
  transform: scale(0);
  background: linear-gradient(#a7e0b6,#73c088);
  cursor: pointer;
}
.showBtn{
  display: block;
  animation: come 1.3s linear;
  animation-fill-mode: forwards;
}
</style>
