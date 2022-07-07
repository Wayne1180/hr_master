import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { reqLogin, reqUserInfo, reqGetUserDetailById } from '@/api/user'
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
