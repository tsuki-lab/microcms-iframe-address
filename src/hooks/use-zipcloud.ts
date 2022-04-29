import { Reducer, useCallback, useEffect, useReducer, useState } from "react"

export const useZipcloud = () => {
  const [loading, setLoadingState] = useState(false)
  const [state, reducer ] = useReducer<Reducer<Partial<ZipState>, Partial<ZipState>>>((_, payload) => {
    return payload
  }, {
    data: undefined,
    error: undefined,
    status: undefined
  })

  const handler = useCallback(async (zipcode: string) => {
    if (!zipcode) {
      const errRes = {
        data: undefined,
        error: '郵便番号が入力されていません。',
        status: 400 as ZipState['status']
      }
      reducer(errRes)
      return errRes
    }

    setLoadingState(true)
    const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`)
    const body: ZipSuccess | ZipError = await res.json()
    if (body.status !== 200) {
      const errRes = {
        data: undefined,
        error: body.message,
        status: body.status
      }
      reducer(errRes)
      setLoadingState(false)
      return errRes
    }

    const successRes = {
      data: body.results,
      error: undefined,
      status: body.status
    }

    reducer(successRes)
    setLoadingState(false)
    return successRes
  }, [])

  return {
    loading,
    handler,
    ...state
  }
}
type ZipState = {
  data: Zip[],
  error: string,
  status: 200 | 400 | 500
}

type ZipSuccess = {
  status: 200,
  message: null,
  results: Zip[]
}

type ZipError = {
  status: 400 | 500,
  message: string,
  results: null
}

type Zip = {
  address1: string,
  address2: string,
  address3: string,
  kana1: string,
  kana2: string,
  kana3: string,
  prefcode: string,
  zipcode: string
}