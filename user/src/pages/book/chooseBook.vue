<template>
    <h1 class="title">预约阶段</h1>
    <view class="container">
      <view class="interview" @click="turn('book')">面试</view>
      <view class="first">一轮考核答辩</view>
      <view class="second">二轮考核答辩</view>
    </view>
  </template>
  
  <script lang="ts" setup>
  function turn(book:string){
    uni.navigateTo({
	url: 'book'
});
  }
  </script>
  
  <style scoped>
  .container {
    display: flex;                 
    flex-direction: column;         
    align-items: center;        
    justify-content: flex-start;  
    height: 100%;                 
    background-color: #f4f4f4;    
  }
  
  .interview,
  .first,
  .second {
    height: 100px;                 
    width: 250px;                  
    border-radius: 10px;          
    margin: 10px 0;                
    text-align: center;           
    color: white;                 
    font-size: 20px;               
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); 
    display: flex;                
    align-items: center;           
    justify-content: center;        
    transition: transform 0.3s ease; /* 添加过渡效果 */
  }
  
  /* 悬停效果 */
  .interview:hover,
  .first:hover,
  .second:hover {
    transform: scale(1.05); 
  }
  
  .interview {
    background-color: #4CAF50;     
    border: 2px solid #388E3C;     
  }
  
  .first {
    background-color: #2196F3;      
    border: 2px solid #1976D2;      
  }
  
  .second {
    background-color: #FF9800;      
    border: 2px solid #F57C00;      
  }
  
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
  
  h1 {
    margin: 10px auto;
    font-size: 2.5em; /* 调整标题大小 */
  }
  </style>
  