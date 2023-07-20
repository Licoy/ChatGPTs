import {createApp} from 'vue'
import "./style.css"
import App from './App.vue'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn'
import routes from './router'

dayjs.locale('zh-cn')
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(routes)
app.mount('#app').$nextTick(() => {
    document.getElementById("app-html-loading-box")?.remove()
})
