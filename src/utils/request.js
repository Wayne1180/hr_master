import store from '@/store'
import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'

const TimeOut = 5400 //定义超时时间，一小时

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,  //dev-api /prod-api
    timeout: 10000 //设置超时时间
})
service.interceptors.request.use(async config => {
    //config是请求的配置信息
    //注入token
    if (store.getters.token) {
        //只有在有token的情况下，才有必要去检查时间戳是否超时
        if (IsCheckTimeOut()) {
            //如果为true 表示过期了
            //token没用了，因为超时了
            await store.dispatch('user.logout') //登出操作
            //跳转到登录页
            router.push('/login')
            return Promise.reject(new Error('您的token已经失效'))
        }
        config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config //必须返回的
})
//响应拦截器
service.interceptors.response.use(response => {
    //axios默认加了一层data
    const { success, message, data } = response.data
    //要根据success的成功与否决定下面的操作
    if (success) {
        return data
    } else {
        //业务已经错误了，不能进then，应该进catch
        Message.error(message)  //提示错误消息
        return Promise.reject(new Error(message))
    }
}, error => {
    //error 信息 里面是response的对象
    if (error.response && error.response.data & error.response.data.code == 10002) {
        //当等于10002的时候，表示后端告诉token超时了
        store.dispatch('user/logout') //登出action
        router.push('/login')
    } else {
        Message.error(error.message) //提示错误信息
    }
    return Promise.reject(error) //返回执行错误 让当前的执行链跳出成功 直接进入catch

})

//是否超时
//超时逻辑，当前时间-缓存中的时间 是否大于时间差(3600)
function IsCheckTimeOut() {
    var currentTime = Date.now() //当前时间戳
    var timeStamp = getTimeStamp() //缓存时间戳
    return (currentTime - timeStamp) / 1000 > TimeOut
}

export default service
