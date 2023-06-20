export default class WaypointsModel {
  #waypoints = [];

  init(waypoints) {
    this.#waypoints = waypoints;
  }

  get waypoints() {
    return this.#waypoints;
  }
}
