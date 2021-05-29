import axios from 'axios'
import qs from 'qs'
import router from '../router'
import { message } from 'ant-design-vue'


// 获取本地存储的token
// const token = localStorage.getItem('token')

const baseUrl = process.env.VUE_APP_BASE_API
// console.log(baseUrl)
// 创建axios实例
axios.create({
  baseURL: process.env.VUE_APP_BASE_API
})

// http request拦截器 添加一个请求拦截器
axios.interceptors.request.use(
  function(config) {  
    if (localStorage.getItem('token')) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Token = localStorage.getItem('token'); 
    }    
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    // console.log('111', response)
    if (response.data.code == 601) {
      message.error('请登录')
      router.push({
        path: '/login'
      })
    }
    return response
  },
  error => {
    // console.log('222', JSON.stringify(error))
    if (error.message.indexOf(500) != -1) {
      // console.log(111)
      message.error('请登录')
      router.push({
        path: '/login'
      })
    }
    return Promise.reject(error)
  }
)

// 封装get请求
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(baseUrl + url + '?timestr=' + new Date().getTime(), {
        params: params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
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

export function gets(url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: baseUrl + url + '?timestr=' + new Date().getTime(),
      params: params,
      responseType: 'blob'
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

// 封装post请求
export function post(url, params, type) {
  return new Promise((resolve, reject) => {
    // console.log(url)
    // console.log(baseUrl + url)
    axios({
      method: 'post',
      url: baseUrl + url + '?timestr=' + new Date().getTime(),
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
        reject(error)
      })
  })
}

// 需要 qs的post请求
export function qspost(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url + '?timestr=' + new Date().getTime(), qs.stringify(params))
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
      .put(baseUrl + url + '?timestr=' + new Date().getTime(), params)
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
      url: baseUrl + url + '?timestr=' + new Date().getTime(),
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
      .patch(baseUrl + url + '?timestr=' + new Date().getTime(), params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

export function upload(url, params) {
  return new Promise((resolve, reject) => {
    // console.log(url)
    // console.log(baseUrl + url)
    axios({
      method: 'post',
      url: baseUrl + url + '?timestr=' + new Date().getTime(),
      data: params,
      headers: {
        // 'token': store.state.token,
        'content-type': 'multipart/form-data'
      }
    })
      .then(res => {
        // console.log(res)
        resolve(res.data)
      })
      .catch(error => {
        console.log(JSON.stringify(error))
        reject(error)
      })
  })
}
