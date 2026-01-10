import { request } from '@/utils/request.js'

export default {

  /**
   * 添加
   * @returns
   */
  save (data = {}) {
    return request({
      url: 'setting/crontab/save',
      method: 'post',
      data
    })
  },

  /**
   * 更新数据
   * @returns
   */
  update (id, params = {}) {
    return request({
      url: 'setting/crontab/update/' + id,
      method: 'put',
      data: params
    })
  },

}
