export type MicroCMSUpdateStyleParams = {
  height: string | number
  width: string | number
}

export type MicroCMSPostParams<T> = {
  id: string
  title: string
  description: string
  imageUrl: string
  updatedAt: string
  data: T
}

export type MicroCMSIframeState<T> = {
  iframeId: string
  serviceUrl: string
  defaultMessage: MicroCMSPostParams<T>
}
