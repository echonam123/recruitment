<template>
    <!-- 定义一个按钮，用于打开弹出层 -->
    <view class="container">
        <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar"    :disabled="!isLoggedIn">
            <image class="avatar" :src="avatarUrl"></image>
        </button> 
        <!-- 用户信息区域 -->
        <view class="user-info">
            <text class="user-name">用户</text>
            <text class="user-description">登录以获取更多服务</text>
        </view>
        <button @click="handleLoginAndGetProfile" class="btn-login">一键登录</button>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { http } from '@/utils/http';
const isLoggedIn = ref(false); // 添加状态变量
const avatarUrl = ref('../../static/0.png'); // 默认头像地址
//提交自己的头像
const onChooseAvatar = (event: { detail: { avatarUrl: any; }; }) => {
    const { avatarUrl: newAvatarUrl } = event.detail;
    if (newAvatarUrl) {
        avatarUrl.value = newAvatarUrl; // 更新头像URL
    }
}
//提交登录code
const validLogin = (params: { code: any; sf: string; }) => {
    return http<{ token: string }>({
        url:'https://39.106.69.15:8081/user/login',
        method: 'POST',
        data: params
    });
};
//
const wxLogin = (loginRes: any) => {
    return new Promise((resolve, reject) => {
        const { errMsg, code } = loginRes;
        if (errMsg.indexOf('ok') !== -1) {
            validLogin({ code, sf: '1' }).then(res => {
                uni.setStorageSync('token', res.data.token); 
                resolve(res);
            }).catch(err => {
                console.log(err);
                reject();
            });
        } else if (errMsg.indexOf('fail') !== -1) {
            uni.showToast({
                title: 'wx.login出错,请退出重新进入',
                duration: 2000
            });
            reject();
        }
    });
};
const login = () => {
    return new Promise((resolve, reject) => {
        uni.login({
            success: res => {
                console.log(res);
                resolve(res);
            },
            fail: err => {
                console.log(err);
                reject(err);
            }
        });
    });
};
const handleLogin = async () => {
    try {
const loginRes = await login() // 返回登录的Promise
;
await wxLogin(loginRes);
console.log('用户已成功登录');
} catch (err) {
console.error('登录失败:', err);
}
};
//获取用户信息
const getUserProfile = () => {
	return new Promise((resolve, reject) => {
		uni.getUserProfile({
			desc: '用户登录',
			success: (info_res) => {
				resolve(info_res)
        console.log(info_res)
			},
			fail: err => {
				reject(err)
        console.log(err)
			}
		})
	})
}
const handleLoginAndGetProfile = () => {
    handleLogin().then(() => {
        isLoggedIn.value = true;
        return getUserProfile(); // 登录成功后再获取用户信息
    }).catch(err => {
        console.error('登录失败:', err);
    });
};
// 检测用户的登录状态
const checkUserAuth = () => {
    return new Promise((resolve, reject) => {
        // 用户登录的token
        const userLoginToken = uni.getStorageSync('token');
        const returnRes = {
            code: 0,
            status: '',
            message: ''
        };
        if (!userLoginToken) {
            returnRes.code = userLoginToken;
            returnRes.message = '未获取到登录状态码';
            reject(returnRes);
        } else {
            // 如果未登录，跳转到登录页面
            uni.showModal({
                title: '提示',
                content: '您尚未登录，是否登录？',
                success: function(res) {
                    returnRes.code = userLoginToken;
                    returnRes.status = '未登录';
                    if (res.confirm) {
                        uni.navigateTo({
                            url: 'pages/myth/myth',
                        });
                    }
                    resolve(returnRes);
                }
            });
        }
    });
};

</script>

<style>
.container {
    position: relative;
    margin-top: -45px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 90px;
    background-color: rgb(232, 246, 252);
    border-radius: 10px;
    margin-left: 10px;
    margin-right: 10px;
}

.avatar {
    position: absolute;
    height: 70px;
    width: 70px;
    border-radius: 50%; /* 圆形头像 */
    object-fit: cover; /* 确保头像内容不变形 */
    left: -2px;
}

.avatar-wrapper {
    height: 70px; 
    width: 70px;  
    border-radius: 50%; 
    margin-right: 10px;
    background-color: #f4f8fb;
    position: relative;
}

.user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 5px;
    margin-right: 50px;
}

.user-name {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
    margin-left: 0;
}

.user-description {
    font-size: 12px;
    color: #666;
}

.btn-login {
    width: 110px;
    height: 30px;
    padding: 10px 10px;
    background-color: #7fcbeb;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-login:hover {
    background-color: #0056b3;
}
</style>
