import { request } from '@/utils/request.js'
import qs from "qs";

export default {

  /**
   * 获取验证码
   * @returns
   */
  getCaptch() {
    return request({
      url: 'system/captcha',
      method: 'get'
    })
  },

  /**
   * 用户登录
   * @param {object} params
   * @returns
   */
  login(params = {}) {
    return request({
      url: `/v1/index/login?${qs.stringify(params)}`,
      method: 'post',
    })
  },

  /**
   * 用户退出
   * @param {object} params
   * @returns
   */
  logout(params = {}) {
    return request({
      url: 'system/logout',
      method: 'post',
      data: params
    })
  },

  /**
   * 获取登录用户信息
   * @param {object} params
   * @returns
   */
  getInfo(params = {}) {
    return request({
      url: '/v1/index/getUserInfo',
      method: 'get',
      data: params
    })
  }
}
