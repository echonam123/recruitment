import { createStore } from 'vuex';
import { CheckApplicants } from '../api/modules/user'; // 替换为实际的 API 函数路径
import { ElMessageBox } from 'element-plus';
export default createStore({
  state: {
    rawData: [] , // 或者使用具体的类型
    token: localStorage.getItem('token'), // 你可以在登录时设置这个 token
    isLoggedIn: false,
    currentAdmin:''
  },
  mutations: {
    setApplicantsData(state:any, data) {
      state.rawData = data;
    },
    setToken(state:any, token:string) {
      state.token = token;
    },
    setLoginStatus(state:any, status:boolean) {
      state.isLoggedIn = status;
    },
    setRate(state, { userId, score, comment }) {
      const user = state.rawData.find((user:any) => user.userId === userId);
      if (user) {
        user.score = score;
        user.comment = comment;
      }
    },
    setCurrentAdmin(state, admin) {
      state.currentAdmin = admin;
    },
  },
  actions: {
    async fetchApplicantsData({ commit, state}) {
      console.log("发送请求获取rawData")
      try {
        const response = await CheckApplicants(state.token);
        console.log("rawData", state.rawData.value); // 确认响应数据
        state.rawData = response.data.data;
        commit('setApplicantsData', response.data.data);
      } catch (error) {
        if (error instanceof Error) {
          // 处理拦截器中抛出的错误
          ElMessageBox.alert(`请求错误: ${error.message}`);
        } else {
          // 处理其他未知错误
          ElMessageBox.alert('查询失败，请检查网络或稍后重试');
        }
      }
    },
  },
  getters: {
    applicantsData: (state) => state.applicantsData,
  },
});