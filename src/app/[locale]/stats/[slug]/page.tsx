"use client"
import { useEffect, useState } from 'react';
import { Transaction } from "@/types/generalType";
import { BarChartComponent, LineChartComponent } from '../../components/DynamicCharts';

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
                <div className="text-center py-8 text-gray-500">
                    Kategori bulunamadı
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                    {viewType === 'monthly' ? 'Aylık' : 'Yıllık'} Gelir/Gider Grafiği
                </h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setViewType('monthly')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${viewType === 'monthly'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Aylık
                    </button>
                    <button
                        onClick={() => setViewType('yearly')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${viewType === 'yearly'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Yıllık
                    </button>
                </div>
            </div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">{categoryName} İstatistikleri</h1>
                <p className="text-sm text-gray-600">
                    Bu kategorideki toplam işlem sayısı: {categoryTransactions.length}
                </p>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold">Line Chart</h2>
                <LineChartComponent data={chartData} />
            </div>
            <div className="mt-8">
                <div className="w-full h-[400px] bg-white p-4 rounded-xl border">
                    <BarChartComponent data={chartData} />
                </div>
            </div>
        </div>
    );
};

export default DynamicStats;