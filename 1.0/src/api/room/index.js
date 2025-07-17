import request from '@/utils/request'

export function getlist(params) {
  return request({
    url: '/admin/room/getall',
    method: 'post',
    data: params
  })
}

export function addData(params) {
  return request({
    url: '/admin/room/add',
    method: 'post',
    data: params
  })
}

export function editData(params) {
  return request({
    url: '/admin/room/edit',
    method: 'post',
    data: params
  })
}

export function delData(params) {
  return request({
    url: '/admin/room/del',
    method: 'post',
    data: params
  })
}
