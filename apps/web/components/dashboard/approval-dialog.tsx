'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Check, X } from 'lucide-react'

interface ApprovalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  resourceTitle: string
  resourceDescription: string
  suggestedCategory: string
  confidence: number
  onSubmit: (decision: 'approve' | 'reject', reason: string) => void
}

export function ApprovalDialog({
  open,
  onOpenChange,
  resourceTitle,
  resourceDescription,
  suggestedCategory,
  confidence,
  onSubmit,
}: ApprovalDialogProps) {
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null)
  const [reason, setReason] = useState('')
  const firstFocusRef = useRef<HTMLButtonElement>(null)

  // Focus first button when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        firstFocusRef.current?.focus()
      }, 100)
    }
  }, [open])

  const canSubmit = decision !== null && (decision === 'approve' || reason.trim())

  const handleSubmit = () => {
    if (decision && canSubmit) {
      onSubmit(decision, reason)
      onOpenChange(false)
      setDecision(null)
      setReason('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Review Categorization</DialogTitle>
          <DialogDescription>
            AI suggests categorizing this resource as <strong>{suggestedCategory}</strong>
            with {confidence}% confidence.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="rounded-lg border bg-surface p-4 mb-4">
            <h4 className="font-medium mb-2">{resourceTitle}</h4>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {resourceDescription}
            </p>
          </div>
          
          <div className="flex gap-2 mb-4">
            <Button 
              ref={firstFocusRef}
              variant="outline" 
              className="flex-1"
              onClick={() => setDecision('approve')}
            >
              <Check className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setDecision('reject')}
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
          
          <Label htmlFor="reason">Reason (required for rejection)</Label>
          <Textarea 
            id="reason"
            placeholder="Explain your decision..."
            className="mt-2"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant={decision === 'reject' ? 'destructive' : 'default'}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Submit Decision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}