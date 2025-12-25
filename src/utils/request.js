import axios from 'axios'
import {Message} from '@arco-design/web-vue'
import tool from '@/utils/tool'
import {get, isEmpty} from 'lodash'
import qs from 'qs'
import {h} from 'vue'
import {IconFaceFrownFill} from '@arco-design/web-vue/dist/arco-vue-icon'
import router from "@/router";

function createService () {
  // 创建一个 axios 实例
  const service = axios.create()

  // HTTP request 拦截器
  service.interceptors.request.use(
    config => config,
    error => {
      // 失败
      return Promise.reject(error);
    }
  );

  // HTTP response 拦截器
  service.interceptors.response.use(
    response => {
      if (response.data.code && response.data.code !== '200') {
        Message.error({
          content: response.data.message,
          icon: () => h( IconFaceFrownFill )
        })
      }
      return response.data;
    },
    error => {
      const err = (text) => {
        Message.error({
          content: ( error.response && error.response.data && error.response.data.message )
          ? error.response.data.message
          : text,
          icon: () => h( IconFaceFrownFill )
        })
      }
      if (error.response) {
        switch (error.response.status) {
          case 404:
            err('Not Found')
            break
          case 500:
            err('Server Error')
            break
          case 401:
            throttle(() => {
              err('Login Expired，Pls try again')
              tool.local.clear()
              router.push({name: 'login'})
            })()
            break
          case 403:
            err('No permission to access this resource')
            break
          default:
            err('Error')
        }
      } else {
        err('Timeout，Serve No Response！')
      }
      return Promise.reject(error.response && error.response.data ? error.response.data : null)
    }

  )
  return service
}

//节流
function throttle(fn, wait = 1500) {
  return function () {
    let context = this;
    if (!throttle.timer) {
      fn.apply(context, arguments);
      throttle.timer = setTimeout(function () {
        throttle.timer = null;
      }, wait)
    }
  }
}

function stringify (data) {
  return qs.stringify(data, { allowDots: true, encode: false })
}

/**
 * @description 创建请求方法
 * @param {Object} service axios 实例
 */
function createRequest (service) {
  return function (config) {
    const env = import.meta.env
    const token = tool.local.get(env.VITE_APP_TOKEN_PREFIX)
    const setting = tool.local.get('setting')
    const configDefault = {
      headers: Object.assign(
        {
          'MERCHANT-TOKEN': token,
          'Accept-Language': setting?.language || 'zh_TW',
          'Content-Type': get(config, 'headers.Content-Type', 'application/json;charset=UTF-8')
        },
        config.header
      ),

      timeout: 10000,
      baseURL: env.VITE_APP_OPEN_PROXY === 'true' ? env.VITE_APP_PROXY_PREFIX : env.VITE_APP_BASE_URL,
      data: {}
    }
    const option = Object.assign(configDefault, config)

    // json
    if (!isEmpty(option.params)) {
      option.url = option.url + '?' + stringify(option.params)
      option.params = {}
    }

    return service(option)
  }
}

// 用于真实网络请求的实例和请求方法
export const service = createService()
export const request = createRequest(service)
