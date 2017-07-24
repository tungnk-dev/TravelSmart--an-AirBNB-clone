//We only do this.handleClick here because we dont want to bind it to MarkerManager
//We want it to stay bound to the Map where we passed it in and made a new MarkerManager there.
export default class MarkerManager {
  constructor(map, handleClick) {
    this.map = map;
    this.handleClick = handleClick;
    this.markers = {};
  }

  //This is pretty inefficient and requires too many iterations for no reason.
  //FIX LATER
  updateMarkers(homes) {
    const homesObj = {};
    //this pretty much rebuilds the object to the object that we got back from JBuilder
    //the 'this' within many of the methods is the TravelSmartMap itself, not the MarkerManager, kinda confusing

    homes.forEach(home => homesObj[home.id] = home);

    //Lazy loading of the markers. If the marker has not been created yet and in
    //the this.props.homes that were filtered and selected from db, we will create a
    //marker for each of these homes based on their latitude and longitude.
    //We do this so we don't have to create all the markers on load and then
    //when we get a bunch of markers, we don't make new ones of we already have them

    homes
      .filter(home => !this.markers[home.id])
      .forEach(newHome => { this.createMarkerFromHome(newHome, this.handleClick);
    });
    //Kind of a negation action. Every marker that isn't in the homesObj that we made,
    //we will remove all of these markers
    Object.keys(this.markers)
      .filter(homeid => !homesObj[homeid])
      .forEach((homeid) => this.removeMarker(this.markers[homeid]))
  }
// layout.scss for styling
// this is where homeid comes from and it sets the marker's homeid
// Your inconsistency in naming longitude as long in the db and lng needed here caused a long problem.

  createMarkerFromHome(home) {
    const image = "https://s3.amazonaws.com/safehavns-dev/mark.png";
    const lat = home.lat;
    const lng = home.long;
    let marker = new google.maps.Marker({
      position: {lat, lng},
      label: {
        color: "#ffffff",
        fontFamily: "Helvetica",
        text: "$"+String(home.price),
        fontSize: "14.5px",
        fontWeight: "700",
      },
      icon: image,
      animation: google.maps.Animation.DROP,
      map: this.map,
      homeid: home.id
    });
    console.log(marker);
    marker.addListener('click', this.toggleBounce.bind(marker));

    marker.addListener('click', () => this.handleClick(home));
    this.markers[marker.homeid] = marker;
  }

  //This will take the instance of the marker from Google Maps api and set its map
  // property to null
  //Delete will delete it from the this.markers entirely, which completely conflicts what
  //I said earlier about the Lazy loading
  //currently this is a horrible horrible O(n) or higher operation which would be done better
  //using hashes
  removeMarker(marker) {
    this.markers[marker.homeid].setMap(null);
    delete this.markers[marker.homeid];
  }

  //This is a waste of time.
  //Make yours more like AirBNB, where they hover and it lights up on the house
  //Also when you hover over the house from the home index, it will light up the house on the map
  toggleBounce() {
    if (this.getAnimation() !== null) {
      this.setAnimation(null);
    } else {
      this.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

}