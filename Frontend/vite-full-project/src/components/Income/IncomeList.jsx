import React, { Component } from 'react'
import { LuDownload } from 'react-icons/lu';
import TransactionInfoCard from '../cards/TransactionInfoCard';
import moment from 'moment';


class IncomeList extends Component {
    render() {
        const { data = [], onDeleteIncome, onDownloadIncome } = this.props;
        return (
            <div className='card'>
                <div className='flex items-center justify-between p-4 border-b border-gray-100/50'>
                    <h4 className='text-lg font-semibold'>Listes des revenus</h4>
                    <button onClick={onDownloadIncome} className='card-btn  w-40 h-10 flex justify-around p-4 items-center gap-1 text-blue-600 hover:text-blue-800 transition'>
                        <span className='font-bold'>Télécharger</span>
                        <LuDownload className='text-base' />
                    </button>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2'>
                    {data.length === 0 ? (
                        <p className='text-gray-500'>Aucun revenu trouvé.</p>
                    ) : (
                        data.slice(0, 10).map((income) => (
                            <div className='mt-6' key={income._id}>
                                <TransactionInfoCard
                                    title={income.category}
                                    icon={income.icon}
                                    date={income.date ? moment(income.date).format("DD MMM YYYY") : ''}
                                    amount={income.amount}
                                    type='income'
                                    onDelete={() => onDeleteIncome(income._id)}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        )
    }
}

export default IncomeList;
