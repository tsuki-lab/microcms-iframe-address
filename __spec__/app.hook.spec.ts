import 'vi-fetch/setup'
import { act, renderHook, RenderHookResult } from '@testing-library/react-hooks'
import { mockFetch, mockGet } from 'vi-fetch'
import { beforeEach, describe, expect, it } from 'vitest'
import { useApp, UseAppResult } from '../src/app.hook'
import { FormState } from '../src/types'

describe('Test useApp', () => {
  const initFormState: FormState = {
    postalCode: '',
    addressLevel1: '',
    addressLevel2: '',
    streetAddress: '',
  } as const

  const exampleState: FormState = {
    postalCode: '1640001',
    addressLevel1: '東京都',
    addressLevel2: '中野区',
    streetAddress: '中野5-65-5 豊島興業ビル7F',
  } as const

  let result: RenderHookResult<unknown, UseAppResult>['result']
  beforeEach(() => {
    mockFetch.clearAll()
    result = renderHook(() => useApp()).result
  })

  it('初期値確認', () => {
    expect(result.current.state).toEqual(initFormState)
    expect(result.current.zipError).toBeUndefined()
    expect(result.current.loading).toBe(false)
  })

  it('setStateの確認', () => {
    act(() => {
      result.current.setState(exampleState)
    })

    expect(result.current.state).toEqual(exampleState)
    expect(result.current.loading).toBe(false)
  })

  it('郵便番号から住所を補完する', async () => {
    mockGet(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=1640001`
    ).willResolve({
      message: null,
      results: [
        {
          address1: '東京都',
          address2: '中野区',
          address3: '中野',
          kana1: 'ﾄｳｷｮｳﾄ',
          kana2: 'ﾅｶﾉｸ',
          kana3: 'ﾅｶﾉ',
          prefcode: '13',
          zipcode: '1640001',
        },
      ],
      status: 200,
    })

    act(() => {
      result.current.setState(
        (prev) => prev && { ...prev, postalCode: exampleState.postalCode }
      )
    })

    expect(result.current.state).toEqual(
      Object.assign({}, initFormState, { postalCode: exampleState.postalCode })
    )

    await act(async () => {
      await result.current.searchAddressByZip()
    })

    expect(result.current.state).toEqual({
      postalCode: '1640001',
      addressLevel1: '東京都',
      addressLevel2: '中野区',
      streetAddress: '中野',
    })
  })

  it('Error：「郵便番号が入力されていません。」', async () => {
    expect(result.current.state.postalCode).toBe('')
    await act(async () => {
      await result.current.searchAddressByZip()
    })
    expect(result.current.zipError).toBe('郵便番号が入力されていません。')
    expect(result.current.loading).toBe(false)
  })

  it('Error：「誤った郵便番号が入力されています。」', async () => {
    const postalCode = '0000000'
    const updatedState = Object.assign(initFormState, { postalCode })
    mockGet(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`
    ).willResolve({
      message: null,
      results: null,
      status: 200,
    })

    act(() => {
      result.current.setState((prev) => prev && { ...prev, postalCode })
    })

    expect(result.current.state).toEqual(updatedState)

    await act(async () => {
      await result.current.searchAddressByZip()
    })
    expect(result.current.zipError).toBe('誤った郵便番号が入力されています。')
    expect(result.current.state).toEqual(updatedState)
    expect(result.current.loading).toBe(false)
  })

  it('Error：「郵便番号の桁数が誤っています。」', async () => {
    const postalCode = '00000000000'
    const updatedState = Object.assign({}, initFormState, { postalCode })
    mockGet(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`
    ).willResolve({
      message: 'パラメータ「郵便番号」の桁数が不正です。',
      results: null,
      status: 400,
    })

    act(() => {
      result.current.setState((prev) => prev && { ...prev, postalCode })
    })

    expect(result.current.state).toEqual(updatedState)

    await act(async () => {
      await result.current.searchAddressByZip()
    })
    expect(result.current.zipError).toBe('郵便番号の桁数が誤っています。')
    expect(result.current.state).toEqual(updatedState)
    expect(result.current.loading).toBe(false)
  })
})
