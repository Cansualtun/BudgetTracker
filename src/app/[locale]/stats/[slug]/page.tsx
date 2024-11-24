"use client"
import { useEffect, useState } from 'react';
import { Transaction } from "@/types/generalType";
import LineChartComponent from '../../components/Charts/LineChart';
import BarChartComponent from '../../components/Charts/BarChart';
import { useTranslations } from 'next-intl';
import SearchingAnimation from '../../components/Searching';

interface CategoryType {
    id: string;
    label: string;
}

interface ChartData {
    name: string;
    gelir: number;
    gider: number;
    net: number;
}

type ViewType = 'monthly' | 'yearly';

const DynamicStats = ({ params }: { params: { slug: string } }) => {
    const [categoryName, setCategoryName] = useState<string>('');
    const [categoryTransactions, setCategoryTransactions] = useState<Transaction[]>([]);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [viewType, setViewType] = useState<ViewType>('monthly');
    const categoryId = params.slug as string;

    const t = useTranslations();
    useEffect(() => {
        const fetchCategoryInfo = () => {
            const storedCategories = localStorage.getItem('budget_categories');
            if (storedCategories) {
                const categories: CategoryType[] = JSON.parse(storedCategories);
                const category = categories.find(cat => cat.id === categoryId);
                if (category) {
                    setCategoryName(category.label);
                }
            }
        };

        const fetchTransactionData = () => {
            const storedTransactions = localStorage.getItem('budget_transactions');
            if (storedTransactions) {
                const transactions: Transaction[] = JSON.parse(storedTransactions);
                const filteredTransactions = transactions.filter(t => t.category === categoryId);
                setCategoryTransactions(filteredTransactions);
                generateChartData(filteredTransactions);
            }
        };

        const generateChartData = (transactions: Transaction[]) => {
            const groupData: { [key: string]: ChartData } = {};

            transactions.forEach((transaction) => {
                const date = new Date(transaction.date);
                const groupKey = viewType === 'monthly'
                    ? date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
                    : date.getFullYear().toString();

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
            chartDataArray.sort((a, b) => {
                if (viewType === 'yearly') {
                    return parseInt(a.name) - parseInt(b.name);
                }
                return new Date(a.name).getTime() - new Date(b.name).getTime();
            });

            setChartData(chartDataArray);
        };

        fetchCategoryInfo();
        fetchTransactionData();
    }, [categoryId, viewType]);

    if (!categoryName) {
        return (
            <div className="container mx-auto px-4 py-8">
                <SearchingAnimation />
            </div>
        );
    }

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
            <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {categoryName} {t("budget.stats.stats")}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {t("budget.stats.totalTransactions")} {categoryTransactions.length}
                </p>
            </div>
            <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
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
                        <BarChartComponent data={chartData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamicStats;