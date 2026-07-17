import {  UserRequestType } from '../../list/entities/types'

export interface UpdateRequestParams {
  id: string
  body: IBodyUserRequest
}

export interface IBodyUserRequest {
  status: UserRequestType
  adminComment: string
}


