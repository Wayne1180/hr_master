import request from '@/utils/request'

//获取员工的简单列表
export function reqEmployeeSimple() {
    return request({
        url: '/sys/user/simple',
        method: 'get'
    })
}

//获取员工综合列表
export function reqEmployeeList(params) {
    return request({
        url: '/sys/user',
        method: 'get',
        params
    })
}

//删除员工的接口
export function reqDelEmployee(id) {
    return request({
        url: `/sys/user/${id}`,
        method: 'delete'
    })
}

//新增员工的接口
export function reqAddEmployee(data) {
    return request({
        url: '/sys/user',
        method: 'post',
        data
    })
}

//导入员工数据   参数data是一个数组类型
export function reqImportEmployee(data) {
    return request({
        url: '/sys/user/batch',
        method: 'post',
        data
    })
}

//保存用户基本信息
export function reqSaveUserDetailById(data) {
    return request({
        url: `/sys/user/${data.id}`,
        method: 'put',
        data
    })
}

/** *
 *  读取用户详情的基础信息
 * **/
export function reqPersonalDetail(id) {
    return request({
        url: `/employees/${id}/personalInfo`
    })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function reqUpdatePersonal(data) {
    return request({
        url: `/employees/${data.userId}/personalInfo`,
        method: 'put',
        data
    })
}


/** **
 * 获取用户的岗位信息
 *
 * ****/
export function reqJobDetail(id) {
    return request({
        url: `/employees/${id}/jobs`
    })
}


/**
 * 保存岗位信息
 * ****/
export function reqUpdateJob(data) {
    return request({
        url: `/employees/${data.userId}/jobs`,
        method: 'put',
        data
    })
}