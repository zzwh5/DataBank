import { get, gets, post, put, deletefn, upload } from './http'

const api = {
  // 登录
  login: '/rest/1.0/auth/token'
}
// 登录
export const login = p => post(api.login, p)
// 刷新token 接口一直 方法不同
export const refrechToken = p => put(api.login)

/* ==================== CRUD ==================== */
export const crud = {
  Search: params => get('doc', params),
  Detail: params => get('doc/findById', params),
  DownLoad: params => gets('doc/download', params),
  Insert: params => post(params),
  Update: params => put('doc', params),
  Delete: params => deletefn('doc', params),
  Upload: params => upload('doc/upload', params),
  DetailHtml: params => get('doc/img', params)
}
