import request from '@/utils/request'
import { IApiNaireSourceData, IApiNaireStatisticResult, IApiNaireItem, Citem } from './types'

/**
 * 问卷列表
 */
export const list = () => {
  return request.get<any[]>('/acdeal/oneThing/getCitemAndItem.do', {})
  // return {
  //   success: true,
  //   data: [{
  //     n_id: '1',
  //     a_id: '2',
  //     n_creattime: '3',
  //     n_deadline: '4',
  //     n_title: '5',
  //     n_status: '6',
  //     n_intro: '7',
  //     n_options: '8'
  //   },
  //   {
  //     n_id: '11',
  //     a_id: '22',
  //     n_creattime: '33',
  //     n_deadline: '44',
  //     n_title: '55',
  //     n_status: '66',
  //     n_intro: '77',
  //     n_options: '88'
  //   }]
  // }
}

/**
 * 根据事项id获取情形列表
 * @param data
 */
export const statusList = (data: {
  answerId: string,
  itemId: string
}) => {
  return request.get<any>('/acdeal/oneThing/getItemAndStatus.do', data)
}

/**
 * 创建问卷
 * @param data
 */
export const create = (data: {
  naire: Questionnaire.INaire,
  status: string
}) => {
  return request.post<any>('/acdeal/oneThing/saveQLA.do', data, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * 问题修改
 * @param data
 */
export const updateQ = (data: {
  naire: any,
  status: string
}) => {
  return request.post<any>('/acdeal/oneThing/updateQ.do', data, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * 保存跳转逻辑
 * @param data
 */
export const saveJumpList = (data: {
  ST_CITEM_ID: string,
  ztId: string,
  naire: any,
  status: string
}) => {
  return request.post<any>('/acdeal/oneThing/saveJumpList.do', data, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * 答案修改
 * @param data
 */
export const updateA = (data: {
  naire: any,
  status: string
}) => {
  return request.post<any>('/acdeal/oneThing/updateA.do', data, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * 问卷统计
 * @param data
 */
export const statis = (data: {
  n_id: string
}) => {
  return request.post<IApiNaireStatisticResult>('/naire/statis', data, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * 样本数据
 * @param data
 */

export const sourceData = (data: {
  n_id: string
  current: number,
    page_size: number
}) => {
  return request.get<IApiNaireSourceData>('/naire/sourcedata', data)
}

/**
 * 交叉分析
 * @param data
 */

export const crossanalysis = (data: {
  n_id: string
  x_id: number | string,
  y_id: number | string
}) => {
  return request.post<any>('/naire/crossanalysis', data, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * 交叉分析
 * @param data
 */
export const questions = (data: {
  n_id: string
}) => {
  return request.post<any>('/naire/questions', data, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * 问卷详情
 * @param data
 */
export const detail = (data: {
  itemId: string
  citemId: string
  type: 'normal'
}) => {
  return request.get<any>('/acdeal/oneThing/getQLA.do', data)
  // const radioQues = {
  //   question: '单选问题',
  //   options: [
  //     {
  //       content: '答案1',
  //       isAddition: false,
  //       image: '',
  //       desc: ''
  //     },
  //     {
  //       content: '答案2',
  //       isAddition: true,
  //       image: '',
  //       desc: ''
  //     }
  //   ],
  //   description: '',
  //   type: '单选',
  //   isRequired: true,
  //   selectContent: '',
  //   setting: {
  //     last: 1
  //   },
  //   additional: ''
  // }
  // return {
  //   success: true,
  //   data: {
  //     title: '111',
  //     intro: '222',
  //     deadline: '333',
  //     topic: [radioQues,
  //       radioQues
  //     ]
  //   }
  // }
}

/**
 * 获取当前主题下面所有事项以及答案
 * @param data
 */
export const getCitemQLA = (data: {
  itemId: string
  citemId: string
  type: 'normal'
}) => {
  return request.get<any>('/acdeal/oneThing/getCitemQLA.do', data)
}

/**
 * 查看问题下所有答案的跳转逻辑
 * @param data
 */
export const getJumpList = (data: {
  ST_QUESTIONS_ID: string,
  xtype: string,
  cItemId: string
}) => {
  return request.get<any>('/acdeal/oneThing/getJumpList.do', data)
}

/**
 * 提交问卷
 * @param data
 */
export const submit = (data: {
  nId: string,
  result: any,
  userId: string
}) => {
  return request.post<any>('/naire/submit', data, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * 发布/停止发布
 * @param data
 */
export const changeStatus = (data: {
  n_id: string
}) => {
  return request.get<any>('/naire/changeStatus', data)
}

/**
 * 回收情况
 * @param data
 */
export const submitStatistic = (data: {
  n_id: string,
  current: number,
  page_size: number,
  status: number,
  u_class:string
}) => {
  return request.get<any>('/naire/submitStatis', data)
}

/**
 * 修改截止时间
 * @param data
 */
export const changeTime = (data: {
  n_id: string
  n_deadline: number
}) => {
  return request.post<any>('/naire/changeTime', data)
}

/**
 * 删除问卷
 * @param data
 */
export const del = (data: {
  n_id: string
}) => {
  return request.get<any>('/naire/del', data)
}
