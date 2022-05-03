import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Message,
  MicroCMSIframeState,
  MicroCMSIframeOptions,
  PostDataMessage,
  UpdateStyleMessage,
  GetDefaultDataMessageEvent,
} from './types'

const defaultStyles = {
  height: 300,
  width: '100%',
}

const defaultMessage = {
  id: '',
  title: '',
  description: '',
  imageUrl: '',
  updatedAt: '',
  data: null,
}

export const useMicroCMSIframe = <T>(
  options?: Partial<MicroCMSIframeOptions>
): [
  message: Partial<Message<T>>,
  postHandler: (payload: Partial<Message<T>>) => void
] => {
  const mounted = useRef(false)
  const [state, setState] = useState<MicroCMSIframeState<T>>({
    iframeId: '',
    origin: '',
    defaultMessage,
  })

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      window.addEventListener('message', (e: GetDefaultDataMessageEvent<T>) => {
        if (
          e.isTrusted === true &&
          e.data.action === 'MICROCMS_GET_DEFAULT_DATA'
        ) {
          setState({
            iframeId: e.data.id,
            origin: e.origin,
            defaultMessage: e.data.message || defaultMessage,
          })

          const updateStyleMessage: UpdateStyleMessage = {
            id: e.data.id,
            action: 'MICROCMS_UPDATE_STYLE',
            message: Object.assign(defaultStyles, {
              height: options?.height,
              width: options?.width,
            }),
          }

          window.parent.postMessage(
            updateStyleMessage,
            options?.origin || e.origin
          )
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const postHandler = useCallback(
    (message: Partial<Message<T>>) => {
      if (state.iframeId && state.origin) {
        const postDataMessage: PostDataMessage<T> = {
          id: state.iframeId,
          action: 'MICROCMS_POST_DATA',
          message: message,
        }

        window.parent.postMessage(postDataMessage, state.origin)
      }
    },
    [state]
  )

  return [state.defaultMessage, postHandler]
}
