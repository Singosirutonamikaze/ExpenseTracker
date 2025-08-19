import React, { Component } from 'react'
import Input from '../inputs/Input';
import EmojiPickerPopup from '../models/EmojiPickerPopup';

class AddIncomeForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            source: '',
            amount: '',
            date: '',
            icon: ''
        };
    }

    handleChange = (key, value) => {
        this.setState({
            [key]: value
        });
    }

    render() {
        return (
            <div>

                <EmojiPickerPopup
                    onEmojiClick={(event, emojiObject) => this.handleChange('icon', emojiObject.emoji)}
                />

                <Input
                    value={this.state.source}
                    onChange={e => this.handleChange('source', e.target.value)}
                    label="Source"
                    placeholder="Free-Lance, Salarie etc"
                    type='text'
                />

                <Input
                    value={this.state.amount}
                    onChange={e => this.handleChange('amount', e.target.value)}
                    label='Montant'
                    placeholder=""
                    type='number'
                />

                <Input
                    value={this.state.date}
                    onChange={e => this.handleChange('date', e.target.value)}
                    label='Date'
                    placeholder="Date"
                    type='date'
                />

                <div className='flex justify-end mt-6'>
                    <button
                        type='button'
                        className='add-button add-btn-fill'
                        onClick={() => this.props.onAddIncome({
                            source: this.state.source,
                            amount: this.state.amount,
                            date: this.state.date,
                            icon: this.state.icon
                        })}
                    >
                        Ajouter un revenu
                    </button>
                </div>
            </div>
        )
    }
}

export default AddIncomeForm;
