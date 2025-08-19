import React, { Component } from 'react'
import { LuArrowRight } from 'react-icons/lu';
import moment from 'moment';
import TransactionInfoCard from '../cards/TransactionInfoCard';

class ExpenseTransactions extends Component {
    render() {
        const { transactions, onSeeMore } = this.props;
        const expenses = Array.isArray(transactions) ? transactions : transactions?.transactions || [];

        return (
            <div className='card'>
                <div className='flex items-center justify-between'>
                    <h5 className='text-lg'>Dépenses</h5>
                    <button onClick={onSeeMore} className='card-btn'>
                        Voir Plus
                        <LuArrowRight className='text-base' />
                    </button>
                </div>
                <div className='mt-6'>
                    {
                        expenses.slice(0, 5).map((expense) => (
                            <TransactionInfoCard
                                key={expense._id}
                                title={expense.category}
                                icon={expense.icon}
                                date={expense.date ? moment(expense.date).format("DD MMM YYYY") : ''}
                                amount={expense.amount}
                                type={expense.type}
                                hideDeleteBtn
                            />
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default ExpenseTransactions;
