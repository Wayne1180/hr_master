// 权限拦截再路由跳转  导航守卫
import router from '@/router'
import store from '@/store'
import nProgress from 'nprogress' //引入进度条
import 'nprogress/nprogress.css'

//不需要导出  因为只需要让代码执行即可

//定义一个跳转白名单
const whiteList = ['/login', '/404']

//前置守卫
router.beforeEach(async (to, from, next) => {
    nProgress.start() //开启进度条
    if (store.getters.token) {
        // 如果有token
        if (to.path === '/login') {
            //如果要访问的是登录页
            next('/') //跳到主页
        } else {
            //只有放过的时候才去获取资料  如果当前vuex中有用户的资料的id 表示已经有资料了，不需要获取，如果没有id才需要获取
            if (!store.getters.userId) {
                //如果没有id才表示当前用户资料没有获取过
                await store.dispatch('user/getUserInfo')
                //如果说后续 需要根据用户资料获取数据的话，这里必须改成同步
            }
            next()
        }
    } else {
        // 没有token
        if (whiteList.indexOf(to.path) > -1) {
            //表示要去的地址在白名单
            next()
        } else {
            next('/login')
        }
    }
    nProgress.done() //手动强制关闭一次，为了解决手动切换地址时，进度条不关闭的问题
})

//后置守卫
router.afterEach(() => {
    nProgress.done() //关闭进度条
})