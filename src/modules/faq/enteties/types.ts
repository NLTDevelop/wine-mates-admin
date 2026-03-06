export interface IQuestion {
  id: number
  question: string
  answer?: string
  sortNumber?: number | null
}

export interface ITopic {
  id: number
  topicName: string
  sortNumber?: number | null
  questions?: IQuestion[]
}
export type TopicRequest = ITopic[]

export type TopicCreate = Omit<ITopic, 'id'>
export type TopicUpdate = ITopic

export type QuestionCreate = Omit<IQuestion, 'id'>
export type QuestionUpdate = IQuestion
