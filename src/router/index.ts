import * as VueRouter from "vue-router";
import {routerList} from "@/router/routers";

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: routerList,
})

router.beforeEach((to, from, next) => {
    next()
})

router.afterEach((to, from) => {

})

export default router