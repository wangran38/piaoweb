import request from '@/utils/request'

export function getlist(params) {
  return request({
    url: '/admin/getbookfilelist',
    method: 'post',
    data: params
  })
}

export function edit(params) {
  return request({
    url: '/api/editbookfile',
    method: 'post',
    data: params
  })
}

export function getoptions(params) {
  return request({
    url: '/admin/treebook',
    method: 'post',
    data: params
  })
}

export function delbookfile(params) {
  return request({
    url: '/admin/delbookfile',
    method: 'post',
    data: params
  })
}