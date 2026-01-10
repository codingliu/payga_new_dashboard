import { request } from '@/utils/request.js'

export default {
  /**
   * 获取用户列表
   * @returns
   */
  getUserList(params = {}) {
    return request({
      url: 'system/common/getUserList',
      method: 'get',
      params
    })
  },

  /**
   * 通过id 列表获取用户基础信息
   * @returns
   */
   getUserInfoByIds(data = {}) {
    return request({
      url: 'system/common/getUserInfoByIds',
      method: 'post',
      data
    })
  },

  /**
   * 获取公告列表
   * @returns
   */
  getNoticeList(params = {}) {
    return request({
      url: 'system/common/getNoticeList',
      method: 'get',
      params
    })
  },

  /**
   * 清除所有缓存
   * @returns
   */
  clearAllCache() {
    return request({
      url: 'system/common/clearAllCache',
      method: 'get'
    })
  },

  /**
   * 保存网络图片
   * @returns
   */
  saveNetWorkImage (data = {}) {
    return request({
      url: 'system/saveNetworkImage',
      method: 'post',
      data
    })
  },

  /**
   * 获取资源列表
   */
  getResourceList(params = {}) {
    return request({
      url: 'system/common/getResourceList',
      method: 'get',
      params
    })
  },

  /**
   * 快捷查询字典
   */
  getDict(code) {
    return request({
      url: 'system/dataDict/list?code=' + code,
      method: 'get'
    })
  },
}
