import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { App } from './App'

describe('accessible application shell', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('provides skip navigation and named semantic landmarks', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /demo journey/i })).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
  })

  test('identifies fictional demo data and simulated roles without implying authentication', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText(/demo mode — fictional records and illustrative images/i)).toBeInTheDocument()
    expect(screen.getByText(/simulates perspective; it is not authentication/i)).toBeInTheDocument()

    await user.selectOptions(screen.getByRole('combobox', { name: /simulated role/i }), 'facilities')
    expect(screen.getByText(/current perspective: facilities/i)).toBeInTheDocument()
    expect(screen.getByText(/review priority and prepare assignment/i)).toBeInTheDocument()
  })

  test('marks one lifecycle step current and communicates every state with text', () => {
    render(<App />)
    const rail = screen.getByRole('navigation', { name: /demo journey/i })
    const current = within(rail).getByRole('link', { name: /observed/i })

    expect(current).toHaveAttribute('aria-current', 'step')
    expect(within(rail).getByText('Current')).toBeInTheDocument()
    expect(within(rail).getAllByText('Upcoming')).toHaveLength(5)
    expect(within(rail).getAllByRole('link')).toHaveLength(6)
    for (const link of within(rail).getAllByRole('link')) expect(link).toHaveAttribute('href')
  })

  test('persists reduced motion preference separately from demo reset', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('checkbox', { name: /reduce motion/i }))
    expect(document.documentElement).toHaveAttribute('data-reduced-motion', 'true')
    expect(localStorage.getItem('access-haryana-campus.preferences')).toContain('"reducedMotion":true')

    await user.click(screen.getByRole('button', { name: /reset demo/i }))
    await user.click(screen.getByRole('button', { name: /confirm reset/i }))
    expect(document.documentElement).toHaveAttribute('data-reduced-motion', 'true')
  })

  test('offers persistent text-size and high-contrast preferences', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /increase text size/i }))
    await user.click(screen.getByRole('checkbox', { name: /high contrast/i }))

    expect(document.documentElement).toHaveAttribute('data-text-size', 'large')
    expect(document.documentElement).toHaveAttribute('data-high-contrast', 'true')
    expect(localStorage.getItem('access-haryana-campus.preferences')).toContain('"highContrast":true')
  })

  test('requires confirmation before reset and allows cancellation', async () => {
    const user = userEvent.setup()
    const confirm = vi.spyOn(window, 'confirm')
    render(<App />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /reset demo/i }))
    expect(screen.getByRole('dialog', { name: /reset fictional demo records/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(confirm).not.toHaveBeenCalled()
  })

  test('contains dialog focus, closes with Escape, and restores focus to reset trigger', async () => {
    const user = userEvent.setup()
    render(<App />)
    const trigger = screen.getByRole('button', { name: /reset demo/i })

    await user.click(trigger)
    const cancel = screen.getByRole('button', { name: /cancel/i })
    const confirmReset = screen.getByRole('button', { name: /confirm reset/i })
    expect(cancel).toHaveFocus()

    await user.tab({ shift: true })
    expect(confirmReset).toHaveFocus()
    await user.tab()
    expect(cancel).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  test('remains usable when preference storage is unavailable', async () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })

    expect(() => render(<App />)).not.toThrow()
    await userEvent.click(screen.getByRole('checkbox', { name: /reduce motion/i }))
    expect(document.documentElement).toHaveAttribute('data-reduced-motion', 'true')

    getItem.mockRestore()
    setItem.mockRestore()
  })
})
