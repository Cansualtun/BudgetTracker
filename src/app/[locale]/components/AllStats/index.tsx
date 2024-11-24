"use client"
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/hooks/useAppDispatch';
import Loading from '../Searching';
import LineChartComponent from '../Charts/LineChart';
import BarChartComponent from '../Charts/BarChart';
import { ArrowDown, ArrowUp, FileSpreadsheet, Minus } from 'lucide-react';
import { exportToExcel } from '@/helpers/excelExport';

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
    const handleExportExcel = () => {
        exportToExcel(categoryDetails, 'butce_raporu');
    };
    return (
        <div className="max-w-[1200px] mx-auto p-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {viewType === 'monthly' ? t("budget.stats.monthly") : t("budget.stats.yearly")} {t("budget.stats.chartName")}
                </h2>

                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg 
                            bg-emerald-100 hover:bg-emerald-200 text-emerald-700 
                            dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 
                            dark:text-emerald-400 text-sm font-medium transition-colors"
                        title="Excel olarak indir"
                    >
                        <FileSpreadsheet size={16} />
                        <span className="hidden sm:inline">{t("budget.excel.downloadExcel")}</span>
                    </button>
                    <button
                        onClick={() => setViewType('monthly')}
                        className={`px-2 py-1.5 rounded text-xs font-medium flex-1 sm:flex-none sm:px-4 sm:py-2 sm:text-sm
                            ${viewType === 'monthly'
                                ? 'bg-blue-500 text-white dark:bg-blue-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                    >
                        {t("budget.stats.monthly")}
                    </button>
                    <button
                        onClick={() => setViewType('yearly')}
                        className={`px-2 py-1.5 rounded text-xs font-medium flex-1 sm:flex-none sm:px-4 sm:py-2 sm:text-sm
                            ${viewType === 'yearly'
                                ? 'bg-blue-500 text-white dark:bg-blue-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                    >
                        {t("budget.stats.yearly")}
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4 mb-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900/30">
                    <h3 className="text-xs sm:text-sm font-medium text-green-800 dark:text-green-300">
                        {t("budget.summary.totalIncome.label")}
                    </h3>
                    <p className="mt-1 text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                        ₺{transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                    </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                    <h3 className="text-xs sm:text-sm font-medium text-red-800 dark:text-red-300">
                        {t("budget.summary.totalExpense.label")}
                    </h3>
                    <p className="mt-1 text-lg sm:text-xl font-bold text-red-600 dark:text-red-400">
                        ₺{transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                    </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                    <h3 className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300">
                        {t("budget.summary.netBalance.label")}
                    </h3>
                    <p className="mt-1 text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                        ₺{(transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) -
                            transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        {t("budget.stats.lineChart")}
                    </h2>
                    <div className="w-full h-[200px] sm:h-[300px]">
                        <LineChartComponent data={chartData} />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
                    <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        {t("budget.stats.barChart")}
                    </h2>
                    <div className="w-full h-[200px] sm:h-[300px]">
                        <BarChartComponent data={categoryTotals} />
                    </div>
                </div>
            </div>

            {/* Category Details Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
                <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                    {t("budget.categoryStats.title")}
                </h2>
                <div className="overflow-x-auto -mx-3">
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr className="text-xs sm:text-sm">
                                    <th scope="col" className="px-2 py-2 sm:px-3 sm:py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                                        {t("budget.categoryStats.headers.category")}
                                    </th>
                                    <th scope="col" className="px-2 py-2 sm:px-3 sm:py-3 text-right font-medium text-gray-500 dark:text-gray-400">
                                        {t("budget.categoryStats.headers.transactionCount")}
                                    </th>
                                    <th scope="col" className="px-2 py-2 sm:px-3 sm:py-3 text-right font-medium text-green-500">
                                        {t("budget.categoryStats.headers.income")}
                                    </th>
                                    <th scope="col" className="px-2 py-2 sm:px-3 sm:py-3 text-right font-medium text-red-500">
                                        {t("budget.categoryStats.headers.expense")}
                                    </th>
                                    <th scope="col" className="px-2 py-2 sm:px-3 sm:py-3 text-right font-medium text-blue-500">
                                        {t("budget.categoryStats.headers.net")}
                                    </th>
                                    <th scope="col" className="hidden sm:table-cell px-3 py-3 text-right font-medium text-gray-500">
                                        {t("budget.categoryStats.headers.averageTransaction")}
                                    </th>
                                    <th scope="col" className="hidden sm:table-cell px-3 py-3 text-right font-medium text-gray-500">
                                        {t("budget.categoryStats.headers.limitUsage")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {categoryDetails.map((detail) => (
                                    <tr key={detail.id} className="text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-2 py-2 sm:px-3 sm:py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-1 sm:gap-2">
                                                {detail.net > 0 ? (
                                                    <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                                                ) : detail.net < 0 ? (
                                                    <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                                                ) : (
                                                    <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                                                )}
                                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                                    {detail.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-2 py-2 sm:px-3 sm:py-3 text-right text-gray-600 dark:text-gray-300">
                                            {detail.transactionCount}
                                        </td>
                                        <td className="px-2 py-2 sm:px-3 sm:py-3 text-right text-green-600">
                                            {detail.income > 0 && '₺'}{detail.income.toLocaleString()}
                                        </td>
                                        <td className="px-2 py-2 sm:px-3 sm:py-3 text-right text-red-600">
                                            {detail.expense > 0 && '₺'}{detail.expense.toLocaleString()}
                                        </td>
                                        <td className={`px-2 py-2 sm:px-3 sm:py-3 text-right font-medium ${detail.net > 0 ? 'text-green-600' : detail.net < 0 ? 'text-red-600' : 'text-gray-600'
                                            }`}>
                                            {detail.net > 0 && '+'}{detail.net.toLocaleString()}
                                        </td>
                                        <td className="hidden sm:table-cell px-3 py-3 text-right text-gray-600">
                                            ₺{detail.avgTransaction.toLocaleString()}
                                        </td>
                                        <td className="hidden sm:table-cell px-3 py-3 text-right">
                                            {detail.limitUsage !== null ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                                                        <div
                                                            className={`h-full rounded-full ${detail.limitUsage >= 80 ? 'bg-red-500' :
                                                                detail.limitUsage >= 50 ? 'bg-yellow-500' :
                                                                    'bg-green-500'
                                                                }`}
                                                            style={{ width: `${Math.min(detail.limitUsage, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-gray-600 dark:text-gray-300">
                                                        {detail.limitUsage.toFixed(0)}%
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}