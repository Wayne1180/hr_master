import request from '@/utils/request'

//获取角色列表
export function reqRoleList(params) {
    return request({
        url: '/sys/role',
        params
    })
}

//获取公司信息
export function reqCompanyInfo(companyId) {
    return request({
        url: `/company/${companyId}`,
        method: 'get'
    })
}

//删除角色
export function reqDeleteRole(id) {
    return request({
        url: `/sys/role/${id}`,
        method: 'delete'
    })
}

//读取角色详情
export function reqRoleDetail(id) {
    return request({
        url: `/sys/role/${id}`,
        method: 'get'
    })
}

export function reqUpdateRole(data) {
    return request({
        url: `/sys/role/${data.id}`,
        method: 'put',
        data
    })
}

//新增角色
export function reqAddRole(data) {
    return request({
        url: '/sys/role',
        method: 'post',
        data
    })
}