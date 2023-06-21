import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class WaypointsModel extends Observable {
  #waypoints = [];
  #waypointsApiService = null;

  constructor(waypointsApiService) {
    super();
    this.#waypointsApiService = waypointsApiService;
  }

  init = async () => {
    try {
      const waypoints = await this.#waypointsApiService.points;
      this.#waypoints = waypoints.map(this.#adaptToClient);
    } catch(err) {
      this.#waypoints = [];
    }

    this._notify(UpdateType.INIT);
  };

  get waypoints() {
    return this.#waypoints;
  }

  updatePoint = async (updateType, update) => {
    const index = this.#waypoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }

    try {
      const response = await this.#waypointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#waypoints = [
        ...this.#waypoints.slice(0, index),
        updatedPoint,
        ...this.#waypoints.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update waypoint');
    }
  };

  addPoint = (updateType, update) => {
    this.#waypoints.unshift(update);

    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    const index = this.#waypoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting waypoint');
    }

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      ...this.#waypoints.slice(index + 1),
    ];

    this._notify(updateType);
  };

  #adaptToClient = (waypoint) => {
    const adaptedPoint = {...waypoint,
      basePrice: waypoint['base_price'],
      dateFrom: waypoint['date_from'] !== null ? new Date(waypoint['date_from']) : waypoint['date_from'],
      dateTo: waypoint['date_to'] !== null ? new Date(waypoint['date_to']) : waypoint['date_to'],
      isFavorite: waypoint['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  };
}
