import React, { Component, useState } from 'react'
import { useEffect } from 'react';
import CustomPieChart from '../charts/CustomPieChart';


function RecentIncomeWithCharts({ data, totalIncome }) {
    const COLORS = ['#875CF5', '#FA2C37', '#FF6900'];
    const [chartData, setChartData] = useState([]);

    const prepareChartData = (data) => {
        const preparedData = data.map((item, index) => ({
            ...item,
            color: COLORS[index % COLORS.length],
        }));
        setChartData(preparedData);
    };

    useEffect(() => {
        prepareChartData(data);

        return () => {};
    }, [data]);

    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>Révenues des 60 derniers jours</h5>
            </div>
            <CustomPieChart
                data={chartData}
                label='Revenus Totaux'
                totalAmount={`${totalIncome} Frcfa`}
                colors={COLORS}
                showTextAnchor
            />
        </div>
    );
}

export default RecentIncomeWithCharts