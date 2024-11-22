"use client"

import { useState } from 'react'
import { BudgetForm } from '../BudgetForm';
import { TransactionList } from '../TransactionList';
import { Transaction } from '@/types/generalType';

export function BudgetContainer() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    function handleAddTransaction(newTransaction: Transaction) {
        setTransactions(prev => [...prev, newTransaction]);
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-8">
            <div className="pr-8 py-8">
                {/* Başlık */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Bütçe Yönetimi
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Gelir ve giderlerinizi kolayca takip edin
                    </p>
                </div>
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-12 lg:col-span-5 xl:col-span-4">
                        <div className="bg-white rounded-2xl w-[400px] shadow-sm border border-gray-100 p-6 lg:p-8">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Yeni İşlem
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Gelir veya gider ekleyin
                                </p>
                            </div>
                            <BudgetForm onSubmit={handleAddTransaction} />
                        </div>
                    </div>

                    {/* Sağ Panel - İşlemler ve Özet */}
                    <div className="col-span-12 lg:col-span-7 xl:col-span-8 space-y-6">
                        {/* Özet Kartları */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Toplam Gelir */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                <div className="text-sm font-medium text-gray-500">
                                    Toplam Gelir
                                </div>
                                <div className="mt-2 flex items-baseline">
                                    <span className="text-2xl font-bold text-green-600">
                                        ₺{transactions
                                            .filter(t => t.type === 'income')
                                            .reduce((sum, t) => sum + t.amount, 0)
                                            .toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Toplam Gider */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                <div className="text-sm font-medium text-gray-500">
                                    Toplam Gider
                                </div>
                                <div className="mt-2 flex items-baseline">
                                    <span className="text-2xl font-bold text-red-600">
                                        ₺{transactions
                                            .filter(t => t.type === 'expense')
                                            .reduce((sum, t) => sum + t.amount, 0)
                                            .toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Net Durum */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                <div className="text-sm font-medium text-gray-500">
                                    Net Durum
                                </div>
                                <div className="mt-2 flex items-baseline">
                                    <span className="text-2xl font-bold text-blue-600">
                                        ₺{(transactions
                                            .filter(t => t.type === 'income')
                                            .reduce((sum, t) => sum + t.amount, 0) -
                                            transactions
                                                .filter(t => t.type === 'expense')
                                                .reduce((sum, t) => sum + t.amount, 0))
                                            .toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* İşlem Listesi */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Son İşlemler
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Tüm gelir ve gider hareketleriniz
                                </p>
                            </div>
                            <TransactionList transactions={transactions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}