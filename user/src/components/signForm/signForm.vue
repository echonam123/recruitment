<template>
  <view class="form">
    <view class="form-item">
      <view class="form-label">姓名</view>
      <view class="form_content">
        <input type="text" placeholder="请输入姓名" v-model="signInfo.name">
        <text class="msg">{{ message.name}}</text>
      </view>
    </view>
    <view class="form-item">
      <view class="form-label">学院</view>
      <view class="form_content">
        <input type="text" placeholder="请输入学院名称" v-model="signInfo.college">
        <text class="msg">{{ message.college }}</text>
      </view>
    </view>
    <view class="form-item">
      <view class="form-label">专业</view>
      <view class="form_content">
        <input type="text" placeholder="请输入专业名称" v-model="signInfo.major">
        <text class="msg">{{ message.major }}</text>
      </view>
    </view>
    <view class="form-item">
      <view class="form-label">班级</view>
      <view class="form_content">
        <input type="text" placeholder="请输入班级名称" v-model="signInfo.className">
        <text class="msg">{{ message.className }}</text>
      </view>
    </view>
    <view class="form-item">
      <view class="form-label">学号</view>
      <view class="form_content">
        <input type="text" placeholder="请输入学号" v-model="signInfo.studentId">
        <text class="msg">{{ message.studentId }}</text>
      </view>
    </view>
    <view class="form-item">
      <view class="form-label">邮箱</view>
      <view class="form_content">
        <input type="text" placeholder="请输入邮箱" v-model="signInfo.phone">
        <text class="msg">{{ message.phone }}</text>
      </view>
    </view>
    <view class="form-item">
      <view class="form-label">考核方向</view>
      <view class="form_content">
        <radio-group style="display: flex;" @change="changeRadio">
          <label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in radioItems" :key="item.value" style="display: flex; margin-right: 40rpx;">
            <view>
              <radio :value="item.value" :checked="index==0" />
            </view>
            <view>{{item.name}}</view>
          </label>
			</radio-group>
      </view>
    </view>
    <view class="form-item" style="flex-direction: column; align-items: start;">
      <view class="form-label" style="margin-bottom: 10rpx;">自我介绍</view>
      <view class="form_content">
        <textarea
        v-model="signInfo.introduction"
        placeholder="简单地进行一个自我介绍吧~"
        />
        <view class="msg">{{ message.introduction }}</view>
      </view>
    </view>
    <button class="submitBtn" @tap="submit">提交</button>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { http } from '@/utils/http'
const emit = defineEmits(['signIn'])

//收集方向信息
let radioItems = ref(
  [{
  name: '前端',
  value: '1'
  },
  {
  name: '后台',
  value:'2'
  }]
)
function changeRadio(e) {
  signInfo.value.direction = Number(e.detail.value)
}

let signInfo = ref({
  college: '',
  major: '',
  className: '',
  direction: 1,
  name: '',
  studentId: '',
  phone: '',
  introduction: ''
})
let message = ref({
  college: '',
  major: '',
  className: '',
  name: '',
  studentId: '',
  phone: '',
  introduction: ''
})
function clearMsg() {
  for (let k in message.value) {
    message.value[k] = ''
  }
}
//判断信息是否有效
async function checkValid() {
  //空
  for (let k in signInfo.value) {
    if (signInfo.value[k] == '') {
      message.value[k] = '不能为空'
    }
  }
  //判断邮箱
  let reg = /^[1-9][0-9]{4,}@qq.com$/
  if (!reg.test(signInfo.value.phone)) {
    message.value.phone = '请输入有效邮箱'
  }
  //判断自我介绍字数
  if (signInfo.value.introduction.length < 30) {
    message.value.introduction = '有点少诶，再多说几句让我们了解你~'
  }
  //判断学号
  let reg1 = /^3[12]2400\d{4}$/
  if (!reg1.test(signInfo.value.studentId)) {
    message.value.studentId = '学号格式错误'
  }
  let reg2 = /\u73ED/
  if (!reg2.test(signInfo.value.className)) {
    message.value.className = '请以XX班格式填写'
  }
  //判断是否有效
  for (let k in message.value) {
    if (message.value[k] !== '') {
      return
    }
  }
  // //发送请求
  uni.showLoading({ title: '正在提交报名信息...' })
  try {
    await http({
      url: '/user/info',
      method: 'POST',
      data:signInfo.value
    })
    uni.hideLoading()
    emit('signIn')
  } catch (err) {
    uni.hideLoading()
    if (err !== 'token失效，请重新登录') {
			uni.showToast({
				icon: 'none',
				title: '网络错误'
			})
		} 
		console.log('出错了', err)
  }
}
function submit() {
  clearMsg()
  checkValid()
}
</script>

<style scoped lang="less">
  .form{
    margin: 20rpx auto;
    width: 90%;
    background-color: #fff;
    border-radius: 1.5%;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    padding: 20rpx 20rpx;
    .form-item{
      margin: 30rpx 15rpx;
      display: flex;
      align-items: center;
      .form-label{
        flex: 0.5;
      }
    }
  }
  input{
    border: 1px solid #e5e5e5;
    border-radius: 5%;
    padding: 15rpx 20rpx;
  }
  .form-content{
    flex-grow: 1;
  }
  .msg{
    width: 100%;
    height: 24rpx;
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: red;
  }
  textarea{
    box-sizing: border-box;
    resize: none;
    border: 1px solid #e5e5e5;
    border-radius: 5%;
    padding: 15rpx 20rpx;
  }
  .submitBtn{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100rpx;
    font-weight: 700;
    color: #fff;
    background-color: #7fd7d0;
  }
</style>