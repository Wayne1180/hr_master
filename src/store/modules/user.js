import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { reqLogin, reqUserInfo, reqGetUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
//状态
const state = {
  token: getToken(), //设置token为共享状态 一初始化vuex的时候就先从缓存中读取 没有就是null
  userInfo: {} //这里定义一个空对象
}
const actions = {
  async login(context, data) {
    //调用api的接口
    let result = await reqLogin(data) //拿到token
    //如果为true 表示登录成功
    context.commit("setToken", result)  //设置用户的token
    //拿到token说明登录成功
    setTimeStamp() //设置当前的时间戳
  },
  async getUserInfo(context) {
    let result = await reqUserInfo()
    //获取用户的详情
    const baseInfo = await reqGetUserDetailById(result.userId)
    context.commit("setUserInfo", { ...result, ...baseInfo }) //提交到mutations
    return result //后期做权限的时候用
  },
  logout(context) {
    //删除token  删除用户资料
    context.commit('removeToken')
    context.commit('removeUserInfo')
    //重置路由
    resetRouter()
    //去设置权限模块下的路由为初始状态
    //Vuex子模块怎么调用子模块的action  都没加锁的情况下 可以随意调用
    //不加命名空间的情况下，所有的mutations和action都是挂在全局上的，所以可以直接调用
    //但是加了命名空间的子模块 怎么调用另一个加了命名空间的子模块的mutations
    //加了命名空间的context指的不是全局的context
    //mutations名称  载荷 payload  第三个参数{root:true} 调用根级的mutations或者action
    context.commit('permission/setRoutes', [], { root: true })
  }
}

const mutations = {
  setToken(state, token) {
    state.token = token //将数据设置给vuex
    //同步给缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null //将vuex的数据置空
    removeToken() //同步到缓存
  },
  setUserInfo(state, result) {
    //更新对象
    state.userInfo = result
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }

}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
