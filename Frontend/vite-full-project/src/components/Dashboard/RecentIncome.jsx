import React, { Component } from 'react';
import { LuArrowRight } from 'react-icons/lu';
import TransactionInfoCard from '../cards/TransactionInfoCard';
import moment from 'moment';

class RecentIncome extends Component {
    render() {
        const { data = [], onSeeMore } = this.props;
        return (
            <div className='card'>
                <div className='flex items-center justify-between p-4 border-b border-gray-100/50'>
                    <h4 className='text-lg font-semibold'>Revenues Récentes</h4>
                    <button onClick={onSeeMore} className='card-btn flex items-center gap-1 text-blue-600 hover:text-blue-800 transition'>
                        Voir Plus
                        <LuArrowRight className='text-base' />
                    </button>
                </div>
                <div className='mt-6'>
                    {
                        data.slice(0, 5).map((income) => (
                            <TransactionInfoCard
                                key={income._id}
                                title={income.category}
                                icon={income.icon}
                                date={income.date ? moment(income.date).format("DD MMM YYYY") : ''}
                                amount={income.amount}
                                type='income'
                                hideDeleteBtn
                            />
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default RecentIncome;
