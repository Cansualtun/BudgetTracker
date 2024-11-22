"use client"
import { Transaction, Category, TransactionType } from '@/types/generalType';
import { useState, ChangeEvent } from 'react'

interface BudgetFormProps {
    onSubmit: (transaction: Transaction) => void;
}

interface NewTransactionState {
    type: TransactionType;
    amount: string;
    description: string;
    category: Category;
}

export function BudgetForm({ onSubmit }: BudgetFormProps) {
    const [newTransaction, setNewTransaction] = useState<NewTransactionState>({
        type: 'expense',
        amount: '',
        description: '',
        category: 'diger'
    });

    const categories = [
        { id: 'mutfak', label: 'Mutfak' },
        { id: 'kozmetik', label: 'Kozmetik' },
        { id: 'egitim', label: 'Eğitim' },
        { id: 'ulasim', label: 'Ulaşım' },
        { id: 'eglence', label: 'Eğlence' },
        { id: 'diger', label: 'Diğer' }
    ] as const;

    function handleInputChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setNewTransaction(prev => ({
            ...prev,
            [name]: name === 'type' ? value as TransactionType : value
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!newTransaction.amount || !newTransaction.description) return;

        const transactionToSubmit: Transaction = {
            id: Date.now(),
            type: newTransaction.type,
            amount: parseFloat(newTransaction.amount),
            description: newTransaction.description,
            category: newTransaction.category
        };

        onSubmit(transactionToSubmit);
        setNewTransaction({
            type: 'expense',
            amount: '',
            description: '',
            category: 'diger'
        });
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    İşlem Tipi
                </label>
                <select
                    name="type"
                    value={newTransaction.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                >
                    <option value="income">Gelir</option>
                    <option value="expense">Gider</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tutar
                </label>
                <input
                    name="amount"
                    type="number"
                    placeholder="0.00"
                    value={newTransaction.amount}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                </label>
                <input
                    name="description"
                    type="text"
                    placeholder="Açıklama giriniz"
                    value={newTransaction.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Kategori
                </label>
                <select
                    name="category"
                    value={newTransaction.category}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 
                        ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 
                        sm:text-sm sm:leading-6"
                >
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.label}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Kaydet
            </button>
        </div>
    );
}