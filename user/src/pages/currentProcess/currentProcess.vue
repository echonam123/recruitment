<template>
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
let isPull = ref(false)
let activeIndex = ref(-1)
// 修改完成阶段的信息
function editStatus() {
	for (let i = 0; i < list.value.length; i++){
		if (i < activeIndex.value) {
				list.value[i].status = '√'
		}
		else if(i == activeIndex.value){
				list.value[i].status = '正在进行中'
		} else {
				list.value[i].status = '未开始'
		}
	}
	console.log(list.value)
}

//获取阶段信息
interface userInfo{
	userId: number,
  college: string,
  major: string,
  className: string,
  direction: number,
  name: string,
  studentId: string,
  phone: string,
  introduction: string,
  avatar: string,
  stageId: number,
  stageName: string,
  out: boolean
}
interface stage{
	stageId: string,
	stageName: string,
	startTime: string,
	endTime: string
}
async function getStage() {
	// 发送请求查询进度
	try {
		//查找所有的阶段信息
		let res = await http<stage[]>({
			url: '/stage/listStage'
		})
		//清空list数组，将阶段信息放入list数组中
		list.value = []
		res.forEach(ele => {
			let start = ele.startTime.split('T')[0]
			let end = ele.endTime.split('T')[0]
			list.value.push({
				'title': ele.stageName,
				'status': '',
				'desc': `${start} ~ ${end}`
			})
		})
		//加入最后一个阶段
		list.value.push({
			'title': 'CAT',
			'status': '',
			'desc': ''
		})
		//获取用户信息
		let r = await http<userInfo>({
			url: '/user/user'
		})
		//看是否有报名，没有报名则没有报名信息
		let stageName = ''
		let isOut = false
		if (r) {
			isOut = r.out
			stageName = r.stageName
		} else {
			//若没有报名查看当前时间所处阶段
			list.value.forEach(ele => {
				let nowTemp = new Date().getTime()
				if (nowTemp >= new Date(ele.startTime).getTime() && nowTemp <= new Date(ele.endTime).getTime()) {
					stageName = ele.title
				}
			})
		}
		//更改当前阶段的信息
		list.value.forEach((ele) => {
			if (ele.title == stageName) {
				//判断是否被淘汰
				if (isOut) {
					ele.status = '×'
					ele.desc = '很遗憾没有通过这次考核，但是并不能代表你的全部，加油！'
				} else {
					ele.status = '正在进行中'
					//判断是否完成所有阶段
					if (stageName == 'CAT') {
						ele.desc = '终于等到你，欢迎来到CAT大家庭~'
					}
				}
			}
		})
		//修改激活状态索引
		list.value.forEach((ele, index) => {
			if (ele.status == '正在进行中') {
				activeIndex.value = index
			}
		})
		editStatus()
		if (isPull.value) {
			uni.stopPullDownRefresh()
			isPull.value = false
		}
	} catch (err) {
		uni.showToast({
			icon: 'none',
			title:'网络错误'
		})
		console.log('出错了',err)
		
	}
}

//上拉刷新功能
onPullDownRefresh(() => {
	isPull.value = true
	getStage()
})
</script>

<!-- 时间轴样式 -->
<style lang="less" scoped>
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