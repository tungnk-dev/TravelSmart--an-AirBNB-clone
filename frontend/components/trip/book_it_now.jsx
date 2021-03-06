import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { DateRangePicker } from 'react-dates';
import SessionFormContainer from '../session_form/session_form_container';

//We are going to store the inputs from this form into the 'inputs slice of state' so that we can
//keep these inputs for the next page and just draw our info from these inputs. Since
//book trip container subscribes to the inputs slice of state of the store, then it can use this
//information.

class BookItNow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: null, /// just for now... bookings not done yet
      endDate: null,
      num_guests: 1,
      maxGuests: Math.floor((Math.random() * 8) + 1)
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.navigateToBookTrip = this.navigateToBookTrip.bind(this);
    this.clearErrorsAndOpenSeshForm = this.clearErrorsAndOpenSeshForm.bind(this);
  };

  clearErrorsAndOpenSeshForm(){
    this.props.clearErrors();
    this.props.updateModal(<SessionFormContainer formType="signup" />, true);
  }

  handleSelectChange(property) {
    return e => this.setState({ [property]: e.target.value });
  };

  modalContent(){
    return (
      <div className="prompt-box">
        <div className="no-date-prompt">Please tell us when you want to check-in and check-out.</div>
      </div>
    )
  }

  navigateToBookTrip() {
    if (this.state.startDate && this.state.endDate) {
      const url = `/homes/${this.props.match.params.homeid}/book`;
      this.props.history.push(url);
    } else {
      this.props.updateModal(this.modalContent(), true);
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    //we duplicate the state so that if it gets changed ever, the state remains the same
    //over here. Always dup the state and don't ever mutate it unless you want to re-render.
    const input = Object.assign({}, this.state);
		if (Object.keys(this.props.currentUser).length !== 0 ) {
      this.props.receiveInput(input); // after this, move to next screen
      this.navigateToBookTrip();
    } else {
      this.clearErrorsAndOpenSeshForm();
    }
  };

  pricePerNight(){
    let nightly = Math.floor(this.props.listing.price/30);
    return (
      <div className="offers-box">
        <div className="thunderbolt"/>
        <div className="book-it-price">${nightly}</div>
        <div className="per-night">per night</div>
      </div>
    )
  };

//according to your currentUser, it is originally an empty object, so you should just check if the keys of this user are none or not.

  // renderErrors() {
  //   if (!this.props.currentUser) {
  //     return (<li><h2>Not Logged In</h2></li>);
  //   } else if (this.props.errors) {
  //     return (this.props.errors.map((err, idx) => {
  //       return (<li key={idx}>{ err }</li>);
  //     }));
  //   }
  // }

  //You need to make a max_guests for home for this to work properly!
  bookingForm() {
    const options = [
      <option value="1" key={1}>1 guest</option>
    ];
    for (let i = 2; i <= this.state.maxGuests; i++) {

      options.push(
        <option value={i} key={i}>{i} guests</option>
      );
    }

    return (
      <div>
        <form className="row-condensed">
          <div>
            <div className="guest-header">
              <div className="guest-check">Check In</div>
              <div className="guest-check">Check Out</div>
            </div>
          <div className="date-range-calendar" placeholder='mm/dd/yyyy'>
            <DateRangePicker
              startDate={ this.state.startDate }
              endDate={ this.state.endDate }
              onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })}
              focusedInput={ this.state.focusedInput }
              onFocusChange={ focusedInput => this.setState({ focusedInput }) }
              />
          </div>

          </div>
        <div className="guest-dd-container">
            <div className='select-container'>
              <label className="guest-check">Guests</label>
                <div className='select-dd-container'>
                  <select className='select-dropdown guests' value={this.state.num_guests}
                      onChange={this.handleSelectChange('num_guests')}>{options}
                  </select>
                    <span className="dropdown-arrow"></span>
                  </div>
                </div>

          </div>

          <button onClick={this.handleSubmit}
            className="pinkButton book-btn">
            <span className="btn-text">Book</span>
          </button>

          <div className='margin-top-8px'>
            <span className="disclaimer book-disc">Don't Worry, You won't be charged yet</span>
          </div>
        </form>

      </div>
    )
  };

  render() {
    return (
      <div className="book-body">
        <div className="book-it">
          <div className="bookItContainer">
            {this.pricePerNight()}
            {this.bookingForm()}
          </div>
        </div>
      </div>
    )
  };

}

export default withRouter(BookItNow);
