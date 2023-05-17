import { generateWaypoint } from '../mock/waypoints';

export const generateWaypoints = (count) => (Array.from({lenght: count}, generateWaypoint));
