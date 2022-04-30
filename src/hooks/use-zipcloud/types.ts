import { Reducer } from "react"

export type ZipState = {
  data: Zip[],
  error: string,
  status: 200 | 400 | 500
}

export type ZipSuccess = {
  status: 200,
  message: null,
  results: Zip[] | null
}

export type ZipError = {
  status: 400 | 500,
  message: string,
  results: null
}

export type Zip = {
  address1: string,
  address2: string,
  address3: string,
  kana1: string,
  kana2: string,
  kana3: string,
  prefcode: string,
  zipcode: string
}

export type ZipStateReducer = Reducer<Partial<ZipState>, Partial<ZipState>>
