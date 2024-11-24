"use client"
import { TransactionType } from '@/types/generalType';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddCategory: (type: TransactionType, limit?: number) => void;
    newCategory: string;
    setNewCategory: (value: string) => void;
}

export default function CategoryModal({
    isOpen,
    onClose,
    onAddCategory,
    newCategory,
    setNewCategory
}: CategoryModalProps) {
    const t = useTranslations();
    const [selectedType, setSelectedType] = useState<TransactionType>('income');
    const [limit, setLimit] = useState<string>('');

    useEffect(() => {
        if (!isOpen) {
            setSelectedType('income');
            setLimit('');
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddCategory(selectedType, selectedType === 'expense' ? Number(limit) || 0 : undefined);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedType(e.target.value as TransactionType);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">
                    {t('budget.categoryModal.addNewCategory')}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            {t('budget.categoryModal.categoryName')}
                        </label>
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder={t('budget.categoryModal.placeholder')}
                            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700
                                text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600
                                focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            {t('budget.form.type')}
                        </label>
                        <select
                            name="type"
                            value={selectedType}
                            onChange={handleTypeChange}
                            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800
                                text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500
                                border-gray-300 dark:border-gray-700"
                        >
                            <option value="income" className="flex items-center gap-2">
                                📈 {t('budget.form.income')}
                            </option>
                            <option value="expense" className="flex items-center gap-2">
                                📉 {t('budget.form.expense')}
                            </option>
                        </select>
                    </div>

                    {selectedType === 'expense' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                {t('budget.categoryModal.expenseLimit')}
                            </label>
                            <input
                                type="number"
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                placeholder="0.00"
                                className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700
                                    text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600
                                    focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {t('budget.categoryModal.limitDescription')}
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 
                                dark:text-gray-300 dark:hover:text-gray-100"
                        >
                            {t('budget.categoryModal.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                                disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!newCategory.trim()}
                        >
                            {t('budget.categoryModal.add')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}