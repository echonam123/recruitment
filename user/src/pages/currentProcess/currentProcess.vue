<template>
	<h2 class="example-info">当前面试状态</h2>
  <view class="content">
    <view class="timeline-list">
      <view v-for="(item, index) in list" :key="index" class="timeline-item">
          <view class="timeline">
            <view class="timeline-item_node" :class="index<=activeIndex? 'node_active':''"></view>
            <view class="timeline-item_tail" :class="index<activeIndex? 'tail_active':''"></view>
          </view>
          <view class="card">
            <view class="card_top">
                <view class="left">{{ item.title }}</view>
                <view class="right" v-if="item.status=='√'" :class="index>activeIndex?'':'statusActive'">
                  <uni-icons type="checkmarkempty" size="30" color="#6DD1C9"></uni-icons>
                </view>
                <view class="right" v-else-if="item.status=='×'" :class="index>activeIndex?'':'statusActive'">
                  <uni-icons type="closeempty" size="30" color="#fbc02d"></uni-icons>
                </view>
                <view class="right" v-else :class="index>activeIndex?'':'statusActive'">
                  {{ item.status }}
                </view>
            </view>
            <view :class="item.desc==''? '':'content_active'">
            <view>{{item.desc}}</view>
            </view>
          </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import {http} from '@/utils/http'
import { ref } from 'vue'
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app';

//页面显示
onShow(() => {
	getStage()
})
// 阶段信息
let list = ref<any>([
{
		"title": '报名',
		"status":'',
		"desc":''
},
{
	"title": '面试',
	"status":'',
	"desc":''
},
{
	"title": '一轮考核',
	"status":'',
	"desc":''
},
{
	"title": '二轮考核',
	"status":'',
	"desc":''
},
{
	"title": 'CAT',
	"status":'',
	"desc":''
}
])

//获取阶段信息
let activeIndex = ref(-1)
// 修改完成阶段的信息
function changeStatus() {
	for (let i = 0; i < list.value.length; i++){
		if (i < activeIndex.value) {
				list.value[i].status = '√'
		}
		else if(i == activeIndex.value){
			if (list.value[i].status == '未开始') {
					list.value[i].status = '正在进行中'
			}
		} else {
			list.value[i].status = '未开始'
			list.value[i].desc = ''
		}
	}
}

//判断时间
function checkCurrentStage(startTime, endTime) {
	let nowTemp = new Date().getTime()
	startTime = new Date(startTime).getTime()
	endTime = new Date(endTime).getTime()
	if (nowTemp >= startTime && nowTemp <= endTime) {
		return '正在进行中'
	} else {
		return ''
	}
}

//获取阶段信息
interface stage{
	stageId: string,
	stageName: string,
	startTime: string,
	endTime: string
}
async function getStage() {
	//淘汰
	function outList(res,outStageName) {
		list.value = []
		for (let i = 0; i < res.length; i++){
			let start = res[i].startTime.split('T')[0]
			let end = res[i].endTime.split('T')[0]
			let status = ''
			let desc = `${start} ~ ${end}`
			if (res[i].stageName === outStageName) {
				activeIndex.value = i
				status = '×'
				desc = '很遗憾没有通过这次考核，但是并不能代表你的全部，加油！'
			}
			list.value.push({
				'title': res[i].stageName,
				'status': status,
				'desc': desc
			})
		}
		//加入最后一个阶段
		list.value.push({
			'title': 'CAT',
			'status': '',
			'desc': ''
		})
		changeStatus()
	}
	//未被淘汰
	function listInfo(res,stageName) {
		list.value = []
		for (let i = 0; i < res.length; i++){
			let start = res[i].startTime.split('T')[0]
			let end = res[i].endTime.split('T')[0]
			let status = checkCurrentStage(res[i].startTime, res[i].endTime)
			if (status !== '') {
				activeIndex.value = i
				if (res[i].stageName != stageName) {
					if (res[i].stageName == '报名') {
						status='未报名'
					} else if (res[i].stageName != '报名' && stageName!='未报名') {
						status='未预约'
					}
				}
			}
			list.value.push({
				'title': res[i].stageName,
				'status': status,
				'desc': `${start} ~ ${end}`
			})
		}
		//加入最后一个阶段
		let isAll = true
		list.value.forEach(ele => {
			if (ele.title !== '') {
				isAll = false
			}
		})
		let finalStatus = '未完成'
		let finalDesc = ''
		if (isAll) {
			activeIndex.value = res.length
			finalStatus = '√'
			finalDesc = '终于等到你，欢迎来到CAT大家庭~'
		}
		list.value.push({
			'title': 'CAT',
			'status': finalStatus,
			'desc': finalDesc
		})
		changeStatus()
	}
	uni.showLoading({ title: '正在加载中...' })
	try {
		//查找所有的阶段信息
		let res = await http<stage[]>({
			url: '/stage/listStage'
		})
		//清空list数组，将阶段信息放入list数组中
		//判断用户阶段状态
		let userStage = uni.getStorageSync('stageName')
		let userIsOut = uni.getStorageSync('out')
		if (userIsOut) {
			outList(res,userStage)
		} else {
			listInfo(res,userStage)
		}
		uni.hideLoading()
		//刷新
		if (isPull.value) {
			uni.stopPullDownRefresh()
			isPull.value = false
		}
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

//上拉刷新功能
let isPull = ref(false)
onPullDownRefresh(async () => {
	if (!isPull.value) {
		isPull.value = true
		await getStage()
		uni.stopPullDownRefresh()
		isPull.value = false
	}
})
</script>

<style lang="less" scoped>
.example-info {
  text-align: center;
  background: linear-gradient(90deg, #f67252, #92fa7d);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 26px;
  margin-top: 20px;
}
// 时间轴样式 
.timeline-list {
    margin: 32rpx;
    margin-top: 62rpx;
    font-size: 28rpx;

		.timeline-item {
			display: flex;
			position: relative;
			padding-bottom: 20rpx;
			&:last-child .timeline-item_tail {
			display: none;
			}
			//时间轴
			.timeline{
				position: absolute;
				height: 100%;
				left: -12rpx;
				display: flex;
				flex-direction: column;
				.timeline-item_node {
					position: absolute;
					background-color: #FFFFFF;
					border-radius: 50%;
					width: 22rpx;
					height: 22rpx;
					background: #fff;
					border: 6rpx solid #e5e5e5;
				}
				.timeline-item_tail {
						position: absolute;
						top:34rpx;
						left: 17rpx;
						height: 100%;
						flex-grow: 1;
						border-left: 3rpx solid #e5e5e5;
				}
				.node_active{
					border: 6rpx solid #6DD1C9;
				}
				.tail_active{
					border-left: 3rpx solid rgba(109, 209, 201, 0.3);
				}
				.node_nobegin{
					border: 6rpx solid #e5e5e5;
				}
				.tail_nobegin{
					border-left: 3rpx solid #e5e5e5;
				}
			}
			//卡片
			.card{
				margin: 0 40rpx 50rpx 70rpx;
				padding: 0 20rpx;
				flex-grow: 1;
				border-radius: 3%;
				box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
				.card_top{
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 20rpx;
					border-bottom: 1px solid rgba(0,0,0,.05);
					.left{
						font-size: 30rpx;
					}
					.right{
						font-size: 24rpx;
						color: #ccc;
					}
					//定义状态样式
					.statusActive{
						color: #6dd1c9;
					}
				}
				//定义状态样式
				.content_active{
					padding: 18rpx;
					color:#646464;
				}

			}
		}
}

</style>