import {useCallback, useEffect, useRef, useState} from 'react'
import {MicroCMSIframeState, MicroCMSPostParams, MicroCMSUpdateStyleParams} from './types'

export const useMicroCMSIframe = <T>(styleParams?: Partial<MicroCMSUpdateStyleParams>) => {
  const mounted = useRef(false)
  const [state, setState] = useState<MicroCMSIframeState<T>>({
    iframeId: '',
    serviceUrl: '',
    defaultMessage: {
      id: '',
      title: '',
      description: '',
      imageUrl: '',
      updatedAt: '',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {} as any
    },
  })

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      window.addEventListener('message', (e) => {
        if (
          e.isTrusted === true &&
          e.data.action === 'MICROCMS_GET_DEFAULT_DATA'
        ) {
          setState({
            iframeId: e.data.id,
            serviceUrl: e.origin,
            defaultMessage: e.data.message,
          })

          window.parent.postMessage(
            {
              id: e.data.id,
              action: 'MICROCMS_UPDATE_STYLE',
              message: styleParams,
            },
            e.origin,
          )
        }
      })
    }
  }, [])

  const postHandler = useCallback((payload: Partial<MicroCMSPostParams<T>>) => {
    if (state.iframeId && state.serviceUrl) {
      window.parent.postMessage(
        {
          id: state.iframeId,
          action: 'MICROCMS_POST_DATA',
          message: payload
        },
        state.serviceUrl
      )
    }
  }, [state])

  return {
    state,
    postHandler
  }
}
