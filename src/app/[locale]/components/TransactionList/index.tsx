"use client"
import { Transaction, TransactionType } from "@/types/generalType";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CategoryModal from "../CategoryModal";
import { addCategory, removeCategory } from '@/store/categorySlice';
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import toast from "react-hot-toast";
import { BarChart3, PlusCircle, Trash2, X } from "lucide-react";
import { removeTransaction } from "@/store/transactionSlice";
import { checkCategoryExpenseLimit } from "@/helpers/expenseLimit";

type ActiveTabType = 'all' | string;

export function TransactionList() {
    const [activeTab, setActiveTab] = useState<ActiveTabType>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const dispatch = useAppDispatch();
    const categories = useAppSelector(state => state.categories.categories);
    const transactions = useAppSelector(state => state.transactions.transactions);
    const allCategories = [{ id: 'all', label: 'Tümü' }, ...categories];

    const router = useRouter();
    const t = useTranslations();

    const handleAddCategory = (type: TransactionType, limit?: number) => {
        if (newCategory.trim()) {
            const newCategoryId = newCategory.toLowerCase().replace(/\s+/g, '-');
            const newCategoryObj = {
                id: newCategoryId,
                label: newCategory.trim(),
                type,
                ...(limit && { limit })
            };

            dispatch(addCategory(newCategoryObj));
            toast.success(t("budget.toast.categoryToast"));
            setActiveTab(newCategoryId);
            setNewCategory('');
            setIsModalOpen(false);
        }
    };

    const handleDeleteCategory = (categoryId: string) => {
        const hasTransactions = transactions.some(t => t.category === categoryId);
        if (hasTransactions) {
            toast.error("Bu kategoride işlemler bulunduğu için silinemiyor!");
            return;
        }
        dispatch(removeCategory(categoryId));
        toast.success("Kategori başarıyla silindi!");
        if (activeTab === categoryId) {
            setActiveTab('all');
        }
    };

    const filteredTransactions = activeTab === 'all'
        ? transactions
        : transactions.filter(t => t.category === activeTab);

    const getCategoryTotal = (category: string, type: 'income' | 'expense') => {
        const filtered = category === 'all' ? transactions : transactions.filter(t => t.category === category);
        const total = filtered
            .filter(t => t.type === type)
            .reduce((sum, t) => sum + t.amount, 0);

        if (type === 'expense' && category !== 'all') {
            const categoryObj = categories.find(c => c.id === category);
            if (categoryObj?.limit) {
                const { percentage } = checkCategoryExpenseLimit(transactions, categoryObj, { showToast: false });
                if (percentage > 80) {
                    return {
                        amount: total,
                        warning: true,
                        percentage
                    };
                }
            }
        }

        return {
            amount: total,
            warning: false,
            percentage: 0
        };
    };
    const handleDeleteTransaction = (transactionId: number) => {
        dispatch(removeTransaction(transactionId));
        toast.success("İşlem başarıyla silindi!");
    };
    useEffect(() => {
        categories.forEach(category => {
            if (category.type === 'expense' && category.limit) {
                const { hasWarning, percentage } = checkCategoryExpenseLimit(transactions, category, { showToast: false });
                if (hasWarning) {
                    const totalExpense = transactions
                        .filter(t => t.category === category.id && t.type === 'expense')
                        .reduce((sum, t) => sum + t.amount, 0);
                    const remainingBudget = category.limit - totalExpense;

                    toast.error(
                        `Dikkat: "${category.label}" kategorisinde limit aşımı! (%${percentage.toFixed(1)})
                        Kalan: ₺${remainingBudget.toLocaleString()}`,
                        {
                            duration: 5000,
                            icon: '⚠️',
                        }
                    );
                }
            }
        });
    }, [transactions, categories]);

    return (
        <div className="mt-8">
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-4 overflow-x-auto pb-2">
                    {allCategories.map(category => (
                        <div key={category.id} className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab(category.id)}
                                className={`whitespace-nowrap py-2 px-3 border-b-2 text-sm font-medium rounded-t-lg transition-colors
                                ${activeTab === category.id
                                        ? 'border-blue-500 text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700'
                                    }`}
                            >
                                {category.label}
                                {category.id !== 'all' && (
                                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-500">
                                        ({transactions.filter(t => t.category === category.id).length})
                                    </span>
                                )}
                            </button>
                            <div className="flex items-center gap-1">
                                {category.id !== 'all' && (
                                    <>
                                        <button
                                            onClick={() => {
                                                router.push(`/stats/${encodeURIComponent(category.id)}`);
                                            }}
                                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50
                                            dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-500/10
                                            rounded-lg transition-colors flex items-center"
                                            title={`${category.label} istatistikleri`}
                                        >
                                            <BarChart3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(category.id)}
                                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50
                                            dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10
                                            rounded-lg transition-colors flex items-center"
                                            title={`${category.label} kategorisini sil`}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="whitespace-nowrap py-2 px-3 border-b-2 border-transparent 
                        text-gray-600 hover:text-gray-900 hover:border-gray-300 
                        dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700
                        text-sm font-medium rounded-t-lg transition-colors"
                    >
                        <PlusCircle className="w-4 h-4" />
                    </button>
                </nav>
            </div>
            <div className="space-y-3">
                {filteredTransactions.map(transaction => (
                    <div
                        key={transaction.id}
                        className={`p-4 rounded-lg border transition-all transform hover:scale-[1.02]
                        ${transaction.type === 'income'
                                ? 'bg-green-50 border-green-100 hover:bg-green-100/50 dark:bg-green-500/5 dark:border-green-500/20 dark:hover:bg-green-500/10'
                                : 'bg-red-50 border-red-100 hover:bg-red-100/50 dark:bg-red-500/5 dark:border-red-500/20 dark:hover:bg-red-500/10'
                            }`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                                        {transaction.description}
                                    </p>
                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600
                                    dark:bg-gray-800 dark:text-gray-300">
                                        {allCategories.find(c => c.id === transaction.category)?.label || 'Belirtilmemiş'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
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
                            ${transaction.type === 'income'
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'}`}
                            >
                                <span>
                                    {transaction.type === 'income' ? '+' : '-'} ₺{transaction.amount.toLocaleString()}
                                </span>
                                <button
                                    onClick={() => handleDeleteTransaction(transaction.id as any)}
                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50
                                    dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10
                                    rounded-lg transition-colors"
                                    title="İşlemi sil"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredTransactions.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {t("budget.transactions.list.emptyMessage")}
                    </div>
                )}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-green-50 border-green-100 dark:bg-green-500/5 dark:border-green-500/20 
                p-4 rounded-lg border">
                    <h3 className="text-sm text-green-800 dark:text-green-300 font-medium">
                        {activeTab === 'all'
                            ? t("budget.transactions.list.categoryTotal.income")
                            : `${allCategories.find(c => c.id === activeTab)?.label} Gelir`}
                    </h3>
                    <p className="text-xl text-green-600 dark:text-green-400 font-bold">
                        ₺{getCategoryTotal(activeTab, 'income').amount.toLocaleString()}
                    </p>
                </div>
                <div className={`p-4 rounded-lg border ${getCategoryTotal(activeTab, 'expense').warning
                    ? 'bg-red-100 border-red-200 dark:bg-red-500/20 dark:border-red-500/30'
                    : 'bg-red-50 border-red-100 dark:bg-red-500/5 dark:border-red-500/20'
                    }`}>
                    <h3 className="text-sm text-red-800 dark:text-red-300 font-medium">
                        {activeTab === 'all'
                            ? t("budget.transactions.list.categoryTotal.expense")
                            : `${allCategories.find(c => c.id === activeTab)?.label} Gider`}
                    </h3>
                    <div className="flex items-center gap-2">
                        <p className="text-xl text-red-600 dark:text-red-400 font-bold">
                            ₺{getCategoryTotal(activeTab, 'expense').amount.toLocaleString()}
                        </p>
                        {getCategoryTotal(activeTab, 'expense').warning && (
                            <span className="text-xs bg-red-200 dark:bg-red-500/30 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">
                                %{getCategoryTotal(activeTab, 'expense').percentage.toFixed(1)} limit
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddCategory={handleAddCategory}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
            />
        </div>
    );
}