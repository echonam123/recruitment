import { createStore } from 'vuex';
import { CheckApplicants } from '../api/modules/user'; // 替换为实际的 API 函数路径
import { Applicant } from '../api/base';

export default createStore({
  state: {
    rawData: [] , // 或者使用具体的类型
    token: 'Bearer '  + localStorage.getItem('token'), // 你可以在登录时设置这个 token
  },
  mutations: {
    setApplicantsData(state:any, data) {
      state.rawData = data;
    },
    setToken(state:any, token:string) {
      state.token = token;
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
        console.error('获取报名人员数据失败', error);
      }
    },
  },
  getters: {
    applicantsData: (state) => state.applicantsData,
  },
});