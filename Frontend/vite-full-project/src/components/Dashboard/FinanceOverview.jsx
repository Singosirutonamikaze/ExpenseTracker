import React, { Component } from 'react'
import CustomPieChart from '../charts/CustomPieChart';

const COLORS = ['#875CF5', '#FA2C37', '#FF6900'];

class FinanceOverview extends Component {
    render() {
        const { totalIncome, totalExpense, totalBalance } = this.props;

        const balanceData = [
            { name: 'Balance Totale', amount: totalBalance },
            { name: 'Dépenses Totales', amount: totalExpense },
            { name: 'Revenus Totaux', amount: totalIncome }
        ];

        return (
            <div className='card'>
                <div className='flex items-center justify-between'>
                   <h5 className='text-lg font-bold'>Vue des Finances</h5>
                </div>
                <CustomPieChart 
                    data={balanceData}
                    label='Balance Totale'
                    totalAmount={`${totalBalance} Frcfa`}
                    colors={COLORS}
                    showTextAnchor
                />
            </div>
        );
    }
}

export default FinanceOverview;
