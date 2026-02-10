import service from './request'


const APIHelper = {
  // 知识点列表
  queryKonwPointList: (params = {}) => {
    return service.post('/api/osp-css/out/knowledge/queryKonwPointList', params)
  },
  // 新增知识点
  addKonwPoint: (params = {}) => {
    return service.post('/api/osp-css/out/knowledge/add', { ...params, current: 1, pageSize: 100 })
  },
  // 反馈
  feedback: (params = {}) => {
    return service.post('/api/osp-css/out/knowledge/feedback', { ...params, current: 1, pageSize: 100 })
  },
  // 查询知识库列表
  queryList: (params = {}) => {
    return service.post('/api/osp-css/out/knowledge/queryList', params)
  },
  // 字典项
  queryDictList: (dicType: string) => {
    return service.post('/api/osp-css/out/knowledge/queryDictList', { dicType, current: 1, pageSize: 100 })
  }
}

export default APIHelper

