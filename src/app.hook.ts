import { Reducer, useEffect, useReducer } from 'react'
import { useMicroCMSIframe } from './hooks/use-microcms-iframe'
import { useZipcloud } from './hooks/use-zipcloud'

const initFormState = {
  postalCode: '', // 郵便番号
  addressLevel1: '', // 都道府県
  addressLevel2: '', // 市区町村
  streetAddress: '', // 町名以下
}

type FormState = typeof initFormState

type FormReducer = Reducer<FormState, Partial<FormState>>

export const useApp = () => {
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

  return {
    formState,
    formDispatch,
    zipError,
    searchAddressByZip,
    loading,
  }
}
