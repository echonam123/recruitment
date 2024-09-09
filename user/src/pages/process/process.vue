<template>
	<view>
		<h2 class="title">招新流程</h2>
        <uni-section>
			<uni-steps :options="list1" :active="current" :active-color="currentStepColor"/>
		</uni-section>
		<view class="content">
			<image
				src="../../static/cat-4.png"
				mode="scaleToFill"
				class="animated-cat"
				style="height: 40px; width: 100px; margin-left: 260px; margin-top: 30px;"
			/>
				<swiper class="swiper-box" @change="change1" :current="swiperDotIndex">
					<swiper-item v-for="(item, index) in list1" :key="index">
						<view class="swiper-item" :class="'swiper-item' + index">
							<text style="color:white; font-size: 14px;">{{item.content}}</text>
						</view>
					</swiper-item>
				</swiper>
		</view>
		<image
			src="../../static/cat-3.png"
			mode="scaleToFill"
			style="width: 100%; height: 100px; margin-bottom: 0;"
		/>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				active: 1,
				list1: [{
					title: '报名',
                    content: '在小程序中填写自己的个人信息和选择的方向进行报名。',
					color: '#a5f389'
				}, {
					title: '面试',
                    content: '这个阶段的面试主要为了了解各位同学对自己所选方向的了解程度，同时了解各位同学的团队合作态度以及处事风格',
					color: '#b2cef7'
				}, {
					title: '第一轮考核',
                    content: '此轮考核正式考验各位同学对技能的掌握程度和实践程度，也是最应该好好准备的-个阶段，让大家更深入体验所选方向的编程之旅',
					color: '#85e7f9'
				}, {
					title: '第二轮考核',
                    content: '二轮考核是一轮考核的更进一步的提升，对技术能力要求也会略有提升，但是不必害怕，只要坚持到最后，胜利就在眼前!',
					color: '#f1c469'
				}],
                modeIndex: -1,
				styleIndex: -1,
				current: 0,
				mode: 'default',
				dotsStyles: {},
				swiperDotIndex: 0,
				currentStepColor: '#a5f389' // 初始化为第一个步骤的颜色
			}
		},
		methods: {
            change1(e) {
				this.current = e.detail.current;
				this.swiperDotIndex = e.detail.current;
				// 更新当前步骤的颜色
				this.currentStepColor = this.list1[this.current].color;
			},
			selectStyle(index) {
				this.dotsStyles = this.dotStyle[index];
				this.styleIndex = index;
			},
			selectMode(mode, index) {
				this.mode = mode;
				this.modeIndex = index;
				this.styleIndex = -1;
				this.dotsStyles = this.dotStyle[0];
			}
		}
	}
</script>

<style scoped>
.title {
    text-align: center;
    background: linear-gradient(90deg, #f67252, #92fa7d);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 26px;
    animation: bounce 3s infinite;
	margin-top: 40px;
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-15px);
    }
    60% {
        transform: translateY(-15px);
    }
}

.content {
    padding: 20px;
}
.swiper-box {
    height: 200px;
	margin-bottom: 10px;
}

.swiper-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 6px;
    color: black;
}

.uni-swiper-dot-box {
    position: relative;
    margin-top: 10px;
}

.swiper-item0 {
	background-color: #a5f389;
}
.swiper-item1 {
	background-color: #b2cef7;
}
.swiper-item2 {
	background-color: #85e7f9;
}
.swiper-item3 {
	background-color: #f1c469;
}

.animated-cat {
    animation: moveCat 4s infinite ease-in-out;
}

@keyframes moveCat {
    0% {
        transform: translateX(0);
    }
    50% {
        transform: translateX(-220px); /* 移动的距离 */
    }
    100% {
        transform: translateX(0);
    }
}
</style>
