import { Category, Transaction } from "@/types/generalType";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

interface TransactionListProps {
    transactions: Transaction[];
}

const STORAGE_KEY = 'budget_categories';
const DEFAULT_CATEGORIES = [{ id: 'all', label: 'Tümü' }];

export function TransactionList({ transactions }: TransactionListProps) {
    const [activeTab, setActiveTab] = useState<'all' | Category>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState<{ id: Category | 'all', label: string }[]>(DEFAULT_CATEGORIES);
    const [isClient, setIsClient] = useState(false);

    const t = useTranslations();


    useEffect(() => {
        setIsClient(true);
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            try {
                const parsedCategories = JSON.parse(storedData);
                setCategories([DEFAULT_CATEGORIES[0], ...parsedCategories]);
            } catch (error) {
                console.error('Error loading categories from localStorage:', error);
                setCategories(DEFAULT_CATEGORIES);
            }
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            try {
                const categoriesToStore = categories.filter(cat => cat.id !== 'all');
                localStorage.setItem(STORAGE_KEY, JSON.stringify(categoriesToStore));
            } catch (error) {
                console.error('Error saving categories to localStorage:', error);
            }
        }
    }, [categories, isClient]);

    const addCategory = () => {
        if (newCategory.trim()) {
            const newCategoryId = newCategory.toLowerCase().replace(/\s+/g, '-') as Category;
            const newCategoryObj = { id: newCategoryId, label: newCategory.trim() };
            setCategories(prev => [...prev, newCategoryObj]);
            setActiveTab(newCategoryId);
            setNewCategory('');
            setIsModalOpen(false);
        }
    };

    const filteredTransactions = activeTab === 'all'
        ? transactions
        : transactions.filter(t => t.category === activeTab);

    const getCategoryTotal = (category: Category | 'all', type: 'income' | 'expense') => {
        const filtered = category === 'all' ? transactions : transactions.filter(t => t.category === category);
        return filtered
            .filter(t => t.type === type)
            .reduce((sum, t) => sum + t.amount, 0);
    };

    if (!isClient) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mt-8">
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
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="whitespace-nowrap py-2 px-3 border-b-2 border-transparent 
                                text-gray-500 hover:text-gray-700 hover:border-gray-300 text-sm font-medium rounded-t-lg"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>
                    </button>
                </nav>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Yeni Kategori Ekle</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Kategori Adı
                                </label>
                                <input
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                                            focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    placeholder="Örn: Kira"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                                            rounded-md hover:bg-gray-200"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={addCategory}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 
                                            rounded-md hover:bg-blue-600"
                                >
                                    Ekle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold">{transaction.description}</p>
                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                        {categories.find(c => c.id === transaction.category)?.label || 'Belirtilmemiş'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>
                                        {new Date(transaction.date).toLocaleDateString('tr-TR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                            <div className={`text-lg font-bold flex flex-col items-end
                                ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                            >
                                <span>
                                    {transaction.type === 'income' ? '+' : '-'} ₺{transaction.amount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredTransactions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        {t("budget.transactions.list.emptyMessage")}
                    </div>
                )}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="text-sm text-green-800 font-medium">
                        {activeTab === 'all'
                            ? t("budget.transactions.list.categoryTotal.income")
                            : `${categories.find(c => c.id === activeTab)?.label} Gelir`}
                    </h3>
                    <p className="text-xl text-green-600 font-bold">
                        ₺{getCategoryTotal(activeTab, 'income').toLocaleString()}
                    </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h3 className="text-sm text-red-800 font-medium">
                        {activeTab === 'all'
                            ? t("budget.transactions.list.categoryTotal.expense")
                            : `${categories.find(c => c.id === activeTab)?.label} Gider`}
                    </h3>
                    <p className="text-xl text-red-600 font-bold">
                        ₺{getCategoryTotal(activeTab, 'expense').toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
}