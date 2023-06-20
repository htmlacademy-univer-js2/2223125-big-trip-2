export default class WaypointsModel {
  #waypoints = null;

  constructor() {
    this.#waypoints = [];
  }

  init(waypoints) {
    this.#waypoints = waypoints;
  }

  get waypoints() {
    return this.#waypoints;
  }
}
