import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatsCards } from '../stats-cards'

describe('StatsCards', () => {
  const mockProps = {
    verified: { count: 523, trend: 12.3, sparkline: [45, 52, 48, 61, 55, 67, 72] },
    needsReview: { count: 234 },
    aiQueue: { count: 127, status: 'Processing' },
    rejected: { count: 89, trend: -2.1 }
  }

  it('renders all 4 stat cards', () => {
    render(<StatsCards {...mockProps} />)
    
    expect(screen.getByText('Verified Resources')).toBeInTheDocument()
    expect(screen.getByText('Needs Review')).toBeInTheDocument()
    expect(screen.getByText('AI Queue')).toBeInTheDocument()
    expect(screen.getByText('Rejected')).toBeInTheDocument()
  })

  it('displays correct counts', () => {
    render(<StatsCards {...mockProps} />)
    
    expect(screen.getByText('523')).toBeInTheDocument()
    expect(screen.getByText('234')).toBeInTheDocument()
    expect(screen.getByText('127')).toBeInTheDocument()
    expect(screen.getByText('89')).toBeInTheDocument()
  })

  it('displays trend badges', () => {
    render(<StatsCards {...mockProps} />)
    
    expect(screen.getByText('+12.3%')).toBeInTheDocument()
  })
})
