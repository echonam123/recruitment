<template>
  <view>
    <image src="../../static/cat.jpg" mode="scaleToFill" />
  </view>
  <Login></Login>
  <uni-list>
    <uni-list-item
      title="报名"
      link
      @click="onClick('/pages/apply/apply')"
      thumb="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn1oKT268G5xIiKXuNkUiGyxZxy6mHx2MTrw&s" 
    ></uni-list-item>
    <uni-list-item
      title="当前进程"
      link
      @click="onClick('/pages/currentProcess/currentProcess')"
      thumb="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYsaONChSIgVSM6U1IwUKA7LD_dt_udkBmUw&s" 
    ></uni-list-item>
    <uni-list-item
      title="预约"
      link
      @click="onClick('/pages/book/book')"
      thumb="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVp43omVTE3BTTabv7tchc2H-M385zQe_dCA&s"
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

const currentStageId = ref<number | null>(null)
const onClick = (page: string) => {
  currentStageId.value=uni.getStorageSync('currentStageId')
  if (currentStageId.value === 1 || currentStageId.value === null) {
    uni.showToast({ title: '暂未开放', icon: 'none' })
    return
  }
  uni.navigateTo({ url: page })
}
const fetchStages = async (): Promise<void> => {
  try {
    const response = await http<{
[x: string]: any; data: Stage[] 
}>({
      url: '/stage/listStage',
      method: 'GET'
    })
    const stages = response
    const now = new Date()
    //比较时间限制阶段开放
    const currentStage = stages.find(stage => {
      const start = new Date(stage.startTime)
      const end = new Date(stage.endTime)
      return now >= start && now <= end
    })
    if (currentStage) {
      currentStageId.value = currentStage.stageId
      uni.setStorageSync('currentStageId', currentStageId.value)
      uni.setStorageSync('currentStageName', currentStage.stageName)
    } else {
      currentStageId.value = null
      uni.removeStorageSync('currentStageId')
      uni.removeStorageSync('currentStageName')
    }
  } catch (error) {
    console.error('获取阶段失败:', error)
    currentStageId.value = null
  }
}
onMounted(() => {
  fetchStages()
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
