<template>
    <!-- 定义一个按钮，用于打开弹出层 -->
    <view class="container">
        <button 
            class="avatar-wrapper" 
            open-type="chooseAvatar" 
            @chooseavatar="onChooseAvatar" 
            :disabled="!isLoggedIn"
        >
            <image class="avatar" :src="avatarUrl"></image>
        </button> 
        <!-- 用户信息区域 -->
        <view class="user-info">
            <text class="user-name">{{ userName }}</text>
            <text class=".user-description">{{ isLoggedIn ? '欢迎回来' : '登录获取更多详情' }}</text>
        </view>
        <button 
            v-show="!isLoggedIn" 
            @click="handleLoginAndGetProfile" 
            class="btn-login"
        >
            一键登录
        </button>
    </view>
</template><script setup lang="ts">
import { ref, onMounted } from 'vue';

const isLoggedIn = ref(false); // 登录状态变量
const avatarUrl = ref<string>('../../static/0.png'); // 默认头像地址
const fixedAvatarUrl = ref<string>(''); // 用于存储微信头像 URL
const userName = ref<string>('用户'); // 默认用户名

interface TokenData {
    token: string;
}

interface ApiResponse {
    data: TokenData;
}

// 提交自己的头像
const onChooseAvatar = (event: { detail: { avatarUrl: any; }; }) => {
    const { avatarUrl: newAvatarUrl } = event.detail;
    if (newAvatarUrl) {
        avatarUrl.value = newAvatarUrl // 更新头像URL
        fixedAvatarUrl.value = newAvatarUrl;
        // 更新本地存储
        const userProfile = uni.getStorageSync('userProfile');
        if (userProfile) {
            uni.setStorageSync('userProfile', {
                ...userProfile,
                avatarUrl: newAvatarUrl
            });
        }
    }
}

// 提交登录code
const validLogin = (code: string) => {
    return new Promise<TokenData>((resolve, reject) => {
        uni.request({
            url: 'https://39.106.69.15:8081/user/login',
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            data: {
                code
            },
            success: (res) => {
                if (res.statusCode === 200) {
                    const response = res.data as ApiResponse;
                    const token = response.data.token;
                    resolve({ token });
                } else {
                    reject(new Error('Login failed'));
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}

const wxLogin = (loginRes: any) => {
    return new Promise((resolve, reject) => {
        const { errMsg, code } = loginRes;
        if (errMsg.indexOf('ok') !== -1) {
            validLogin(code).then(data => {
                uni.setStorageSync('toke', data.token); // 存储token
                resolve(data);
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        } else {
            uni.showToast({
                title: 'wx.login出错,请退出重新进入',
                duration: 2000
            });
            reject(new Error('wx.login failed'));
        }
    });
}

const login = () => {
    return new Promise((resolve, reject) => {
        uni.login({
            success: res => {
                resolve(res);
            },
            fail: err => {
                console.log(err);
                reject(err);
            }
        });
    });
}

const handleLogin = async () => {
    uni.showLoading({ title: '正在登录中...' });
    try {
        const loginRes = await login();
        console.log(loginRes);
        await wxLogin(loginRes);
        console.log('用户已成功登录');
        // 从服务器获取用户信息
        const userProfile = await getUserProfile();
        // 存储用户信息
        uni.setStorageSync('userProfile', {
            avatarUrl: avatarUrl.value,
            userName: userProfile
        });
        isLoggedIn.value = true;
    } catch (err) {
        console.error('登录失败:', err);
    } finally {
        uni.hideLoading();
    }
}

// 获取用户信息
const getUserProfile = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        uni.getUserInfo({
            success: function(res) {
                const { nickName, avatarUrl: userAvatarUrl } = res.userInfo;
                if (typeof nickName === 'string') {
                    avatarUrl.value = userAvatarUrl || avatarUrl.value; // 更新头像URL
                    resolve(nickName); // 返回用户名
                } else {
                    reject(new Error('获取用户昵称失败'));
                }
            },
            fail: function(err) {
                reject(err);
            }
        });
    });
}

const handleLoginAndGetProfile = () => {
    handleLogin().then(() => {
        if (isLoggedIn.value) {
            getUserProfile().then((nickName: string) => {
                // 更新用户信息显示
                userName.value = nickName;
            }).catch(err => {
                console.error('获取用户信息失败:', err);
            });
        }
    }).catch(err => {
        console.error('处理登录和获取用户信息失败:', err);
    });
}

// 检测用户的登录状态
const checkUserAuth = () => {
    return new Promise((resolve, reject) => {
        const userLoginToken = uni.getStorageSync('token');
        if (userLoginToken) {
            isLoggedIn.value = true;
            const storedProfile = uni.getStorageSync('userProfile');
            if (storedProfile) {
                avatarUrl.value = storedProfile.avatarUrl;
                userName.value = storedProfile.userName;
            }
            resolve(userLoginToken);
        } else {
            uni.showModal({
                title: '提示',
                content: '您尚未登录，是否登录？',
                success: function(res) {
                    if (res.confirm) {
                        uni.navigateTo({
                            url: 'pages/myth/myth',
                        });
                    }
                }
            });
        }
    });
}

onMounted(async () => {
    try {
        await checkUserAuth(); // 页面加载时检查用户是否已登录
    } catch (error) {
        uni.navigateTo({
            url: '/pages/myth/myth'
        });
    }
});
</script>

<style>
.container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 90px;
    background-color: rgb(232, 246, 252);
    border-radius: 10px;
    margin: 10px;
}

.avatar-wrapper {
    position: absolute; /* 确保头像位置固定 */
    height: 70px; 
    width: 70px;  
    border-radius: 50%; 
    margin-right: 10px;
    background-color: #f4f8fb;
    left: 10px; /* 调整头像的位置 */
}

.avatar {
    position: absolute;
    height: 70px;
    width: 70px;
    border-radius: 50%;
    object-fit: cover;
    left: -5px;
}

.user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 65px;
    margin-right: 50px;
}

.user-name {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
}

.user-description {
    font-size: 12px;
    color: #666;
}

.btn-login {
    position: absolute; /* 确保登录按钮位置固定 */
    bottom: 30px;
    right: 10px;
    width: 100px;
    height: 30px;
    padding: 10px;
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
