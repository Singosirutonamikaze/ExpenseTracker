import React, { Component } from 'react'
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Line,
    ResponsiveContainer,
    LineChart,
    Area,
    AreaChart
} from 'recharts';

class CustomLineChart extends Component {
    constructor(props) {
        super(props);
    }

    CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className='bg-white rounded-lg shadow-md p-2 border border-gray-300'>
                    <p className='text-xs font-semibold text-purple-800 mb-1'>
                        {payload[0].payload.category || payload[0].payload.month}
                    </p>
                    <p className='text-sm text-gray-600'>
                        Montant : <span className='text-sm font-medium text-gray-900'>{payload[0].payload.amount}</span>
                    </p>
                </div>
            );
        }

        return null;

    };

    render() {

        return (
            <div className="w-full h-full bg-white rounded-xl shadow-lg p-4 flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={this.props.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} />
                        <Tooltip content={<this.CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 13, lineHeight: "24px", color: "#6366f1" }} />
                        <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#6366f1"
                            strokeWidth={3}
                            dot={{ r: 5, stroke: "#fff", strokeWidth: 2, fill: "#6366f1" }}
                            activeDot={{ r: 8, fill: "#a5b4fc" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )
    }
}

export default CustomLineChart;