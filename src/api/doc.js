import { request } from '@/utils/request.js'

/**
 * 接口文档
 */
export default {
  /**
   * 登录接口文档
   * @returns
   */
  login (data = {}) {
    return request({
      url: 'apiDoc/login',
      method: 'post',
      data
    })
  },

}
