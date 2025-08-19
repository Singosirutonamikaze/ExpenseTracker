import React, { Component, useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu';
import CustomBarChart from '../charts/CustomBarChart';
import { prepareIncomeBarChartData } from '../../utils/helper';

function IncomeOverview({ data, onAddIncome }) {
    const [chartData, setChartData] = useState(data || []);

    useEffect(() => {
        const result = prepareIncomeBarChartData(data);

        setChartData(result);

        return () => {};
    }, [data]);

    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <div className='text-lg font-semibold text-gray-800'>
                    <h5 className='text-lg'>Aperçu des revenus</h5>
                    <p className='text-xs text-gray-400 mt-0.5'>
                        Suivez vos gains au fil du temps et analysez les tendances de vos revenus.
                    </p>
                </div>
                <button
                    onClick={onAddIncome}
                    className='add-button'
                >
                    <LuPlus className='mr-2 text-lg' /> Ajouter un revenu
                </button>
            </div>

            <div className='mt-10'>
                <CustomBarChart data={chartData} />
            </div>
        </div>
    );
}

export default IncomeOverview;
