import { useMemo, useRef } from 'react'
import { Loading } from './components/Loading'
import { useFetchPrefectures } from './hooks/use-fetch-prefectures'
import { useZipcloud } from './hooks/use-zipcloud'

import './app.css'

function App() {
  const {error: zipError, handler, loading} = useZipcloud()
  const isLoading = useMemo(() => {
    return loading
  }, [loading])

  const zipRef = useRef<HTMLInputElement>(null)
  const addressRef = useRef<HTMLInputElement>(null)
  const building = useRef<HTMLInputElement>(null)

  const searchZip = async () => {
    if (!addressRef.current) return

    const value = zipRef.current?.value || ''
    const { data: zips } = await handler(value)
    if (!zips) return

    addressRef.current.value = `${zips[0].address1}${zips[0].address2}${zips[0].address3}`
  }

  const submitHandler = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <main>
      <form onSubmit={submitHandler}>

        <label htmlFor="zip">
          郵便番号
          <span className='required'>*</span><br />
          <span className='example'>1640001</span>
        </label>

        <input id="zip" type="text" ref={zipRef} required autoComplete='off' />
        <p className="red">{zipError}</p>
        <button type='button' onClick={searchZip}>郵便番号で住所を検索</button>

        <label htmlFor="address">
          住所
          <span className='required'>*</span><br />
          <span className='example'>東京都中野区中野5-65-5</span>
        </label>
        <input id="address" type="text" ref={addressRef} className="w-full" required />

        <label htmlFor="building">
          建物名<br />
          <span className='example'>豊島興業ビル7F</span>
        </label>
        <input id="building" type="text" ref={building} className="w-full" />
      </form>
      {isLoading && <Loading />}
    </main>
  )
}

export default App
