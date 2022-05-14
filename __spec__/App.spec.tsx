import 'vi-fetch/setup';
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from '../src/App'

describe('Test App.tsx', () => {
  it('スナップショットテスト', () => {
    const { asFragment } = render(<App />)
    expect(asFragment()).toMatchSnapshot()
  })
})
