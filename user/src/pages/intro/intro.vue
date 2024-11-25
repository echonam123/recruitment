<template>
  <swiper class="intro" @change="changeColor" :current="currentPage" indicator-dots :indicator-active-color="colorList[currentPage]">
     <!-- 工作室概况 -->
    <swiper-item>
      <view class="intro-title">
        <view class="tag">
          <uni-tag 
          text="工作室概况"
					custom-style="background-color: #6eb883; border-color: #6eb883; color: #fff; font-weight:700; font-size: 40rpx;"
          >
					</uni-tag>
          <view class="line"></view>
        </view>
      </view>
      <view class="contentBox" style="border:1px solid rgb(110, 184, 131);">
        <view class="content-top" :style="{
            'backgroundColor': 'rgba(110, 184, 131,.6)',
            'borderBottom:' :'1px solid rgb(110, 184, 131)'
        }"></view>
        <view class="content">
          <image
            src="@/static/logo2.png"
            mode="widthFix"
          />
          <view class="content-text">
            <text>
              C.A.T工作室，成立于2017年，指导老师为梁祖红教授，分为前端和后台两个小组，致力于政府及企业级的大型项目开发，团队与玉兰集团、南方电网等公司建立了长期合作关系，近年来研发过广东省专家匹配系统、智能塑料回收瓶箱(与羊城通合作)等，同时组队参与 App、小程序大赛并获得奖项，已有毕业师兄就职于一线互联网大厂。
            </text>
          </view>
        </view>
      </view>
    </swiper-item>
    <!-- 成就 -->
    <swiper-item>
      <view class="intro-title">
        <view class="tag">
          <uni-tag 
          text="工作室主要成就"
					custom-style="background-color: #f18f12; border-color: #f18f12; color: #fff; font-weight:700; font-size: 40rpx;"
          >
					</uni-tag>
          <view class="line"></view>
        </view>
      </view>
      <view class="contentBox" style="border:1px solid rgb(241, 143, 18);">
        <view class="content-top" :style="{
            'backgroundColor': 'rgba(241, 143, 18,.6)',
            'borderBottom:' :'1px solid rgb(241, 143, 18)'
        }"></view>
        <view class="content">
          <view class="list">
            <view v-for="(item ,index) in achievements" :key="index" class="listItem">
              <view class="list-dot"></view>
              <text>{{item}}</text>
            </view>
          </view>
        </view>
      </view>
    </swiper-item>
    <!-- 招新方向 -->
    <swiper-item>
      <view class="intro-title">
        <view class="tag">
          <uni-tag 
          text="招新方向"
					custom-style="background-color: #84b9db; border-color: #84b9db; color: #fff; font-weight:700; font-size: 40rpx;"
          >
					</uni-tag>
          <view class="line"></view>
        </view>
      </view>
      <view class="contentBox" style="margin:10rpx 0 ;padding:5rpx; border:1px solid rgb(132, 185, 219);" v-for="(item,index) in directions" :key="index">
         <view class="content-top" :style="{
            'backgroundColor': 'rgba(132, 185, 219,.6)',
            'borderBottom:' :'1px solid rgb(132, 185, 219)'
        }"></view>
        <view class="content">
          <view class="dirTitle"><view class="dot"></view>{{ item.title }}<view class="dot"></view></view>
          <view class="dirDesc">{{ item.desc }}</view>
        </view>
      </view>
    </swiper-item>
    <!-- QA你问我答 -->
    <swiper-item>
      <scroll-view scroll-y style="height:100%;">
        <view class="intro-title">
          <view class="tag">
            <uni-tag 
            text="你问我答"
            custom-style="background-color: #f44e40; border-color: #f44e40; color: #fff; font-weight:700; font-size: 40rpx;"
            >
            </uni-tag>
            <view class="line"></view>
          </view>
        </view>
        <uni-card :is-shadow="false" class="Box_QA" v-for="(item,index) in QA_List" :key="index" scroll-wrap margin="0 20rpx">
          <view class="content_Q">{{ item.Q }}</view>
          <view class="content_A">
            {{ item.A }}
          </view>
        </uni-card>
      </scroll-view>
    </swiper-item>
    <!-- 日常 -->
    <swiper-item>
      <scroll-view scroll-y style="height:100%;">
        <view class="intro-title" style="margin-bottom: 40rpx;">
          <view class="tag">
            <uni-tag 
            text="日常"
            custom-style="background-color: #c6a2d2; border-color: #c6a2d2; color: #fff; font-weight:700; font-size: 40rpx;"
            >
            </uni-tag>
            <view class="line"></view>
          </view>
        </view>
        <view v-for="item in 5" :key="item" class="imgBox">
          <img :src="`/static/routine${item}.jpg`" alt="" style="width: 100%;" mode="widthFix">
        </view>
      </scroll-view>
    </swiper-item>
  </swiper>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
let currentPage = ref(0)
let colorList = [
  '#a1d8b0','#f4ac1a','#a1cfcf','#f7b4ac','#ebd0ef'
]
let achievements = [
  '国家海洋局南海分局北斗航标系统',
  '广州市供电局运营分析平台',
  '清远市输电运维决策支持系统',
  '"友捎"带货App',
  '广东玉兰集团有限公司B2B订单系统',
  '小鱿鱼智能塑料瓶回收箱',
  '上腾科技云平台系统',
  '"百货校园行"小程序',
  '美丽乡村智慧社区平台',
  '韶关市供电局—基于GIS的可视化规划平台',
  '汕头、湛江的智能配电网辅助决策系统',
  '南方电网—基于GIS智能配电网自动规划系统',
]
let directions = [
  {
    title: '前端',
    desc:`前端负责界面实现以及业务逻辑实现，以优化用户体验为核心目的。UI是Creator，前端是Builder，通过浏览器访问的网站、某些
APP、小程序、电脑上的部分桌面应用都是前端根据UI设计图，通过代码来还原实现。
HTML决定网页有哪些内容和板块，CSS决定网页中内容的样式，JavaScript用于控制网页的功能、与用户交互息息相关。`
  },
  {
    title: '后端',
    desc:`后台开发，通常也称服务器端开发。主要负责业务逻辑功能模块，工作中处理前端的请求，进行逻辑处理和数据交互，现阶段的Web端、移动端等都需要后台技术的支持。C.A.T工作室后台组基于Java语言开发，如果你具备基本的C语言基础，对Java编程感兴趣，有出色的学习能力以及良好的团队协作能力，那么后台组绝对是你的不二选择。`
  }
]
let QA_List = [
  {
    Q: `问：工作室学习的环境氛围如何?`,
    A:'答：我们工作室的伙伴亲切友善，并且愿意带领新伙伴一起学习成长，互帮互助，整体学习氛围比较轻松、欢乐，同时也会定期举办分享会，在自我提升的同时，也促进了其他小伙伴们的进步。'
  },
  {
    Q: `问：工作室的前景怎么样?`,
    A: `答：已有师兄进入到互联网大厂，工作室里能接到政府和企业的项目，也有师兄们打过比赛，无论是对个人成长还是对于日后的就业都有不少帮助。`
  },
  {
    Q: `问：加入我们有福利吗?`,
    A:`答：这个是肯定有的，我们会有定期旅游和零食大礼包，且遇到节日时也会举行团建，欢乐多多，惊喜不断。`
  },
  {
    Q: `问：工作室的规章制度是怎么样的?`,
    A:`答：我们并没有严格的打卡签到制度，相对弹性自由，可以由个人来合理规划自己的时间，在技术提升的同时，也能保证学业的进步，但也希望进来的小伙伴能够自律自觉完成学习任务。`
  },
  {
    Q: `问：招新流程是什么样的呢?`,
    A:`答：今年的招新流程为:笔试、面试、一轮考核与二轮考核。笔试主要考C和简单算法，而面试主要为了了解性格和一些专业知识，最后的考核阶段则是为了检验你的学习能力。`
  }
]
function changeColor(e) {
  currentPage.value = e.detail.current
  uni.setNavigationBarColor({
    frontColor:'#000000',
    backgroundColor: colorList[currentPage.value],
    success: function() {
      // console.log('导航栏颜色设置成功')
    },
    fail: function(res) {
      console.log(res.errMsg)
    }
  })
}
</script>

<style scoped>
swiper{
  height: 100vh;
  width: 100%;
}
swiper-item{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;  
  -webkit-overflow-scrolling: touch;
}
/* 对于基础样式 */
.intro-title{
  margin: 40rpx 0 20rpx;
  position: relative;
  flex: .5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.contentBox{
  flex: 3;
  display: flex;
  flex-direction: column;
  width: 85%;
  margin: 40rpx 0;
}
.content-top{
  width: 100%;
  height: 50rpx;
}
.content{
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.content image{
  width: 80%;
  margin: 30rpx 0 30rpx;
}
.content-text{
  flex-grow:1;
  height: auto;
  padding: 10rpx;
  font-size: 30rpx;
  color: #646464;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* 对于列表样式 */
.list-dot{
  margin: 0 20rpx;
  width: 20rpx;
  height:20rpx;
  border-radius: 50%;
  background: linear-gradient(rgb(241, 143, 18),rgba(241, 143, 18,.5));
}
.listItem{
  display: flex;
  align-items: center;
  font-size: 35rpx;
  color: #646464;
}
.listItem text{
  flex: 1;
}
/* 对于招新方向模块 */
.dot{
  margin: 0 10rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: linear-gradient(rgb(241, 143, 18),rgba(241, 143, 18,.5));
}
.dirTitle{
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  font-weight: 700;
  font-size: 40rpx;
}
.dirDesc{
  padding: 0 20rpx;
  color: #646464;
}
/* QA问答 */
/* Box_QA */
.Box_QA{
  margin: 0 10rpx;
  padding: 0 5rpx;
}
.content_Q{
  text-shadow:
  3px 0px 3px rgba(244, 78, 64,.6),
  -3px 0px 3px rgba(244, 78, 64,.6),
  6px 0px 6px rgba(244, 78, 64,.6),
 -6px 0px 6px rgba(244, 78, 64,.6);
 margin-bottom: 10rpx;
}
/* 对于照片框 */
.imgBox{
  padding: 10rpx;
  margin: 20rpx auto 30rpx auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  border: 5px solid #dfd4f7;
}
</style>