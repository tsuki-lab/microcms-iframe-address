import { Reducer, useEffect, useMemo, useReducer } from 'react'
import { Loading } from './components/Loading'
import { useMicroCMSIframe } from './hooks/use-microcms-iframe'
import { useZipcloud } from './hooks/use-zipcloud/use-zipcloud'

import './app.css'

type FormState = {
  zip: string,
  address: string,
  building: string
}

type FormReducer = Reducer<FormState, Partial<FormState>>

function App() {
  const { state, postHandler } = useMicroCMSIframe<FormState>({
    height: 410
  })
  const { error: zipError, handler, loading } = useZipcloud()

  const isLoading = useMemo(() => loading, [loading])

  const [formState, formDispatch] = useReducer<FormReducer>((prev, action) => {
    return { ...prev, ...action }
  }, {
    zip: '',
    address: '',
    building: ''
  })

  const searchZip = async () => {
    const { data: zips } = await handler(formState.zip)
    if (zips) {
      formDispatch({address: `${zips[0].address1}${zips[0].address2}${zips[0].address3}`})
    }
  }

  useEffect(() => {
    if (state.defaultMessage?.data) {
      formDispatch(state.defaultMessage.data)
    }
  }, [state.defaultMessage])

  useEffect(() => {
    const values = [formState.zip.replace(/([0-9]{3})([0-9]{4})/, ''), formState.address, formState.building]
    postHandler({
      description: values.join(' '),
      data: formState
    })
  }, [formState])

  return (
    <>
      <form>
        <label htmlFor="zip">
          郵便番号<br />
          <span className='example'>1640001</span>
        </label>

        <input
          id="zip"
          type="text"
          required
          autoComplete='off'
          value={formState.zip}
          onChange={(e) => formDispatch({zip: e.target.value})}
        />
        <p className="error">{zipError}</p>
        <button type='button' onClick={searchZip}>郵便番号で住所を検索</button>

        <label htmlFor="address">
          住所<br />
          <span className='example'>東京都中野区中野5-65-5</span>
        </label>
        <input
          id="address"
          type="text"
          className="w-full"
          required
          autoComplete='off'
          value={formState.address}
          onChange={(e) => formDispatch({address: e.target.value})}
        />

        <label htmlFor="building">
          建物名<br />
          <span className='example'>豊島興業ビル7F</span>
        </label>
        <input
          id="building"
          type="text"
          className="w-full"
          autoComplete='off'
          value={formState.building}
          onChange={(e) => formDispatch({building: e.target.value})}
        />
      </form>
      {isLoading && <Loading />}
    </>
  )
}

export default App
