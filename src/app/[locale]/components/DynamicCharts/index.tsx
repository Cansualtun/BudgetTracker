import React from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ScatterChart,
    Scatter
} from 'recharts';

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
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₺${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="gelir" fill="#22c55e" name="Gelir" />
                <Bar dataKey="gider" fill="#ef4444" name="Gider" />
                <Bar dataKey="net" fill="#3b82f6" name="Net Bakiye" />
            </BarChart>
        </ResponsiveContainer>
    );
};

const LineChartComponent = ({ data }: ChartProps) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₺${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="gelir" stroke="#22c55e" name="Gelir" />
                <Line type="monotone" dataKey="gider" stroke="#ef4444" name="Gider" />
                <Line type="monotone" dataKey="net" stroke="#3b82f6" name="Net Bakiye" />
            </LineChart>
        </ResponsiveContainer>
    );
};

const ScatterChartComponent = ({ data }: ChartProps) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
                <XAxis type="number" dataKey="gelir" name="Gelir" unit="TL" />
                <YAxis type="number" dataKey="gider" name="Gider" unit="TL" />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter data={data} fill="#8884d8" />
            </ScatterChart>
        </ResponsiveContainer>
    );
};
export { BarChartComponent, LineChartComponent, ScatterChartComponent };