export default class WaypointsModel {
  constructor() {
    this.waypoints = [];
  }

  init(points) {
    this.waypoints = points;
  }

  getWaypoints() {
    return this.waypoints;
  }
}
