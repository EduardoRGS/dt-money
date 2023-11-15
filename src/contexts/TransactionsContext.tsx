import { ReactNode, useEffect, useState } from 'react'
import { Transaction } from '../types/transaction'
import { api } from '../lib/axios'
import { createContext } from 'use-context-selector'

interface CreateTransactionInput {
  description: string
  price: number
  category: string
  type: 'income' | 'outcome'
}

interface TransactionContextType {
  transactions: Transaction[]
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (data: CreateTransactionInput) => Promise<void>
}

interface TransactionsProviderProps {
  children: ReactNode
}

/**
 * Importante!
 * Por que que um componente renderiza?
 * - Hooks changed (mudou estado, contexto, reducer)ç
 * - Props changed (mudou propriedades)ç
 * - Parent rerendered (componente pai renderizou)ç
 * Qual o fluxo de renderização do react?
 * 1. O React recria o HTML da interface daquele componente
 * 2. Compara a versão do HTML recriada com a versão anterior
 * 3. Se mudou algo, ele reescreve o HTML na tela
 * Memo:
 * 0. Hooks changed, Props changed (deep comparison)
 * 0.1 Compara a versão anterior dos hooks e props
 * 0.2 Se mudou algo, ele vai permitir a nova renderização
 **/

export const TransactionsContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  async function fetchTransactions(query?: string) {
    const response = await api.get('transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      },
    })

    setTransactions(response.data)
  }

  async function createTransaction(data: CreateTransactionInput) {
    const { description, price, category, type } = data

    const response = await api.post('transactions', {
      description,
      price,
      category,
      type,
      createdAt: new Date(),
    })

    setTransactions((state) => [response.data, ...state])
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        fetchTransactions,
        createTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
