import { Reducer, useEffect, useReducer } from 'react'
import { Loading } from './components/Loading'
import { useMicroCMSIframe } from './hooks/use-microcms-iframe'
import { useZipcloud } from './hooks/use-zipcloud/use-zipcloud'

import './app.css'

const initFormState = {
  zip: '',
  address: '',
  building: '',
}

type FormState = typeof initFormState

type FormReducer = Reducer<FormState, Partial<FormState>>

function App() {
  const [formState, formDispatch] = useReducer<FormReducer>(
    (prev, action) => ({ ...prev, ...action }),
    initFormState
  )

  const { defaultMessage, microCMSPostData } = useMicroCMSIframe<FormState>({
    height: 410,
  })

  const { error: zipError, handler, loading } = useZipcloud()

  // microCMSに登録されている情報をStateに詰める
  useEffect(() => {
    if (!defaultMessage?.data) return
    formDispatch(defaultMessage.data)
  }, [defaultMessage])

  /** 郵便番号から住所を検索する */
  const searchAddressByZip = async () => {
    const zpicode = formState.zip.replace(/^([0-9]{3})-?([0-9]{4})$/, '$1$2')
    const { data: zips } = await handler(zpicode)
    if (!zips) return
    formDispatch({
      zip: zpicode,
      address: `${zips[0].address1}${zips[0].address2}${zips[0].address3}`,
    })
  }

  // 郵便番号・住所・建物名のいずれかが更新されたらmicroCMSに送る
  useEffect(() => {
    const values = [
      formState.zip.replace(/^([0-9]{3})-?([0-9]{4})$/, '〒$1-$2'),
      formState.address,
      formState.building,
    ]
    microCMSPostData({
      description: values.join(' '),
      data: formState,
    })
  }, [formState, microCMSPostData])

  return (
    <>
      <form>
        <label htmlFor="zip">
          郵便番号
          <br />
          <span className="example">1640001</span>
        </label>

        <input
          id="zip"
          type="text"
          required
          autoComplete="off"
          value={formState.zip}
          onChange={(e) => formDispatch({ zip: e.target.value })}
        />
        <p className="error">{zipError}</p>
        <button type="button" onClick={searchAddressByZip}>
          郵便番号で住所を検索
        </button>

        <label htmlFor="address">
          住所
          <br />
          <span className="example">東京都中野区中野5-65-5</span>
        </label>
        <input
          id="address"
          type="text"
          className="w-full"
          required
          autoComplete="off"
          value={formState.address}
          onChange={(e) => formDispatch({ address: e.target.value })}
        />

        <label htmlFor="building">
          建物名
          <br />
          <span className="example">豊島興業ビル7F</span>
        </label>
        <input
          id="building"
          type="text"
          className="w-full"
          autoComplete="off"
          value={formState.building}
          onChange={(e) => formDispatch({ building: e.target.value })}
        />
      </form>
      {loading && <Loading />}
    </>
  )
}

export default App
