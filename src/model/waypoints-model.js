export default class WaypointsModel {
  #waypoints = null;

  constructor() {
    this.#waypoints = [];
  }

  init(waypoints) {
    this.#waypoints = waypoints;
  }

  getWaypoints() {
    return this.#waypoints;
  }
}
