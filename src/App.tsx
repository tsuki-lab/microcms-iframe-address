import './app.css';
import { useMicroCMSExtension } from 'react-microcms-extension';
import { Loading } from './components/Loading';
import { useZipcloud } from './hooks/use-zipcloud';
import { FormState } from './types';



export const App: React.FC = () => {
  const { state, post: _post } = useMicroCMSExtension<FormState>({
    height: 510
  });

  const { error: zipError, handler, loading } = useZipcloud();

  const post = (data: Partial<FormState>) => {
    const values = [
      data?.postalCode?.replace(/^([0-9]{3})-?([0-9]{4})$/, '〒$1-$2'),
      data?.addressLevel1,
      data?.addressLevel2,
      data?.streetAddress,
    ];

    _post({
      description: values.filter(Boolean).join(' '),
      data: {
        postalCode: data?.postalCode,
        addressLevel1: data?.addressLevel1,
        addressLevel2: data?.addressLevel2,
        streetAddress: data?.streetAddress,
      },
    });
  };

  /** 郵便番号から住所を検索する */
  const searchAddressByZip = async () => {
    const postalCode =
      state?.message?.data?.postalCode.replace(/^([0-9]{3})-?([0-9]{4})$/, '$1$2') || '';
    const { data: zips } = await handler(postalCode);
    if (!zips) return;

    post({
      postalCode,
      addressLevel1: zips[0].address1,
      addressLevel2: zips[0].address2,
      streetAddress: zips[0].address3,
    });
  };

  return (
    <>
      <form autoComplete="off">
        <label htmlFor="postal-code">郵便番号</label>
        <span className="example">1640001</span>

        <input
          type="text"
          id="postal-code"
          name="postal-code"
          value={state?.message?.data.postalCode}
          onChange={(e) =>
            post({
              ...state?.message?.data,
              postalCode: e.target.value
            })
          }
        />
        {zipError && (
          <p className="error" role="alert">
            {zipError}
          </p>
        )}
        <button type="button" onClick={searchAddressByZip}>
          郵便番号で住所を検索
        </button>

        <label htmlFor="address-level1">都道府県</label>
        <span className="example">東京都</span>
        <input
          type="text"
          id="address-level1"
          value={state?.message?.data.addressLevel1}
          onChange={(e) =>
            post({
              ...state?.message?.data,
              addressLevel1: e.target.value
            })
          }
        />

        <label htmlFor="address-level2">市区町村</label>
        <span className="example">中野区</span>
        <input
          type="text"
          id="address-level2"
          value={state?.message?.data.addressLevel2}
          onChange={(e) =>
            post({
              ...state?.message?.data,
              addressLevel2: e.target.value
            })
          }
        />

        <label htmlFor="street-address">町名以下</label>
        <span className="example">中野5-65-5 豊島興業ビル7F</span>
        <input
          type="text"
          id="street-address"
          className="w-full"
          value={state?.message?.data.streetAddress}
          onChange={(e) =>
            post({
              ...state?.message?.data,
              streetAddress: e.target.value
            })
          }
        />
      </form>
      {loading && <Loading />}
    </>
  );
};
