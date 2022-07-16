//专门处理权限路由的模块
import { constantRoutes, asyncRoutes } from "@/router"
const state = {
    //一开始 肯定拥有静态路由的权限
    routes: constantRoutes  //路由表 表示当前用户所拥有的所有路由的数组
}
const actions = {
    //筛选权限路由
    //第二个参数为当前用户的所拥有的菜单权限 
    //asyncRoutes是一个数组
    filterRoutes(context, menus) {
        const routes = []
        //筛选出动态路由中和menus中能够对上的路由
        menus.forEach(key => {
            //key就是标识
            //asyncRoutes找 有没有对象中的name属性等于key的 如果找不到就没权限 如果找到了  要筛选出来
            routes.push(...asyncRoutes.filter(item => item.name === key))  // 得到一个数组有可能有元素也有可能是空数组
        })
        //得到的routes是所有模块中满足权限要求的路由数组
        //routes就是当前用户所拥有的 动态路由的权限
        context.commit('setRoutes', routes)  //将动态路由提交给mutations
        return routes //这里为什么还要return  state数据是用来显示左侧菜单用的 return 是给路由addRoutes用的
    }
}
const mutations = {
    //定义修改routes的mutations
    //payload 认为是我们登录成功需要添加的新路由
    setRoutes(state, newRoutes) {
        state.routes = [...constantRoutes, ...newRoutes]
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
}