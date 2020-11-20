import axios from 'axios'
import qs from 'qs'
// 引入storage的一些方法
import { setBothToken, getToken, getRefreshToken } from '@/util/token-storage'
import { remove } from '@/util/storage'
// 引入 antd的对话框
// import { message } from 'ant-design-vue'

// 刷新token的接口
import { refrechToken } from '@/request/api'

const baseUrl = process.env.VUE_APP_BASE_API
// 创建axios实例
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
})

// axios实例的一个方法
// 给实例添加一个setToken方法，用于登录后将最新token动态添加到header，
// 同时将token保存在localStorage中
instance.setToken = data => {
  instance.defaults.headers['token'] = data.token
  setBothToken(data)
}

// http request拦截器 添加一个请求拦截器
axios.interceptors.request.use(
  function(config) {
    // console.log(config)
    // 在storage中拿到 token
    const token = getToken()
    const refresh_token = getRefreshToken()
    if (token) {
      // 将token放到请求头发送给服务器,将tokenkey放在请求头中
      config.headers['token'] = token
    }
    if (config.url.indexOf('auth') != -1) {
      config.headers['token'] = refresh_token
    }
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// 是否正在刷新的标记
var isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
var requests = []

// 刷新token的方法
/* 
  // refrechToken(token).then(res=>{
  //   console.log(res)
  // })
*/
axios.interceptors.response.use(
  response => {
    // console.log(response)
    var { url } = response.config
    const { code } = response.data
    // console.log(url.indexOf('/admin/rest/1.0/auth/token' == -1))
    if (code === 401 && url.indexOf('/admin/rest/1.0/auth/token') == -1) {
      // console.log(isRefreshing)
      const config = response.config
      if (!isRefreshing) {
        isRefreshing = true
        // console.log(isRefreshing)
        refrechToken()
          .then(res => {
            console.log(res)
            if (res.code == 401) {
              // router.push('/user')
              remove('token')
              location.reload()
              return false
            }
            const { token } = res.data
            instance.setToken(res.data)
            config.headers['token'] = token
            config.baseURL = ''
            // 已经刷新了token，将所有队列中的请求进行重试
            requests.forEach(cb => cb(token))
            // 重试完了别忘了清空这个队列（掘金评论区同学指点）
            requests = []
            return instance(config)
          })
          .catch(res => {
            console.error('refrechToken error =>', res)
            // window.location.href = '/user'
          })
          .finally(() => {
            isRefreshing = false
          })
      } else {
        // 正在刷新token，返回一个未执行resolve的promise
        return new Promise(resolve => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          requests.push(token => {
            config.baseURL = ''
            config.headers['X-Tooken'] = token
            resolve(instance(config))
          })
        })
      }
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

// 封装get请求
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(baseUrl + url, {
        params: params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })

    // axios({
    //   method: 'get',
    //   url: baseUrl + url,
    //   params: params
    // })
    //   .then(res => {
    //     resolve(res.data)
    //   })
    //   .catch(err => {
    //     reject(err.data)
    //   })
  })
}

// 封装post请求
export function post(url, params, type) {
  return new Promise((resolve, reject) => {
    // console.log(url)
    // console.log(baseUrl + url)
    axios({
      method: 'post',
      url: baseUrl + url,
      data: params,
      headers: {
        // 'token': store.state.token,
        'content-type': type || 'application/json'
      }
    })
      .then(res => {
        // console.log(res)
        resolve(res.data)
      })
      .catch(error => {
        // console.log(error)
        reject(error)
      })
  })
}

// 需要 qs的post请求
export function qspost(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, qs.stringify(params))
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

// put请求
export function put(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .put(baseUrl + url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

// delte请求
export function deletefn(url, params) {
  return new Promise((resolve, reject) => {
    // axios
    //   .delete(baseUrl + url, {params:params})
    //   .then(res => {
    //     resolve(res.data)
    //   })
    //   .catch(err => {
    //     reject(err.data)
    //   })
    axios({
      method: 'delete',
      url: baseUrl + url,
      params: params // 请求参数拼接在url上
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

// PATCH 请求
export function patch(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .patch(baseUrl + url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

// 排序 + 过滤 + 分页的搜索 post请求
export function postSearch(url, params, data, filter) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: baseUrl + url,
      params: params,
      data: {
        orderCondition: data,
        searchConditions: filter
      },
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
