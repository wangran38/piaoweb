import request from '@/utils/request'

export function getlist(params) {
  return request({
    url: '/admin/agentuser/getall',
    method: 'post',
    data: params
  })
}

export function addData(params) {
  return request({
    url: '/admin/agentuser/add',
    method: 'post',
    data: params
  })
}

export function editData(params) {
  return request({
    url: '/admin/agentuser/edit',
    method: 'post',
    data: params
  })
}

export function delData(params) {
  return request({
    url: '/admin/agentuser/del',
    method: 'post',
    data: params
  })
}
