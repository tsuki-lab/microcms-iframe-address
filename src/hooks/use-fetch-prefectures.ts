import { Reducer, useEffect, useReducer } from "react"

export const useFetchPrefectures = () => {
  const [state, reducer ] = useReducer<Reducer<Partial<PrefectureState>, Partial<PrefectureState>>>((_, payload) => {
    return payload
  }, {
    data: undefined,
    error: undefined,
    status: undefined
  })

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch('https://opendata.resas-portal.go.jp/api/v1/prefectures', {
        headers: {
          'X-API-KEY': import.meta.env.VITE_RESAS_API_KEY
        },
      })
      const body: ZipSuccess = await res.json()
      console.log(body);
      const { status } = res
      if (!res.ok) {
        reducer({
          data: undefined,
          error: body as unknown as string,
          status: status
        })
        return
      }

      reducer({
        data: body.result,
        error: undefined,
        status: status
      })
    }
    fetcher()
  }, [])

  return state
}

type PrefectureState = {
  data: Prefecture[],
  error: string,
  status: number
}

type Prefecture = {
  prefCode: number,
  prefName: string
}

type ZipSuccess = {
  message: null,
  result: Prefecture[]
}
