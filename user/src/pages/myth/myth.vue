<template>
  <view>
    <image src="../../static/cat.jpg" mode="scaleToFill" />
  </view>
  <Login></Login>
  <uni-list>
    <uni-list-item
      title="报名"
      link
      @click="navToSign('/pages/apply/apply')"
      thumb='/static/报名.png' 
      thumb-size="sm"
    ></uni-list-item>
    <uni-list-item
      title="当前进程"
      link
      to="/pages/currentProcess/currentProcess"
      thumb="/static/进度.png"
      thumb-size="sm"
    ></uni-list-item>
    <uni-list-item
      title="预约"
      link
      @click="onClick('/pages/book/book')"
      thumb="/static/预约.png"
      thumb-size="sm"
    ></uni-list-item>
  </uni-list>
</template>

<script setup lang="ts">
import Login from "../../components/login/login.vue";
import { ref, onMounted } from 'vue';
import { http } from "@/utils/http";

interface Stage {
  stageId: number
  startTime: string
  endTime: string
  stageName: string
}
interface info{
  out:string
  stageId:number
}
const currentStageId = ref<number | null>(null)
const navToSign = (page:string) => {
  const token = uni.getStorageSync('token')
  if (!token) {
    uni.showModal({
      title: '提示',
      content: '您尚未登录，是否登录？',
      success: function(res) {
        if (res.confirm) {
          uni.switchTab({
            url: '/pages/myth/myth',
          })
        }
      }
    })
    return 
  }
  if (uni.getStorageSync('currentStageName') != '报名' && uni.getStorageSync('stageId') ==0) { 
    uni.showToast({ title: '暂未开放', icon: 'none' })
    return
  }
  uni.navigateTo({ url: page })
}
const onClick = (page: string) => {
  currentStageId.value=uni.getStorageSync('currentStageId')
  const out=uni.getStorageSync('out')
  console.log(currentStageId.value)
  const token=uni.getStorageSync('token')
  if (currentStageId.value === 1||out===true) {
    uni.showToast({ title: '未开放', icon: 'none' })
    return
  }
  uni.navigateTo({ url: page })
  if(token===null){
    uni.showModal({
      title: '提示',
      content: '您尚未登录，是否登录？',
      success: function(res) {
        if (res.confirm) {
          uni.switchTab({
            url: '/pages/myth/myth',
          })
        }
      }
    })
  }
}
const fetchStages = async (): Promise<void> => {
  try {
    const response = await http<{
    [x: string]: any;
    data: Stage[] 
    }>({
      url: '/stage/listStage',
      method: 'GET'
    })
    const stages = response
    const now = new Date()
    //比较时间获取stageid，以展示预约时间
    const currentStage = stages.find((stage: { startTime: Date; endTime: Date; }) => {
      const start = new Date(stage.startTime)
      const end = new Date(stage.endTime)
      return now >= start && now <= end
    })
    if (currentStage) {
      currentStageId.value = currentStage.stageId
      uni.setStorageSync('currentStageId', currentStageId.value)
      uni.setStorageSync('currentStageName', currentStage.stageName)
    }
  } catch (error) {
    console.error('获取阶段失败:', error)
  }
}
  async function fetchUserInfo()
  {
      try {
    const response = await http<info>({
    url: '/user/user',
    method: 'GET'
    });
      uni.setStorageSync('out', response.out)
      uni.setStorageSync('stageId', response.stageId)
    } catch (error) {
    console.error('获取用户信息失败:', error);
    }
  }
onMounted(() => {
  fetchStages()
  fetchUserInfo()
})
</script>
<style>
page {
  background-color: rgb(218, 243, 234);
}
image {
  width: 100%;
  z-index: 1;
  margin-bottom: 0;
  height: 260px;
}
.message {
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
  color: red;
}
</style>
