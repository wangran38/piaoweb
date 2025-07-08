import request from '@/utils/request'

export function getlist(params) {
  return request({
    url: '/admin/dictionary',
    method: 'post',
    data: params
  })
}

export function add(params) {
  return request({
    url: '/admin/adddictionary',
    method: 'post',
    data: params
  })
}


export function edit(params) {
  return request({
    url: '/admin/updictionary',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/admin/deldictionary',
    method: 'post',
    data: params
  })
}
