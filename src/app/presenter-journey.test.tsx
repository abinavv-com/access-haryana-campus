import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test } from 'vitest'
import { App } from './App'

beforeEach(() => {
  localStorage.clear()
  window.history.replaceState({}, '', '/')
})

test('a presenter completes the fictional audit-to-impact journey through visible controls', async () => {
  const user = userEvent.setup()
  render(<App />)

  expect(screen.getByText(/current perspective: auditor/i)).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /continue guided audit/i }))
  expect(screen.getByRole('main')).toHaveFocus()
  await user.click(screen.getByRole('button', { name: /submit screening finding/i }))

  expect(screen.getByRole('heading', { name: /approach landing requires designated review/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /observed/i })).toHaveAttribute('aria-current', 'step')

  await user.selectOptions(screen.getByRole('combobox', { name: /simulated role/i }), 'facilities')
  expect(screen.getByText(/current perspective: facilities/i)).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /validate screening/i }))
  expect(screen.getByRole('link', { name: /validated/i })).toHaveAttribute('aria-current', 'step')
  await user.click(screen.getByRole('button', { name: /^prioritise barrier$/i }))
  expect(screen.getByRole('link', { name: /prioritised/i })).toHaveAttribute('aria-current', 'step')
  await user.click(screen.getByRole('button', { name: /create repair work order/i }))

  await user.click(screen.getByRole('button', { name: /^create work order$/i }))
  expect(screen.getByRole('link', { name: /assigned/i })).toHaveAttribute('aria-current', 'step')
  await user.click(screen.getByRole('button', { name: /submit repair evidence/i }))
  expect(screen.getByRole('link', { name: /fixed \/ awaiting verification/i })).toHaveAttribute('aria-current', 'step')

  await user.selectOptions(screen.getByRole('combobox', { name: /simulated role/i }), 'verifier')
  expect(screen.getByText(/current perspective: verifier/i)).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /continue to independent verification/i }))
  await user.click(screen.getByRole('checkbox', { name: /freely consent/i }))
  await user.click(screen.getByRole('button', { name: /accept for this journey and test conditions/i }))
  expect(screen.getByRole('link', { name: /user verified/i })).toHaveAttribute('aria-current', 'step')

  await user.click(screen.getByRole('button', { name: /view traceable impact/i }))
  expect(screen.getByRole('heading', { name: /bounded verified outcomes/i })).toBeInTheDocument()
  expect(within(screen.getByText('Verified repairs').closest('article')!).getByText('1')).toBeInTheDocument()
  expect(screen.getByText('audit-obstruction-2026')).toBeInTheDocument()
  expect(screen.getByText('work-order-primary')).toBeInTheDocument()
  expect(screen.getByText('evidence-repair-after')).toBeInTheDocument()
  expect(screen.getByText('verification-1')).toBeInTheDocument()
  expect(screen.getByText('event-accept-1')).toBeInTheDocument()
})
