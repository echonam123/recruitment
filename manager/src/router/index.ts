import {createRouter,createWebHashHistory} from 'vue-router'
import check from '../components/check.vue'
import interview from '../components/interview.vue'
import stage from '../components/stage.vue'

const routes = [
		{
			path:'/check',
			component:check
		},
		{
			path:'/interview',
			component:interview
    },
    {
      path:'/stage',
			component:stage
    }
]

const router = createRouter({
  history:createWebHashHistory(),//这个是使用hash模式
	routes
})
export default router