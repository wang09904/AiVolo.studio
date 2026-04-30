'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  created_at: string
}

export default function CreditHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/credits/transactions')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Credit activity is unavailable.')
        }

        setTransactions(data.transactions || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Credit activity is unavailable.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded bg-[oklch(22%_0.018_270)]" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-[oklch(76%_0.12_25)]">
        {error}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="p-4 text-center text-[oklch(62%_0.016_270)]">
        No credit activity yet.
      </div>
    )
  }

  const typeLabels: Record<string, string> = {
    credit: 'Credit',
    debit: 'Usage',
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center justify-between rounded-md border border-[oklch(29%_0.018_270)] bg-[oklch(12%_0.014_270)] p-4"
        >
          <div>
            <p className="font-medium text-[oklch(90%_0.012_270)]">
              {typeLabels[tx.type] || tx.type}
            </p>
            <p className="text-sm text-[oklch(62%_0.016_270)]">
              {formatDate(tx.created_at)}
            </p>
            {tx.description && (
              <p className="text-sm text-[oklch(58%_0.016_270)]">{tx.description}</p>
            )}
          </div>
          <div className={`text-lg font-bold ${tx.amount < 0 ? 'text-[oklch(72%_0.18_25)]' : 'text-[oklch(72%_0.18_145)]'}`}>
            {tx.amount > 0 ? '+' : ''}{tx.amount}
          </div>
        </div>
      ))}
    </div>
  )
}
