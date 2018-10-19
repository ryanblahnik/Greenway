import React, { Component } from 'react';
import axios from 'axios';

class AddLoan extends Component {
  constructor(props) {
    super(props);
    this.state= {
      name: '',
      minimumPayment: '',
      balance: '',
      dayBillDue: '',
      apr: '',
      autopay: false,
      website: '',
      userId: this.props.userId
    }
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
}

  onSubmitHandler (event) {
    axios.post('/api/loans', this.state)
    .then(results => {
      this.props.getLoans();
      this.setState({
        name: '',
        minimumPayment: '',
        balance: '',
        dayBillDue: '',
        apr: '',
        autopay: false,
        website: ''
      });
      this.props.cancelAddLoan();
    })
    .catch(err => console.log('Error onSubmitHandler. Line 35 Add-Loans.jsx', err));
    event.preventDefault();
}

  onChangeHandler(event) {
      this.setState({
          [event.target.name] : event.target.value
      });
  }

  render() {
    return (
      <div>
      <div className="add-comp">
      <form className="loan-form" onSubmit={this.onSubmitHandler}>
        <div className="add-record-header">Add account:</div>
        <div>
          <input className="loan-field" value={this.state.name} onChange={this.onChangeHandler} name="name" placeholder=" Card or loan name (e.g. American Express, Discover, etc)" type="text" required />
        </div>
        <div>
          <input className="loan-field" value={this.state.minimumPayment} onChange={this.onChangeHandler} name="minimumPayment" placeholder=" Minimum payment ($)" type="number" required />
        </div>
        <div>
          <input className="loan-field" value={this.state.balance} onChange={this.onChangeHandler} name="balance" placeholder=" Current balance on card or loan ($)" type="number" required />
        </div>
        <div>
          <select className="loan-field" name="dayBillDue" onChange={this.onChangeHandler} value={this.state.dayBillDue}required>
            <option value="">Select which day of the month your recurring payment is due</option>
            {
              Array.apply(null, Array(27)).map((_, i) => <option value={`${i + 1}`}>{i + 1}</option>)
            }
            <option value="last day of month">Last day of month</option>
          </select>
        </div>
        <div>
          Autopay <input checked={this.state.autopay} onChange={this.onChangeHandler} name="autopay" type="checkbox"/>
          <br/>
          (If this box is checked we will automatically deduct the minimum payment from your balance on the day the bill is due each month in order to accurately reflect your account's status)
        </div>
        <div>
          <input className="loan-field" value={this.state.apr} onChange={this.onChangeHandler} name="apr" placeholder=" Annual Percentage Rate on account" type="number" min="0.00" step="0.01" required />%
        </div>
        <div>
          <input className="loan-field" value={this.state.website} onChange={this.onChangeHandler} name="website" placeholder=" Account website to manage account or make payments" type="text"/>
        </div>
        <div>
          <input className="loan-btn" type="submit" value="Submit" />
        </div>
      </form>
      </div>
        <input className="loan-btn" style={{backgroundColor: 'red', marginLeft: '10px'}} type="submit" value="Cancel" onClick={this.props.cancelAddLoan} />
      </div>
    );
  }
}

export default AddLoan;
