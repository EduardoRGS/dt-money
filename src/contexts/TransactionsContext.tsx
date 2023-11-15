import { createContext, ReactNode, useEffect, useState } from 'react';
import { Transaction } from '../types/transaction';
import { api } from '../lib/axios';

interface TransactionContextType {
  transactions: Transaction[];
  fetchTransactions: (query?: string) => Promise<void>;
}

interface TransactionsProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionContextType);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  async function fetchTransactions(query?: string) {
    const response = await api.get('transactions', {
      params: {
        q: query,
      }
    })

    setTransactions(response.data)
  }

  useEffect(() => {
    fetchTransactions()
  }, []);

  return (
    <TransactionsContext.Provider value={{ 
      transactions,
      fetchTransactions
       }}>
      {children}
    </TransactionsContext.Provider>
  );
}