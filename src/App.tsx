import { Reducer, useEffect, useReducer } from 'react'
import { Loading } from './components/Loading'
import { useMicroCMSIframe } from './hooks/use-microcms-iframe'
import { useZipcloud } from './hooks/use-zipcloud'

import './app.css'

const initFormState = {
  postalCode: '', // 郵便番号
  addressLevel1: '', // 都道府県
  addressLevel2: '', // 市区町村
  streetAddress: '', // 町名以下
}

type FormState = typeof initFormState

type FormReducer = Reducer<FormState, Partial<FormState>>

function App() {
  const [formState, formDispatch] = useReducer<FormReducer>(
    (prev, action) => ({ ...prev, ...action }),
    initFormState
  )

  const [message, postHandler] = useMicroCMSIframe<FormState>({
    height: 510,
  })

  const { error: zipError, handler, loading } = useZipcloud()

  // microCMSに登録されている情報をStateに詰める
  useEffect(() => {
    if (!message?.data) return
    formDispatch(message.data)
  }, [message])

  /** 郵便番号から住所を検索する */
  const searchAddressByZip = async () => {
    const postalCode = formState.postalCode.replace(
      /^([0-9]{3})-?([0-9]{4})$/,
      '$1$2'
    )
    const { data: zips } = await handler(postalCode)
    if (!zips) return
    formDispatch({
      postalCode,
      addressLevel1: zips[0].address1,
      addressLevel2: zips[0].address2,
      streetAddress: zips[0].address3,
    })
  }

  // 郵便番号・住所・建物名のいずれかが更新されたらmicroCMSに送る
  useEffect(() => {
    const values = [
      formState.postalCode.replace(/^([0-9]{3})-?([0-9]{4})$/, '〒$1-$2'),
      formState.addressLevel1,
      formState.addressLevel2,
      formState.streetAddress,
    ]
    postHandler({
      description: values.filter(Boolean).join(' '),
      data: formState,
    })
  }, [formState, postHandler])

  return (
    <>
      <form autoComplete="off">
        <label htmlFor="postal-code">
          郵便番号
          <br />
          <span className="example">1640001</span>
        </label>

        <input
          type="text"
          id="postal-code"
          name="postal-code"
          value={formState.postalCode}
          onChange={(e) => formDispatch({ postalCode: e.target.value })}
        />
        <p className="error">{zipError}</p>
        <button type="button" onClick={searchAddressByZip}>
          郵便番号で住所を検索
        </button>

        <label htmlFor="address-level1">
          都道府県
          <br />
          <span className="example">東京都</span>
        </label>
        <input
          type="text"
          id="address-level1"
          value={formState.addressLevel1}
          onChange={(e) => formDispatch({ addressLevel1: e.target.value })}
        />

        <label htmlFor="address-level2">
          市区町村
          <br />
          <span className="example">中野区</span>
        </label>
        <input
          type="text"
          id="address-level2"
          value={formState.addressLevel2}
          onChange={(e) => formDispatch({ addressLevel2: e.target.value })}
        />

        <label htmlFor="street-address">
          町名以下
          <br />
          <span className="example">中野5-65-5 豊島興業ビル7F</span>
        </label>
        <input
          type="text"
          id="street-address"
          className="w-full"
          value={formState.streetAddress}
          onChange={(e) => formDispatch({ streetAddress: e.target.value })}
        />
      </form>
      {loading && <Loading />}
    </>
  )
}

export default App
