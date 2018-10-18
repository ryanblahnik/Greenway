import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { fetchSavings, fetchMonthSavings, editSavings } from '../redux/actions/actions';

import moment from 'moment';
import { uniq, sortBy } from 'underscore';

import AddSaving from './AddSaving.jsx';
import SavingsChart from './SavingsChart.js';

class Savings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth : moment().format('YYYY-MM-01 00:00:00.000'),
      uniqueDates: [],
      remaining: 200
    }
    this.updateSavings = this.updateSavings.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getUniqueDates = this.getUniqueDates.bind(this);
  }

  getUniqueDates(array) {
    let allDates = array.map((expense) => {
      return expense.current_date.slice(0, 7);
    });
    let uniqueDates = uniq(allDates);
    let sortedDates = sortBy(uniqueDates);
    let dropdownDates = sortedDates.map((date) => {
      return moment(date).format('MMM YYYY');
    })
    this.setState({
      uniqueDates: dropdownDates
    });
  }

  componentDidMount() {
    const currentMonth = this.state.currentMonth;
    const nextMonth = moment(currentMonth).add(1, 'months').subtract(1, 'days').format('YYYY-MM-DD 23:59:59.999');
    this.props.fetchMonthSavings(this.props.userId, currentMonth, nextMonth);
    this.props.fetchSavings(this.props.userId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentMonth !== prevState.currentMonth) {
      const selectedMonth = moment(this.state.currentMonth).format('YYYY-MM-01 00:00:00.000');
      const followingSelectedMonth = moment(selectedMonth).add(1, 'months').subtract(1, 'days').format('YYYY-MM-DD 23:59:59.999');
      console.log('selectedMonth', selectedMonth , 'followingSelectedMonth', followingSelectedMonth);
      this.props.fetchMonthSavings(this.props.userId, selectedMonth, followingSelectedMonth);
    }
    if (this.props.savings.length > 0 && this.state.uniqueDates.length === 0) {
      this.getUniqueDates(this.props.savings);
    }
    if (prevProps.monthSavings !== this.props.monthSavings) {
      this.props.fetchSavings(this.props.userId);
    }
  }

  updateSavings(savingItem) {
    const cost = savingItem.cost - Number(this.state.editedItem);
    const editedItem = {
      userId: this.props.userId,
      item: savingItem.item,
      cost: cost,
      current_date: savingItem.current_date,
      end_date: savingItem.end_date,
      currentMonth: this.state.currentMonth,
      nextMonth: moment(this.state.currentMonth).add(1, 'months').subtract(1, 'days').format('YYYY-MM-DD 23:59:59.999')
    }
    console.log('editedItem yo', editedItem);
    this.props.editSavings(editedItem);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    return (
      <div>
        <div className="component-title">Savings</div>
        <select className="exp-month-select" name="currentMonth" onChange={this.onChange}>
          <option>Select a Month</option>
          {this.state.uniqueDates.map((date) => {
            return <option>{date}</option>
          })}
        </select>
        <h3 className="exp-month">{moment(this.state.currentMonth).format('MMMM YYYY')}</h3>
        <div className="savings-total">Total Remaining: {`$${this.state.remaining}`}< br/>
        < br/></div>
        <tr>
          <th className="gray savings-head">Goal</th>
          <th className="gray savings-head">Remaining</th>
          <th className="gray savings-head">Amount Saving ($)</th>
          {/* <th className="gray savings-head">Months Remaining</th> */}
          <th className="gray savings-head">Start Date</th>
          <th className="gray savings-head">End Date</th>
          <th className="gray savings-head"></th>
        </tr>
        {this.props.monthSavings.map(item => {
          return (
            <tr>
              <td className="savings-chart">{item.item}</td>
              <td className="savings-head">{`$${item.cost}`}</td>
              <td className="savings-chart gray">
                <form className="saving-amount">
                  <input type="number" name="editedItem" onChange={this.onChange} />
                </form>
              </td>
              {/* <td className="savings-chart savings-head gray">{Math.floor(item.cost / 150)}</td> */}
              <td className="savings-chart">{moment(item.start_date.slice(0, 10)).format('L')}</td>
              <td className="savings-chart">{moment(item.end_date.slice(0, 10)).format('L')}</td>
              <td className="savings-chart"><button class="savings-btn" type="submit" onClick={()=> {this.updateSavings(item)}}>Save!</button></td>
            </tr>
          )
        })}
        <div className="savings-bottom"></div>
        <AddSaving currentMonth={this.state.currentMonth}/>
        <SavingsChart />
      </div>
    )
  }
}

Savings.propTypes = {
  fetchMonthSavings: PropTypes.func.isRequired,
  savings: PropTypes.array.isRequired,
  fetchSavings: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    monthSavings: state.store.monthSavings,
    savings: state.store.savings,
    userId: state.store.userInfo.userId
  }
}

export default connect(mapStateToProps, { fetchSavings, fetchMonthSavings, editSavings })(Savings);