import ApiService from '../framework/api-service.js';
import { ApiServiceResponseMethod } from '../const.js';

export default class PointsApiService extends ApiService {
  get waypoints() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  updatePoint = async (waypoint) => {
    const response = await this._load({
      url: `points/${waypoint.id}`,
      method: ApiServiceResponseMethod.PUT,
      body: JSON.stringify(this.#adaptToServer(waypoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  addPoint = async (waypoint) => {
    const response = await this._load({
      url: 'points',
      method: ApiServiceResponseMethod.POST,
      body: JSON.stringify(this.#adaptToServer(waypoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deletePoint = async (waypoint) => {
    const response = await this._load({
      url: `points/${waypoint.id}`,
      method: ApiServiceResponseMethod.DELETE,
    });

    return response;
  };

  #adaptToServer = (waypoint) => {
    const adaptedPoint = {...waypoint,
      'base_price': waypoint.basePrice,
      'date_from': waypoint.dateFrom instanceof Date ? waypoint.dateFrom.toISOString() : null,
      'date_to': waypoint.dateTo instanceof Date ? waypoint.dateTo.toISOString() : null,
      'is_favorite': waypoint.isFavorite,
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  };
}
