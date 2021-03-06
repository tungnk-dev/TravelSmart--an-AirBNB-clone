import React from 'react';
import { withRouter } from 'react-router-dom';
//Take care of the bug where you refresh on this page and it gives you an error
class BookTrip extends React.Component {
  constructor(props) {
    super(props);
    // if ( !this.props.listing )
    // {
    //   this.props.history.push("/");
    // }
    const end = this.props.inputs.endDate; //calculates the difference between days
    const beg = this.props.inputs.startDate;
    this.nightly = Math.floor(this.props.listing.price/30);
    this.maxGuests = this.props.inputs.maxGuests;
    this.days = (end.diff(beg,"days"));
    this.cost = this.nightly * this.days;
    this.cleaning = 40;
    this.service = 55;
    this.totalcost = this.cost + this.cleaning + this.service;
    this.utcBeg = beg.format('MMM D, YYYY'); // makes days read like english
    this.utcEnd = end.format('MMM D, YYYY');
    this.state = {
      num_guests: this.props.inputs.num_guests,
      totalcost: this.totalcost
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  componentDidMount() {
    if (this.props.loggedIn && this.props.inputs) {

      this.props.requestHome(this.props.homeid);
    } else {
      return (<div className="loading">You are not logged in</div>)
    }
  };

  componentDidUpdate() {
    if (!this.props.loggedIn) {
      this.props.history.push("/");
    }
  }

  //this.state.num_guests is originally a string I believe

  handleSubmit(e) {
    e.preventDefault();
    const trip = {
      home_id: this.props.homeid,
      start_date: this.props.inputs.startDate.toDate(),
      end_date: this.props.inputs.endDate.toDate(),
      totalcost: this.state.totalcost
    }
		this.props.createTrip({trip}).then(this.props.history.push(`/user/${this.props.currentUser.id}/trips`));
  };

  handleSelectChange(property) {
    return e => this.setState({ [property]: e.target.value });
  };

  selectGuests() {
    const options = [
      <option value="1" key={1}>1 guest</option>
    ];
    for (let i = 2; i <= this.maxGuests; i++) {
      options.push(
        <option value={i}
        key={i}
        >{i} guests</option>
      )
    };

    return (
      <div className="book-column">
        <div className='select-container book-txt'>
          <label className="book-label"/>Who's coming?
          <div className='select-dd-container book-dd'>
            <select className='select-dropdown select-bk-dd' value={this.state.num_guests}
              onChange={this.handleSelectChange('num_guests')}
            >{options}</select>
            <span className="dropdown-arrow"></span>
          </div>
        </div>
      </div>
    );
  }

  bookingRightPanel() {
    const {inputs, listing} = this.props;
    //Test this out. I think that when you get host back from jbuilder, it is automatically an array
    return (
      <section className="bk-right-panel">
        <div className="bk-pic-container">
          <img className="bk-pic" src={listing.image_url}/>
        </div>
        <div className="panel-body">
          <div className="bk-host">Hosted by {listing.host.first}</div>
          <div className="bk-title">{listing.title}</div>
          <div className="bk-desc">{listing.roomtype}</div>
          <div className="bk-desc">{listing.address}</div>
        </div>
        <div className="book-div"/>
        <div className="panel-body check-col calendar-position">
          <div className="cal-col">
            <div className="check-col">Check-in</div>
            <div className="bk-checkin">{this.utcBeg}</div>
          </div>
          <div className="cal-col">
            <div className="check-col">Checkout</div>
            <div className="bk-checkin">{this.utcEnd}</div>
          </div>
        </div>
        <div className="book-div"/>
        <div className="panel-body">
          <div className="bk-price-row">
            <div className="price-calc">${this.nightly} x {this.days} nights</div>
            <div className="tot-price">${this.cost}</div>
          </div>
          <div className="bk-price-row">
            <div className="price-calc">Cleaning fee</div>
            <div className="tot-price">${this.cleaning}</div>
          </div>
          <div className="bk-price-row">
            <div className="price-calc">Service fee</div>
            <div className="tot-price">${this.service}</div>
          </div>

        </div>
        <div className="book-div"/>
        <div className="panel-body">
          <div className="total-txt">Total</div>
          <div className="total-txt">${this.totalcost}</div>
        </div>
      </section>
    )
  }

  render() {
    //or we can do querystring.... regardless this has to be in preloadedState...

    //local storage - not stored in route or database; preloadedState...

    //Do this because we don't have a listing yet and then we render when we do have a listing.
    if (this.props.listing === undefined) {

      return (
        <div className="loading">requesting listing</div>
      );
    } else {

      return (
        <section className="book-trip-page">
          <form className="book-trip-form">About Your Trip

          {this.selectGuests()}
            <label className="subscribe-lab">
              <div className="subscribe-img">
                <input type="checkbox" className="subbox-input subscribe-info "/>
              </div>
              <div className="subscribe-info pet-info">Prefer Quiet?</div>
            </label>

            <div className="say-hello-container">Say hello to your host and tell them why you're coming:
              <textarea className="say-hello" placeholder="Visiting family or friends? See the sights? This helps your host plan for your trip."/>
            </div>
            <button className="pinkButton bk-tp-btn" onClick={(e) => this.handleSubmit(e)}>
              <span className="btn-text">
                Book
              </span>
            </button>
          </form>

          {this.bookingRightPanel()}
        </section>
      )
    }
  }
}

export default withRouter(BookTrip);
