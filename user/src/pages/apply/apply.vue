<template>
  <view class="apply" :class="activeIndex===1?'applyed':''">
    <view class="timeline">
      <view class="step">
        <view class="timeline-item_node" :class="activeIndex>=0?'node_active':''"></view>
        <text :class="activeIndex==0?'text_active':''">填写报名信息</text>
      </view>
      <view class="timeline-item_tail" :class="activeIndex==1?'tail_active':''"></view>
      <view class="step">
        <view class="timeline-item_node" :class="activeIndex==1?'node_active':''"></view>
        <text :class="activeIndex==1?'text_active':''">报名成功</text>
      </view>
    </view>
    <view class="applyBox">
      <signForm  v-if="!activeIndex" @signIn="isSignin"/>
      <successSign v-else/>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { http } from '@/utils/http'
import signForm from '@/components/signForm/signForm.vue'
import successSign from '@/components/successSign/successSign.vue';

let activeIndex = ref(0)
async function isSignin() {
  try {
    let res = await http({
      url: '/user/user',
      method:'GET'
    })
    //查看是否报名
    if (!res) {
      activeIndex.value = 0
    } else {
      activeIndex.value = 1
    }
  } catch (err) {
      if (err !== 'token失效，请重新登录') {
			uni.showToast({
				icon: 'none',
				title: '网络错误'
			})
		} 
		console.log('出错了', err)
  }
}
isSignin()
</script>

<style scoped lang="less">
  .apply{
    padding: 20rpx 0;
    width: 100%;
    height: 100%;
    background-color: #cbfdd8;
  }
  .applyed{
    padding: 0;
    margin: 0;
    height:100vh;
    overflow: hidden;
    background-color: #fff;
  }
  .timeline{
    padding-top: 20rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .step{
      display: flex;
      margin: 0 20rpx;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .timeline-item_node{
        margin-bottom: 10rpx;
        background-color: #FFFFFF;
        border-radius: 50%;
        width: 22rpx;
        height: 22rpx;
        background: #fff;
        border: 6rpx solid #e5e5e5;
      }
      .node_active{
        border: 6rpx solid #6DD1C9;
      }
      text{
        color: #e5e5e5;
      }
      .text_active{
        color: #6DD1C9;
      }
    }
    .timeline-item_tail {
      margin: -50rpx 0 0 0;
      width: 100rpx;
      height: 100%;
      border-top: 3rpx solid rgba(109, 209, 201, 0.3);
    }
    .tail_active{
      border-top: 3rpx solid rgba(109, 209, 201, 0.3);
    }
  }
</style>