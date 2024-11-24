"use client"
import { useState, useEffect } from 'react'
import { BudgetForm } from '../BudgetForm';
import { TransactionList } from '../TransactionList';
import { Transaction } from '@/types/generalType';
import { useTranslations } from "next-intl";
import SearchingAnimation from '../Searching';

const STORAGE_KEY = 'budget_transactions';

export function BudgetContainer() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isClient, setIsClient] = useState(false);
    const t = useTranslations();


    useEffect(() => {
        setIsClient(true)
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            try {
                setTransactions(JSON.parse(storedData));
            } catch (error) {
                console.error('Error loading from localStorage:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        }
    }, [transactions, isClient]);

    function handleAddTransaction(newTransaction: Transaction) {
        setTransactions(prev => [...prev, newTransaction]);
    }

    if (!isClient) {
        return <div className="min-h-screen bg-background pb-8">
            <SearchingAnimation />
        </div>;
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-8">
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        {t('budget.title')}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                        {t('budget.subtitle')}
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
                    <div className="col-span-1 lg:col-span-5 xl:col-span-4">
                        <div className="bg-card rounded-xl sm:rounded-2xl shadow-sm border border-border p-4 sm:p-6 lg:p-8 w-full">
                            <div className="mb-4 sm:mb-6">
                                <h2 className="text-base sm:text-lg font-semibold">
                                    {t('budget.newTransaction.title')}
                                </h2>
                                <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                                    {t('budget.newTransaction.subtitle')}
                                </p>
                            </div>
                            <BudgetForm onSubmit={handleAddTransaction} />
                        </div>
                    </div>
                    <div className="col-span-1 lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border p-4">
                                <div className="text-xs sm:text-sm font-medium text-muted-foreground">
                                    {t('budget.summary.totalIncome.label')}
                                </div>
                                <div className="mt-2">
                                    <span className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">
                                        {t('budget.summary.totalIncome.prefix')}
                                        {transactions
                                            .filter(t => t.type === 'income')
                                            .reduce((sum, t) => sum + t.amount, 0)
                                            .toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border p-4">
                                <div className="text-xs sm:text-sm font-medium text-muted-foreground">
                                    {t('budget.summary.totalExpense.label')}
                                </div>
                                <div className="mt-2">
                                    <span className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400">
                                        {t('budget.summary.totalExpense.prefix')}
                                        {transactions
                                            .filter(t => t.type === 'expense')
                                            .reduce((sum, t) => sum + t.amount, 0)
                                            .toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border p-4">
                                <div className="text-xs sm:text-sm font-medium text-muted-foreground">
                                    {t('budget.summary.netBalance.label')}
                                </div>
                                <div className="mt-2">
                                    <span className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {t('budget.summary.netBalance.prefix')}
                                        {(transactions
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
                        <div className="bg-card rounded-xl sm:rounded-2xl shadow-sm border border-border p-4 sm:p-6 lg:p-8">
                            <div className="mb-4 sm:mb-6">
                                <h2 className="text-base sm:text-lg font-semibold">
                                    {t('budget.transactions.title')}
                                </h2>
                                <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                                    {t('budget.transactions.subtitle')}
                                </p>
                            </div>
                            <TransactionList
                                transactions={transactions}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}