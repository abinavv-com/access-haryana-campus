import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { readFileSync } from 'node:fs'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { App } from './App'
import { EvidenceImage } from '../components/EvidenceImage'
import { DEMO_STORAGE_KEY, saveDemoState } from '../data/storage'
import { createDemoFixture, fixtureIds } from '../data/demo-fixture.v1'

const documentStyles = document.createElement('style')
documentStyles.textContent = `${readFileSync('src/styles/tokens.css', 'utf8')}\n${readFileSync('src/styles/base.css', 'utf8')}\n${readFileSync('src/styles/components.css', 'utf8')}`
document.head.append(documentStyles)

function contrastRatio(foreground: string, background: string) {
  const luminance = (hex: string) => {
    const channels = hex.slice(1).match(/.{2}/g)
    if (!channels) throw new Error(`Expected a hexadecimal colour, received ${hex}`)
    const [red, green, blue] = channels.map(channel => {
      const value = Number.parseInt(channel, 16) / 255
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    })
    return red * 0.2126 + green * 0.7152 + blue * 0.0722
  }

  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
  return (lighter + 0.05) / (darker + 0.05)
}

describe('accessible application shell', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('provides skip navigation and named semantic landmarks', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /case progress/i })).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
  })

  test('uses a dark accent with sufficient contrast for evidence captions', () => {
    render(<EvidenceImage evidence={createDemoFixture().barriers[0].evidence[0]} />)

    expect(screen.getByText(/illustrative demo evidence/i)).toHaveStyle({ color: 'var(--accent-ink)' })
    expect(contrastRatio(getComputedStyle(document.documentElement).getPropertyValue('--accent-ink').trim(), '#f8f5ee')).toBeGreaterThanOrEqual(4.5)
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
    const rail = screen.getByRole('navigation', { name: /case progress/i })
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

  test('keeps editorial preferences on the document root', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /increase text size/i }))
    await user.click(screen.getByRole('checkbox', { name: /reduce motion/i }))
    expect(document.documentElement).toHaveAttribute('data-text-size', 'large')
    expect(document.documentElement).toHaveAttribute('data-reduced-motion', 'true')
    expect(document.documentElement).toHaveStyle({ colorScheme: 'light' })
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

  test('restores demo progress before first render and preserves it on refresh', () => {
    const saved = createDemoFixture()
    saved.barriers[0].status = 'validated'
    saveDemoState(saved)
    const first = render(<App />)
    expect(screen.getAllByText(/validated/i).length).toBeGreaterThan(0)
    first.unmount()
    render(<App />)
    expect(screen.getAllByText(/validated/i).length).toBeGreaterThan(0)
    expect(JSON.parse(localStorage.getItem(DEMO_STORAGE_KEY)!).state.barriers[0].status).toBe('validated')
  })

  test('surfaces recoverable demo storage warnings without blocking the app', () => {
    localStorage.setItem(DEMO_STORAGE_KEY, '{')
    render(<App />)
    expect(screen.getByText(/saved demo data could not be restored/i)).toHaveAttribute('role', 'status')
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  test('primary navigation uses valid entity routes without reloading the document', async () => {
    const user = userEvent.setup()
    window.history.replaceState({}, '', '/')
    render(<App />)
    const nav = screen.getByRole('navigation', { name: /primary/i })
    expect(within(nav).getByRole('link', { name: /barrier record/i })).toHaveAttribute('href', `/barriers/${fixtureIds.primaryBarrier}`)
    expect(within(nav).getByRole('link', { name: /work order/i })).toHaveAttribute('href', `/work-orders/${fixtureIds.primaryBarrier}`)
    await user.click(within(nav).getByRole('link', { name: /barrier record/i }))
    expect(window.location.pathname).toBe(`/barriers/${fixtureIds.primaryBarrier}`)
    expect(screen.getByRole('heading', { name: /landing narrowed/i })).toBeInTheDocument()
  })

  test('identifies the current route and presents the complete numbered case progress', () => {
    window.history.replaceState({}, '', '/audit')
    render(<App />)

    expect(screen.getByRole('link', { name: /guided audit/i })).toHaveAttribute('aria-current', 'page')
    const progress = screen.getByRole('navigation', { name: /case progress/i })
    expect(within(progress).getAllByRole('listitem')).toHaveLength(6)
    expect(within(progress).getByText('01')).toBeVisible()
    expect(within(progress).getByText('06')).toBeVisible()
  })

  test('keeps upcoming stage and actor copy legible against the progress band in high contrast', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('checkbox', { name: /high contrast/i }))
    const progress = screen.getByRole('navigation', { name: /case progress/i })
    const upcoming = within(progress).getByRole('link', { name: /validated/i })

    expect(within(upcoming).getByText('Validated')).toHaveStyle({ color: 'var(--paper)' })
    expect(within(upcoming).getByText('Designated reviewer')).toHaveStyle({ color: 'var(--paper)' })
    expect(contrastRatio(
      getComputedStyle(document.documentElement).getPropertyValue('--paper').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--ink').trim(),
    )).toBeGreaterThanOrEqual(7)
  })

  test('links work order and verification route entries to their matching case records', () => {
    window.history.replaceState({}, '', `/work-orders/${fixtureIds.primaryBarrier}`)
    const workOrderView = render(<App />)
    const workOrder = within(screen.getByRole('navigation', { name: /primary/i })).getByRole('link', { name: /work order/i })

    expect(workOrder).toHaveAttribute('href', `/work-orders/${fixtureIds.primaryBarrier}`)
    expect(workOrder).toHaveAttribute('aria-current', 'page')

    workOrderView.unmount()
    window.history.replaceState({}, '', `/verification/${fixtureIds.primaryBarrier}`)
    render(<App />)
    const verification = within(screen.getByRole('navigation', { name: /primary/i })).getByRole('link', { name: /verification/i })

    expect(verification).toHaveAttribute('href', `/verification/${fixtureIds.primaryBarrier}`)
    expect(verification).toHaveAttribute('aria-current', 'page')
  })
})
