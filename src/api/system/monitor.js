import {request} from '@/utils/request.js'
import dayjs from "dayjs";

export default {

    /**
     * 获取服务器信息
     * @returns
     */
    getServerInfo() {
        return request({
            url: 'system/server/monitor',
            method: 'get'
        })
    },

    /**
     * 获取在线用户列表
     * @param {*} params
     * @returns
     */
    getOnlineUserPageList(params = {}) {
        const {login_time, ...rest} = params
        if (login_time) {
            rest.startDate = login_time[0];
            rest.endDate = login_time[1];
        } else {
            // searchDefaultValue: [dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD'), dayjs().endOf('day').format('YYYY-MM-DD')]},
            rest.startDate = dayjs().startOf('day').subtract(3, 'day').format('YYYY-MM-DD');
            rest.endDate = dayjs().endOf('day').format('YYYY-MM-DD');
        }
        return request({
            url: '/v1/merchant/login-logs',
            method: 'get',
            params: {
                ...rest,
                limit: 20
            }
        })
    },

    /**
     * 强退用户 （踢下线）
     * @param {*} params
     * @returns
     */
    kickUser(data = {}) {
        return request({
            url: 'system/onlineUser/kick',
            method: 'post',
            data
        })
    },

    /**
     * 获取缓存信息
     * @returns
     */
    getCacheInfo() {
        return request({
            url: 'system/cache/monitor',
            method: 'get'
        })
    },

    /**
     * 查看key内容
     * @returns
     */
    view(data) {
        return request({
            url: 'system/cache/view',
            method: 'post',
            data
        })
    },


    /**
     * 删除一个缓存
     * @returns
     */
    deleteKey(data) {
        return request({
            url: 'system/cache/delete',
            method: 'delete',
            data
        })
    },

    /**
     * 清空缓存
     * @returns
     */
    clear() {
        return request({
            url: 'system/cache/clear',
            method: 'delete'
        })
    },
}
