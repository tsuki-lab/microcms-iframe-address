import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { App } from '../src/App'

describe('testing App.tsx', () => {
  test('snapshot testing', () => {
    const { asFragment } = render(<App />)
    expect(asFragment()).toMatchSnapshot()
  })
})
