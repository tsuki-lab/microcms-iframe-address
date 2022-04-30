import { useCallback, useReducer, useState } from 'react'
import { ZipError, ZipState, ZipStateReducer, ZipSuccess } from './types'

const convertErrorMessage = (message: string) => {
  switch (message) {
    case 'パラメータ「郵便番号」の桁数が不正です。':
      return '郵便番号の桁数が誤っています。'
    default:
      return message
  }
}

export const useZipcloud = () => {
  const [loading, setLoadingState] = useState(false)
  const [state, reducer] = useReducer<ZipStateReducer>(
    (_, payload) => {
      return payload
    },
    {
      data: undefined,
      error: undefined,
      status: undefined,
    }
  )

  const handler = useCallback(async (zipcode: string) => {
    // 郵便番号が入力されていない
    if (!zipcode) {
      const errRes = {
        data: undefined,
        error: '郵便番号が入力されていません。',
        status: 400 as ZipState['status'],
      }
      reducer(errRes)
      return errRes
    }

    setLoadingState(true)
    const res = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`
    )
    const body: ZipSuccess | ZipError = await res.json()

    // 異常系
    if (body.status !== 200) {
      const errRes = {
        data: undefined,
        error: convertErrorMessage(body.message),
        status: body.status,
      }
      reducer(errRes)
      setLoadingState(false)
      return errRes
    }

    // responseが0件
    if (!body.results) {
      const errRes = {
        data: undefined,
        error: '誤った郵便番号が入力されています',
        status: body.status,
      }
      reducer(errRes)
      setLoadingState(false)
      return errRes
    }

    // 正常系
    const successRes = {
      data: body.results,
      error: undefined,
      status: body.status,
    }

    reducer(successRes)
    setLoadingState(false)
    return successRes
  }, [])

  return {
    loading,
    handler,
    ...state,
  }
}
