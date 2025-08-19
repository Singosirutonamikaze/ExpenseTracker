import React, { Component } from 'react';
import { LuArrowRight, LuArrowLeft } from 'react-icons/lu';
import TransactionInfoCard from '../cards/TransactionInfoCard';
import moment from 'moment';

const PAGE_SIZE = 5;

class RecentTransactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0
        };
    }

    handleNext = () => {
        const { transactions } = this.props;
        const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
        if (this.state.page < totalPages - 1) {
            this.setState((prevState) => ({ page: prevState.page + 1 }));
        }
    };

    handlePrev = () => {
        if (this.state.page > 0) {
            this.setState((prevState) => ({ page: prevState.page - 1 }));
        }
    };

    render() {
        const { transactions = [], onSeeMore } = this.props;
        const { page } = this.state;
        const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
        const paginatedTransactions = transactions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

        return (
            <div className='card'>
                <div className='flex items-center justify-between p-4 border-b border-gray-100/50'>
                    <h4 className='text-lg font-semibold'>Transactions Récentes</h4>
                    <button onClick={onSeeMore} className='card-btn flex items-center gap-1 text-blue-600 hover:text-blue-800 transition'>
                        Voir Plus
                        <LuArrowRight className='text-base' />
                    </button>
                </div>
                <div className="flex flex-col">
                    <div className="flex-1">
                        {paginatedTransactions.map((transaction) => (
                            transaction && (
                                <TransactionInfoCard
                                    key={transaction._id}
                                    title={transaction.type === 'expense' ? transaction.category : transaction.source}
                                    icon={transaction.icon}
                                    date={transaction.date ? moment(transaction.date).format("DD MMM YYYY") : ''}
                                    amount={transaction.amount}
                                    type={transaction.type}
                                    hideDeleteBtn
                                />
                            )
                        ))}
                        {paginatedTransactions.length === 0 && (
                            <div className="p-4 text-gray-400 text-center">Aucune transaction à afficher.</div>
                        )}
                        <div className='flex flex-row justify-center items-center gap-2 px-2 mt-4'>
                            <button
                                className={`h-10 w-10 rounded-full bg-gray-200 hover:bg-blue-300 flex items-center justify-center transition ${page === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={this.handlePrev}
                                aria-label="Précédent"
                                disabled={page === 0}
                            >
                                <LuArrowLeft className="text-base" />
                            </button>
                            <button
                                className={`h-10 w-10 rounded-full bg-gray-200 hover:bg-blue-300 flex items-center justify-center transition ${page === totalPages - 1 || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={this.handleNext}
                                aria-label="Suivant"
                                disabled={page === totalPages - 1 || totalPages === 0}
                            >
                                <LuArrowRight className="text-base" />
                            </button>
                            <span className="text-xs text-gray-500 mt-2">{page + 1} / {totalPages || 1}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RecentTransactions;
