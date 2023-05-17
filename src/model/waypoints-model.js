import { generateWaypoints } from '../utils/waypoints';

export default class WaypointsModel {
  waypoints = generateWaypoints(10);

  getWaypoints = () => this.waypoints;
};
