import React, { Component } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

class CustomBarChart extends Component {
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
        const data = Array.isArray(this.props.data) ? this.props.data : [];
        const getBarColor = (index) => index % 2 === 0 ? '#875cf5' : '#cfbefb';
        const xAxisKey = data.length && data[0].category ? 'category' : 'month';

        return (
            <div className='bg-white mt-6'>
                {data.length === 0 ? (
                    <div className="p-4 text-gray-400 text-center">Aucune donnée à afficher.</div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid stroke='none' />
                            <XAxis
                                dataKey={xAxisKey}
                                tick={{ fontSize: 12, fill: "#555" }}
                                stroke='none'
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: "#555" }}
                                stroke='none'
                            />
                            <Tooltip content={this.CustomTooltip} />
                            <Bar
                                dataKey='amount'
                                radius={[10, 10, 0, 0]}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill ? entry.fill : getBarColor(index)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        );
    }
}


export default CustomBarChart;