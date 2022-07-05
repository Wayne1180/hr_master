import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login } from '@/api/user'
//状态
const state = {
  token: getToken() //设置token为共享状态 一初始化vuex的时候就先从缓存中读取 没有就是null
}
const actions = {
  async login(context, data) {
    //调用api的接口
    const result = await login(data) //拿到token
    //如果为true 表示登录成功
    context.commit("setToken", result)  //设置用户的token
    //拿到token说明登录成功
    setTimeStamp() //设置当前的时间戳
  },
  logout({ commit }) {
    commit('removeToken')
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
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
