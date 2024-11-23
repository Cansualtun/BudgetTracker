import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ChartData {
    name: string;
    gelir: number;
    gider: number;
    net: number;
}

interface ChartProps {
    data: ChartData[];
}

const BarChartComponent = ({ data }: ChartProps) => {
    const t = useTranslations();
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₺${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey={t("budget.income")} fill="#22c55e" name={t("budget.income")} />
                <Bar dataKey={t("budget.expense")} fill="#ef4444" name={t("budget.expense")} />
                <Bar dataKey="net" fill="#3b82f6" name={t("budget.net")} />
            </BarChart>
        </ResponsiveContainer>
    );
};
export default BarChartComponent