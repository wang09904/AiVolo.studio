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

/**
 * 积分流水记录组件
 */
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
          throw new Error(data.error || '获取流水失败')
        }

        setTransactions(data.transactions || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取流水失败')
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
          <div key={i} className="h-16 bg-gray-100 rounded" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-gray-500 p-4 text-center">
        暂无积分记录
      </div>
    )
  }

  // 类型映射
  const typeLabels: Record<string, string> = {
    reward: '奖励',
    deduct: '消费',
    purchase: '购买',
    refund: '退款',
  }

  // 格式化时间
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('zh-CN', {
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
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div>
            <p className="font-medium">
              {typeLabels[tx.type] || tx.type}
            </p>
            <p className="text-sm text-gray-500">
              {formatDate(tx.created_at)}
            </p>
            {tx.description && (
              <p className="text-sm text-gray-400">{tx.description}</p>
            )}
          </div>
          <div className={`text-lg font-bold ${tx.type === 'deduct' ? 'text-red-500' : 'text-green-500'}`}>
            {tx.type === 'deduct' ? '-' : '+'}{tx.amount}
          </div>
        </div>
      ))}
    </div>
  )
}