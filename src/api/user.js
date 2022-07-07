import request from '@/utils/request'

//登录接口封装
export function reqLogin(data) {
    //返回一个promise对象
    return request({
        url: '/sys/login',
        method: 'post',
        data
    })
}

//获取用户资料的接口
export function reqUserInfo() {
    return request({
        url: '/sys/profile',
        method: 'post'
    })
}

//根据用户ID获取用户的详情
export const reqGetUserDetailById = (id) => request({ url: `/sys/user/${id}`, method: 'get' })
export function logout() {
}
