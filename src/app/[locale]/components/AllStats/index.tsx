"use client"
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/hooks/useAppDispatch';
import Loading from '../Searching';
import LineChartComponent from '../Charts/LineChart';
import BarChartComponent from '../Charts/BarChart';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface ChartData {
    name: string;
    gelir: number;
    gider: number;
    net: number;
}

type ViewType = 'monthly' | 'yearly';

export default function AllStats() {
    const [mounted, setMounted] = useState(false);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [viewType, setViewType] = useState<ViewType>('monthly');
    const t = useTranslations();
    const categories = useAppSelector(state => state.categories.categories);
    const transactions = useAppSelector(state => state.transactions.transactions);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Yardımcı fonksiyonlar
    const formatMoney = (amount: number) => {
        if (!mounted) return "0";
        return amount.toLocaleString('tr-TR');
    };

    const formatDate = (date: Date, type: ViewType) => {
        if (!mounted) return "";
        if (type === 'yearly') return date.getFullYear().toString();
        return date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    };

    const categoryTotals = useMemo(() => {
        if (!mounted) return [];
        return categories.map(category => {
            const categoryTransactions = transactions.filter(t => t.category === category.id);
            const income = categoryTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            const expense = categoryTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                name: category.label,
                gelir: income,
                gider: expense,
                net: income - expense
            };
        });
    }, [categories, transactions, mounted]);

    const categoryDetails = useMemo(() => {
        if (!mounted) return [];
        return categories.map(category => {
            const categoryTransactions = transactions.filter(t => t.category === category.id);
            const income = categoryTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            const expense = categoryTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            const net = income - expense;
            const transactionCount = categoryTransactions.length;
            const avgTransaction = transactionCount > 0 ? (income + expense) / transactionCount : 0;

            return {
                id: category.id,
                name: category.label,
                income,
                expense,
                net,
                transactionCount,
                avgTransaction,
                limitUsage: category.limit ? (expense / category.limit) * 100 : null
            };
        }).sort((a, b) => b.transactionCount - a.transactionCount);
    }, [categories, transactions, mounted]);

    useEffect(() => {
        if (!mounted) return;

        const generateChartData = () => {
            const groupData: { [key: string]: ChartData } = {};

            transactions.forEach((transaction) => {
                const date = new Date(transaction.date);
                const groupKey = formatDate(date, viewType);

                if (!groupData[groupKey]) {
                    groupData[groupKey] = {
                        name: groupKey,
                        gelir: 0,
                        gider: 0,
                        net: 0
                    };
                }

                if (transaction.type === 'income') {
                    groupData[groupKey].gelir += transaction.amount;
                    groupData[groupKey].net += transaction.amount;
                } else {
                    groupData[groupKey].gider += transaction.amount;
                    groupData[groupKey].net -= transaction.amount;
                }
            });

            const chartDataArray = Object.values(groupData);
            if (viewType === 'yearly') {
                chartDataArray.sort((a, b) => parseInt(a.name) - parseInt(b.name));
            } else {
                chartDataArray.sort((a, b) => {
                    const [monthA, yearA] = a.name.split(' ');
                    const [monthB, yearB] = b.name.split(' ');
                    return new Date(`${yearA}-${monthA}-01`).getTime() - new Date(`${yearB}-${monthB}-01`).getTime();
                });
            }

            setChartData(chartDataArray);
        };

        generateChartData();
    }, [transactions, viewType, mounted]);

    if (!mounted || !transactions || !categories) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Loading />
            </div>
        );
    }

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpense;
    return (
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 order-2 sm:order-1">
                    {viewType === 'monthly' ? t("budget.stats.monthly") : t("budget.stats.yearly")} {t("budget.stats.chartName")}
                </h2>
                <div className="flex space-x-2 w-full sm:w-auto order-1 sm:order-2 overflow-x-auto">
                    <button
                        onClick={() => setViewType('monthly')}
                        className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none whitespace-nowrap
                            ${viewType === 'monthly'
                                ? 'bg-blue-500 text-white dark:bg-blue-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                    >
                        {t("budget.stats.monthly")}
                    </button>
                    <button
                        onClick={() => setViewType('yearly')}
                        className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none whitespace-nowrap
                            ${viewType === 'yearly'
                                ? 'bg-blue-500 text-white dark:bg-blue-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                    >
                        {t("budget.stats.yearly")}
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-900/30">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                        {t("budget.summary.totalIncome.label")}
                    </h3>
                    <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                        ₺{transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                    </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900/30">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                        {t("budget.summary.totalExpense.label")}
                    </h3>
                    <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
                        ₺{transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                    </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        {t("budget.summary.netBalance.label")}
                    </h3>
                    <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ₺{(transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) -
                            transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100 px-1">
                        {t("budget.stats.lineChart")}
                    </h2>
                    <div className="w-full h-[300px] sm:h-[400px] -mx-2 sm:mx-0">
                        <LineChartComponent data={chartData} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100 px-1">
                        {t("budget.stats.barChart")}
                    </h2>
                    <div className="w-full h-[300px] sm:h-[400px] -mx-2 sm:mx-0">
                        <BarChartComponent data={categoryTotals} />
                    </div>
                </div>
            </div>
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Kategori Bazlı Detaylar
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Kategori</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">İşlem Sayısı</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-green-500 dark:text-green-400">Gelir</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-red-500 dark:text-red-400">Gider</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-blue-500 dark:text-blue-400">Net</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Ortalama İşlem</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Limit Kullanımı</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoryDetails.map((detail) => (
                                <tr
                                    key={detail.id}
                                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            {detail.net > 0 ? (
                                                <ArrowUp className="w-4 h-4 text-green-500" />
                                            ) : detail.net < 0 ? (
                                                <ArrowDown className="w-4 h-4 text-red-500" />
                                            ) : (
                                                <Minus className="w-4 h-4 text-gray-500" />
                                            )}
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {detail.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="text-right py-3 px-4 text-gray-600 dark:text-gray-300">
                                        {detail.transactionCount}
                                    </td>
                                    <td className="text-right py-3 px-4 text-green-600 dark:text-green-400">
                                        {detail.income > 0 && '₺'}{detail.income.toLocaleString()}
                                    </td>
                                    <td className="text-right py-3 px-4 text-red-600 dark:text-red-400">
                                        {detail.expense > 0 && '₺'}{detail.expense.toLocaleString()}
                                    </td>
                                    <td className={`text-right py-3 px-4 font-medium ${detail.net > 0
                                        ? 'text-green-600 dark:text-green-400'
                                        : detail.net < 0
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {detail.net > 0 && '+'}₺{detail.net.toLocaleString()}
                                    </td>
                                    <td className="text-right py-3 px-4 text-gray-600 dark:text-gray-300">
                                        ₺{detail.avgTransaction.toLocaleString()}
                                    </td>
                                    <td className="text-right py-3 px-4">
                                        {detail.limitUsage !== null ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="w-20 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${detail.limitUsage >= 80 ? 'bg-red-500'
                                                            : detail.limitUsage >= 50 ? 'bg-yellow-500'
                                                                : 'bg-green-500'
                                                            }`}
                                                        style={{ width: `${Math.min(detail.limitUsage, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    {detail.limitUsage.toFixed(0)}%
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 dark:text-gray-500">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}