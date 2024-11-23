import { useTranslations } from "next-intl";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ChartData {
    name: string;
    gelir: number;
    gider: number;
    net: number;
}

interface ChartProps {
    data: ChartData[];
}
const LineChartComponent = ({ data }: ChartProps) => {
    const t = useTranslations();
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₺${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="gelir" stroke="#22c55e" name={t("budget.income")} />
                <Line type="monotone" dataKey="gider" stroke="#ef4444" name={t("budget.expense")} />
                <Line type="monotone" dataKey="net" stroke="#3b82f6" name={t("budget.net")} />
            </LineChart>
        </ResponsiveContainer>
    );
};
export default LineChartComponent