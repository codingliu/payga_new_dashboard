import { request } from '@/utils/request.js'

/**
 * 数据源管理 API JS
 */

export default {

  /**
   * 添加数据源管理
   * @returns
   */
  save (data = {}) {
    return request({
      url: 'setting/datasource/save',
      method: 'post',
      data
    })
  },

  /**
   * 更新数据源管理数据
   * @returns
   */
  update (id, data = {}) {
    return request({
      url: 'setting/datasource/update/' + id,
      method: 'put',
      data
    })
  },

  /**
   * 读取数据源管理
   * @returns
   */
  read (data = {}) {
    return request({
      url: 'setting/datasource/read',
      method: 'get',
      data
    })
  },

}
