declare namespace Questionnaire {
  export interface INaire {
    ST_TITLE:string,
    ST_DESC:string,
    ST_CITEM_ID:string,
    ST_CITEM_CODE:string,
    ST_CITEM_NAME:string,
    jumpUrl:string,
    ztId:string,
    title: string,
    intro: string,
    deadline: number | string
    status: number,
    options: any,
    topic: IQuestionItem[]
  }

  export interface IQuestionSetting {
    last?: number
  }

  export type QuestionType = '单选' | '多选' | '文本'

  export interface IQuestionItem {
    q_id?: string,
    description: string,
    isRequired: boolean,
    options?: IOptionItem[],
    question?: string,
    setting: IQuestionSetting,
    additional?: string,
    selectContent?: string,
    selectMultipleContent?: number[],
    type: string,
    ST_QUESTIONS_ID: string,
    ST_QUESTION_CONTENT: string,
    qorder: number
}

  export interface IOptionItem {
    ST_QUESTION_CONTENT?: string,
    o_id?: string,
    content: string,
    desc?: string,
    image?: string,
    isAddition: boolean,
    isAddGap: boolean,
    ST_ANSWER_ID:string,
    ST_ANSWER_TYPE:string,
    ST_KEY:string,
    ST_VALUE:string,
    ST_ANSWER:string,
    ST_TIP:string,
    NM_ORDER:string,
    NM_IS_OVER:string,
    NM_IS_ALL_OVER:string,
    ST_DESC:string,
    ST_JUMP_URL:string,
    ST_JUMP_TYPE:string,
    ST_STUFF_ID: string,
    ST_STATUS_ID: string[],
    ST_STUFF_ID_LIST?: [],
    ST_STATUS_ID_LIST?: []
  }
}
