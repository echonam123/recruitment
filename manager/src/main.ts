import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import store from './store'
import router from './router'

console.log(import.meta.env);

createApp(App).use(store).use(router).mount('#app')
