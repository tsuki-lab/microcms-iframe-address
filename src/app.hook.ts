import { useStateMicroCMSIframe } from 'use-microcms-iframe'
import { useZipcloud } from './hooks/use-zipcloud'
import { FormState } from './types'

const initFormState: FormState = {
  postalCode: '',
  addressLevel1: '',
  addressLevel2: '',
  streetAddress: '',
}

export type UseAppResult = {
  state: FormState | null
  setState: React.Dispatch<React.SetStateAction<FormState>>
  zipError: string | undefined
  searchAddressByZip: () => Promise<void>
  loading: boolean
}

export const useApp = (): UseAppResult => {
  const [state, setState] = useStateMicroCMSIframe(initFormState, {
    height: 510,
    parsePostMessageParams: (data) => {
      const values = [
        data?.postalCode.replace(/^([0-9]{3})-?([0-9]{4})$/, '〒$1-$2'),
        data?.addressLevel1,
        data?.addressLevel2,
        data?.streetAddress,
      ]
      return {
        description: values.filter(Boolean).join(' '),
        data: data,
      }
    },
  })

  const { error: zipError, handler, loading } = useZipcloud()

  /** 郵便番号から住所を検索する */
  const searchAddressByZip = async () => {
    const postalCode =
      state?.postalCode.replace(/^([0-9]{3})-?([0-9]{4})$/, '$1$2') || ''
    const { data: zips } = await handler(postalCode)
    if (!zips) return
    setState({
      postalCode,
      addressLevel1: zips[0].address1,
      addressLevel2: zips[0].address2,
      streetAddress: zips[0].address3,
    })
  }

  return {
    state,
    setState,
    zipError,
    searchAddressByZip,
    loading,
  }
}
