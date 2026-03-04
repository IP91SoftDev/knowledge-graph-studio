import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatCard } from '../stat-card'
import { StatusBadge } from '../status-badge'
import { ProgressBar } from '../progress-bar'

describe('StatCard', () => {
  it('renders title and value', () => {
    render(<StatCard title="Total" value="19.5M" />)
    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByText('19.5M')).toBeInTheDocument()
  })

  it('renders trend with correct icon', () => {
    render(<StatCard title="Total" value="19.5M" trend="+12.3%" trendUp={true} />)
    expect(screen.getByText('+12.3%')).toBeInTheDocument()
  })

  it('renders downward trend with correct color', () => {
    render(<StatCard title="Errors" value="12" trend="-0.8%" trendUp={false} />)
    const trendElement = screen.getByText('-0.8%')
    expect(trendElement).toHaveClass('text-error')
  })
})

describe('StatusBadge', () => {
  it('renders verified badge', () => {
    render(<StatusBadge status="verified" />)
    expect(screen.getByText('Verified')).toBeInTheDocument()
  })

  it('renders review badge', () => {
    render(<StatusBadge status="review" />)
    expect(screen.getByText('Review')).toBeInTheDocument()
  })

  it('renders queue badge', () => {
    render(<StatusBadge status="queue" />)
    expect(screen.getByText('AI Queue')).toBeInTheDocument()
  })

  it('renders rejected badge', () => {
    render(<StatusBadge status="rejected" />)
    expect(screen.getByText('Rejected')).toBeInTheDocument()
  })
})

describe('ProgressBar', () => {
  it('renders with correct color for high value (≥80)', () => {
    const { container } = render(<ProgressBar value={87} />)
    expect(container.querySelector('.bg-success')).toBeInTheDocument()
  })

  it('renders with correct color for medium value (≥50)', () => {
    const { container } = render(<ProgressBar value={65} />)
    expect(container.querySelector('.bg-warning')).toBeInTheDocument()
  })

  it('renders with correct color for low value (<50)', () => {
    const { container } = render(<ProgressBar value={35} />)
    expect(container.querySelector('.bg-error')).toBeInTheDocument()
  })

  it('renders label when showLabel is true', () => {
    render(<ProgressBar value={87} showLabel={true} />)
    expect(screen.getByText('87%')).toBeInTheDocument()
  })
})
