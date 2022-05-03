export type MicroCMSIframeOptions = {
  height: string | number
  width: string | number
  origin: string
}

export type Message<T> = {
  id?: string
  title?: string
  description?: string
  imageUrl?: string
  updatedAt?: string
  data: T | null
}

export type MicroCMSIframeState<T> = {
  iframeId: string
  origin: string
  defaultMessage: Partial<Message<T>>
}

export type GetDefaultDataMessageEvent<T> = Omit<MessageEvent, 'data'> & {
  data: {
    id: string
    action: 'MICROCMS_GET_DEFAULT_DATA'
    message?: Partial<Message<T>>
  }
}

export type UpdateStyleMessage = {
  id: string
  action: 'MICROCMS_UPDATE_STYLE'
  message: {
    height: number | string
    width: number | string
  }
}

export type PostDataMessage<T> = {
  id: string
  action: 'MICROCMS_POST_DATA'
  message: Partial<Message<T>>
}
