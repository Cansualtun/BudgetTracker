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
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 5,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    opacity={0.1}
                />
                <XAxis
                    dataKey="name"
                    stroke="currentColor"
                    opacity={0.7}
                    tick={{ fill: 'currentColor', opacity: 0.7, fontSize: '0.75rem' }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval="preserveStartEnd"
                />
                <YAxis
                    stroke="currentColor"
                    opacity={0.7}
                    tick={{ fill: 'currentColor', opacity: 0.7, fontSize: '0.75rem' }}
                    width={45}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--tooltip-bg, #fff)',
                        border: '1px solid var(--tooltip-border, #ccc)',
                        borderRadius: '0.5rem',
                        color: 'var(--tooltip-text, #000)',
                        fontSize: '0.75rem',
                        padding: '0.5rem'
                    }}
                />
                <Legend
                    wrapperStyle={{
                        color: 'currentColor',
                        opacity: 0.7,
                        fontSize: '0.75rem',
                        padding: '0.5rem 0'
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="gelir"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: '#22c55e', r: 4 }}
                />
                <Line
                    type="monotone"
                    dataKey="gider"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', r: 4 }}
                />
                <Line
                    type="monotone"
                    dataKey="net"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default LineChartComponent