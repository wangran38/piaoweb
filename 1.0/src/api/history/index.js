import request from '@/utils/request'

export function getlist(params) {
  return request({
    url: '/admin/qh/getall',
    method: 'post',
    data: params
  })
}