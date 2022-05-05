import { useApp } from './app.hook'
import { Loading } from './components/Loading'

import './app.css'

function App() {
  const { state, setState, zipError, searchAddressByZip, loading } = useApp()

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
          value={state?.postalCode}
          onChange={(e) =>
            setState((prev) => prev && { ...prev, postalCode: e.target.value })
          }
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
          value={state?.addressLevel1}
          onChange={(e) =>
            setState(
              (prev) => prev && { ...prev, addressLevel1: e.target.value }
            )
          }
        />

        <label htmlFor="address-level2">
          市区町村
          <br />
          <span className="example">中野区</span>
        </label>
        <input
          type="text"
          id="address-level2"
          value={state?.addressLevel2}
          onChange={(e) =>
            setState(
              (prev) => prev && { ...prev, addressLevel2: e.target.value }
            )
          }
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
          value={state?.streetAddress}
          onChange={(e) =>
            setState(
              (prev) => prev && { ...prev, streetAddress: e.target.value }
            )
          }
        />
      </form>
      {loading && <Loading />}
    </>
  )
}

export default App
