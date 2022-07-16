import request from '@/utils/request'

//获取权限
export function reqPermissionList(params) {
    return request({
        url: '/sys/permission',
        params
    })
}

//新增权限
export function reqAddPermission(data) {
    return request({
        url: '/sys/permission',
        method: 'post',
        data
    })
}

//更新权限
export function reqUpdatePermission(data) {
    return request({
        url: `/sys/permission/${data.id}`,
        method: 'put',
        data
    })
}

//删除权限
export function delPermission(id) {
    return request({
        url: `/sys/permission/${id}`,
        method: 'delete'
    })
}

//获取权限详情
export function reqPermissionDetail(id) {
    return request({
        url: `/sys/permission/${id}`
    })
}