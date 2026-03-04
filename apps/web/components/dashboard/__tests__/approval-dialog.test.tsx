import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ApprovalDialog } from '../approval-dialog'

describe('ApprovalDialog', () => {
  const mockProps = {
    open: true,
    onOpenChange: vi.fn(),
    resourceTitle: 'Test Resource',
    resourceDescription: 'Test description',
    suggestedCategory: 'Technology',
    confidence: 87,
    onSubmit: vi.fn()
  }

  it('renders dialog content', () => {
    render(<ApprovalDialog {...mockProps} />)
    
    expect(screen.getByText('Review Categorization')).toBeInTheDocument()
    expect(screen.getByText('Test Resource')).toBeInTheDocument()
  })

  it('calls onSubmit with approve decision', () => {
    render(<ApprovalDialog {...mockProps} />)
    
    fireEvent.click(screen.getByText('Approve'))
    fireEvent.change(screen.getByLabelText(/Reason/), { target: { value: 'Looks good' } })
    fireEvent.click(screen.getByText('Submit Decision'))
    
    expect(mockProps.onSubmit).toHaveBeenCalledWith('approve', 'Looks good')
  })

  it('requires reason for rejection', () => {
    render(<ApprovalDialog {...mockProps} />)
    
    fireEvent.click(screen.getByText('Reject'))
    const submitButton = screen.getByText('Submit Decision')
    
    expect(submitButton).toBeDisabled()
    
    fireEvent.change(screen.getByLabelText(/Reason/), { target: { value: 'Wrong category' } })
    
    expect(submitButton).not.toBeDisabled()
  })

  it('calls onOpenChange when cancelled', () => {
    render(<ApprovalDialog {...mockProps} />)
    
    fireEvent.click(screen.getByText('Cancel'))
    
    expect(mockProps.onOpenChange).toHaveBeenCalledWith(false)
  })
})
