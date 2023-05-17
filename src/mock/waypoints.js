const offersList = [
  {
    'type': 'taxi',
    'offers': [
      {
        'id': 1,
        'title': 'Choose the radio station',
        'price': 60
      }
    ]
  },
  {
    'type': 'flight',
    'offers': [
      {
        'id': 1,
        'title': 'Upgrade to a business class',
        'price': 120
      }
    ]
  }
];

const destinationsList = [
  {
    'id': 1,
    'destination': {
      'description': 'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
      'cityName': 'Amsterdam',
      'photos': ['http://picsum.photos/248/152?r=15']
    }
  }
];

const someOffer = offersList.find((offer) => offer.type === this.type);
const someDestination = destinationsList.find((destination) => destination.id === 1);

export const generateWaypoint = () => ({
  'type': 'Taxi',
  'destination': {
    someOffer
  },
  'startDate': '25/12/19 16:00',
  'endDate': '25/12/19 18:00',
  'price': 100,
  'offers': {
    someDestination
  }
});
