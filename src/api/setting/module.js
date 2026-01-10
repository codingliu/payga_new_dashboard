import { request } from '@/utils/request.js'

export default {

  /**
   * 创建新模块
   * @returns
   */
  save (data = {}) {
    return request({
      url: 'setting/module/save',
      method: 'put',
      data
    })
  },
}
