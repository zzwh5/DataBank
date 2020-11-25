import axios from 'axios'
import qs from 'qs'

const baseUrl = process.env.VUE_APP_BASE_API
// 创建axios实例
axios.create({
  baseURL: process.env.VUE_APP_BASE_API
})

// http request拦截器 添加一个请求拦截器
axios.interceptors.request.use(
  function(config) {
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
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

export function gets(url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: baseUrl + url,
      params: params,
      responseType: 'blob'
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
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

export function upload(url, params) {
  return new Promise((resolve, reject) => {
    // console.log(url)
    // console.log(baseUrl + url)
    axios({
      method: 'post',
      url: baseUrl + url,
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
        // console.log(error)
        reject(error)
      })
  })
}
