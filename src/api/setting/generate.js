import { request } from '@/utils/request.js'

export default {

  /**
   * 编辑生成信息
   * @returns
   */
  update (data = {}) {
    return request({
      url: 'setting/code/update',
      method: 'post',
      data
    })
  },

  /**
   * 预览代码
   * @returns
   */
  preview (params = {}) {
    return request({
      url: 'setting/code/preview',
      method: 'get',
      params
    })
  },
}
