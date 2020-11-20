import { get, post, put, deletefn, patch, postSearch } from './http'

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
  Metadata: (uri, params) => get(`${uri}/crud/metadata`, params),
  Search: (uri, params, data, filter) =>
    postSearch(`${uri}/crud/_search`, params, data, filter),
  Detail: (uri, params) => get(`${uri}/crud`, params),
  Insert: (uri, params) => post(`${uri}/crud`, params),
  Update: (uri, params) => patch(`${uri}/crud`, params),
  Delete: (uri, params) => deletefn(`${uri}/crud`, params),
  SelectOptions: (uri, params) => get(`${uri}/selectOptions`, params),
  // 系统用户角色关系更改
  RoleUser: (uri, params) => put(uri, params)
}
