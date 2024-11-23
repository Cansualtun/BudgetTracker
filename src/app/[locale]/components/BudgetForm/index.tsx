"use client"
import { Transaction, TransactionType } from '@/types/generalType';
import { useTranslations } from "next-intl";
import { useState, useEffect, ChangeEvent } from 'react'

interface BudgetFormProps {
    onSubmit: (transaction: Transaction) => void;
}

interface Category {
    id: string;
    label: string;
}

interface NewTransactionState {
    type: TransactionType;
    amount: string;
    description: string;
    category: string;
    date: string;
}

const STORAGE_KEY = 'budget_categories';

const DEFAULT_CATEGORY: Category = { id: 'diger', label: 'Diğer' };

const DEFAULT_TRANSACTION: NewTransactionState = {
    type: 'expense',
    amount: '',
    description: '',
    category: DEFAULT_CATEGORY.id,
    date: new Date().toISOString().split('T')[0]
};

export function BudgetForm({ onSubmit }: BudgetFormProps) {
    const t = useTranslations();
    const [categories, setCategories] = useState<Category[]>([DEFAULT_CATEGORY]);
    const [newTransaction, setNewTransaction] = useState<NewTransactionState>(DEFAULT_TRANSACTION);

    useEffect(() => {
        loadCategories();
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                loadCategories();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('categoriesUpdated', loadCategories);
    }, []);

    const loadCategories = () => {
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData) {
                const parsedCategories = JSON.parse(storedData);
                const filteredCategories = parsedCategories
                    .filter((cat: Category) => cat.id !== 'all' && cat.id !== DEFAULT_CATEGORY.id);
                setCategories([...filteredCategories, DEFAULT_CATEGORY]);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            setCategories([DEFAULT_CATEGORY]);
        }
    };
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTransaction(prev => ({
            ...prev,
            [name]: name === 'type' ? value as TransactionType : value
        }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidTransaction()) return;

        onSubmit({
            id: Date.now(),
            type: newTransaction.type,
            amount: parseFloat(newTransaction.amount),
            description: newTransaction.description,
            category: newTransaction.category,
            date: newTransaction.date
        });

        resetForm();
    };

    const isValidTransaction = () => {
        return newTransaction.amount &&
            newTransaction.description &&
            newTransaction.date;
    };

    const resetForm = () => {
        setNewTransaction({
            ...DEFAULT_TRANSACTION,
            date: new Date().toISOString().split('T')[0]
        });
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    {t('budget.form.type')}
                </label>
                <select
                    name="type"
                    value={newTransaction.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 
                        text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500
                        border-gray-300 dark:border-gray-700"
                >
                    <option value="income">{t('budget.form.income')}</option>
                    <option value="expense">{t('budget.form.expense')}</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    {t('budget.form.amount')}
                </label>
                <input
                    name="amount"
                    type="number"
                    placeholder="0.00"
                    value={newTransaction.amount}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 
                        text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500
                        border-gray-300 dark:border-gray-700"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    {t('budget.form.description')}
                </label>
                <input
                    name="description"
                    type="text"
                    placeholder={t('budget.form.descriptionPlaceholder')}
                    value={newTransaction.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 
                        text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500
                        border-gray-300 dark:border-gray-700"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    {t('budget.form.date')}
                </label>
                <input
                    name="date"
                    type="date"
                    value={newTransaction.date}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 
                        text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500
                        border-gray-300 dark:border-gray-700"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t('budget.form.category')}
                </label>
                <select
                    name="category"
                    value={newTransaction.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 
                        text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500
                        border-gray-300 dark:border-gray-700"
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg 
                    transition-colors duration-200 ease-in-out"
            >
                {t('budget.form.save')}
            </button>
        </div>
    );
}