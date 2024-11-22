"use client"
import { Transaction, Category } from "@/types/generalType";
import { useState } from "react";

interface TransactionListProps {
    transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
    const [activeTab, setActiveTab] = useState<'all' | Category>('all');

    const categories: { id: Category | 'all', label: string }[] = [
        { id: 'all', label: 'Tümü' },
        { id: 'mutfak', label: 'Mutfak' },
        { id: 'kozmetik', label: 'Kozmetik' },
        { id: 'egitim', label: 'Eğitim' },
        { id: 'ulasim', label: 'Ulaşım' },
        { id: 'eglence', label: 'Eğlence' },
        { id: 'diger', label: 'Diğer' }
    ];

    const filteredTransactions = activeTab === 'all'
        ? transactions
        : transactions.filter(t => t.category === activeTab);

    const getCategoryTotal = (category: Category | 'all', type: 'income' | 'expense') => {
        const filtered = category === 'all' ? transactions : transactions.filter(t => t.category === category);
        return filtered
            .filter(t => t.type === type)
            .reduce((sum, t) => sum + t.amount, 0);
    };

    return (
        <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">İşlem Listesi</h2>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-4 overflow-x-auto pb-2">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setActiveTab(category.id)}
                            className={`whitespace-nowrap py-2 px-3 border-b-2 text-sm font-medium rounded-t-lg
                                ${activeTab === category.id
                                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {category.label}
                            {category.id !== 'all' && (
                                <span className="ml-2 text-xs text-gray-400">
                                    ({transactions.filter(t => t.category === category.id).length})
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* İşlem Listesi */}
            <div className="space-y-3">
                {filteredTransactions.map(transaction => (
                    <div
                        key={transaction.id}
                        className={`p-4 rounded-lg border transition-all transform hover:scale-[1.02]
                            ${transaction.type === 'income'
                                ? 'bg-green-50/50 border-green-200 hover:bg-green-50'
                                : 'bg-red-50/50 border-red-200 hover:bg-red-50'
                            }`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{transaction.description}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {categories.find(c => c.id === transaction.category)?.label}
                                </p>
                            </div>
                            <div className={`text-lg font-bold 
                                ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                            >
                                {transaction.type === 'income' ? '+' : '-'} ₺{transaction.amount.toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredTransactions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        Bu kategoride henüz işlem bulunmuyor
                    </div>
                )}
            </div>

            {/* Özet Kartları */}
            <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="text-sm text-green-800 font-medium">
                        {activeTab === 'all' ? 'Toplam Gelir' : `${categories.find(c => c.id === activeTab)?.label} Gelir`}
                    </h3>
                    <p className="text-xl text-green-600 font-bold">
                        ₺{getCategoryTotal(activeTab, 'income').toLocaleString()}
                    </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h3 className="text-sm text-red-800 font-medium">
                        {activeTab === 'all' ? 'Toplam Gider' : `${categories.find(c => c.id === activeTab)?.label} Gider`}
                    </h3>
                    <p className="text-xl text-red-600 font-bold">
                        ₺{getCategoryTotal(activeTab, 'expense').toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
}