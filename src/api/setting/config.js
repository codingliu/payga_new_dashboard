import { request } from '@/utils/request.js'

export default {

  /**
   * 清除缓存
   * @returns
   */
  clearCache(data = {}) {
    return request({
      url: 'setting/config/clearCache',
      method: 'post',
      data
    })
  },

  /**
   * 保存配置
   * @returns
   */
  save(data = {}) {
    return request({
      url: 'setting/config/save',
      method: 'post',
      data
    })
  },

  /**
   * 更新配置
   * @returns
   */
  update(key = '', data = {}) {
    return request({
      url: 'setting/config/update',
      method: 'post',
      data
    })
  },
}
