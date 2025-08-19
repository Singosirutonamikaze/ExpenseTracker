import React, { Component } from 'react';
import { prepareExpenseBarChartData } from '../../utils/helper';
import CustomBarChart from '../charts/CustomBarChart';

class Last30DaysExpenses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: []
        };
    }

    componentDidMount() {
        this.prepareChartData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.prepareChartData();
        }
    }

    prepareChartData() {
        const { data } = this.props;
        
        // Extraire les transactions si data est un objet { total, transactions }
        const transactionsData = data?.transactions || data || [];
        
        const result = prepareExpenseBarChartData(transactionsData);
        this.setState({ chartData: result });
    }

    render() {
        return (
            <div className='card col-md-6'>
                <div className='card-header'>
                    <h5 className='card-title'>Dépenses des 30 derniers jours</h5>
                </div>
                <div className='card-body'>
                    {this.state.chartData.length > 0 ? (
                        <CustomBarChart data={this.state.chartData} />
                    ) : (
                        <p>Aucune donnée disponible</p>
                    )}
                </div>
            </div>
        );
    }
}

export default Last30DaysExpenses;