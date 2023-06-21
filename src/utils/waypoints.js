import { generateWaypoint } from '../mock/waypoints';
import dayjs from 'dayjs';

const generateWaypoints = (count) => (Array.from({lenght: count}, generateWaypoint));

const humanizePointDueDate = (dueDate) => dueDate ? dayjs(dueDate).format('DD MMM') : '';

const calculateDuration = (dateFrom, dateTo) => {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);
  const difference = end.diff(start, 'minute');

  const days = Math.floor(difference / 1440);
  const restHours = Math.floor((difference - days * 1440) / 60);
  const restMinutes = difference - (days * 1440 + restHours * 60);

  const daysOutput = (days) ? `${days}D` : '';
  const hoursOutput = (restHours) ? `${restHours}H` : '';
  const minutesOutput = (restMinutes) ? `${restMinutes}M` : '';

  return `${daysOutput} ${hoursOutput} ${minutesOutput}`;
};

const renderOffers = (offerList) => {
  let result = '';
  offerList((offer) => {
    result += `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`;
  });

  return result;
};

const getDate = (date) => dayjs(date).format('YYYY-MM-DD');

const getTime = (date) => dayjs(date).format('hh:mm');

const isPointDatePast = (dateTo) => dayjs().diff(dateTo, 'minute') > 0;

const isPointDateFuture = (dateFrom) => dayjs().diff(dateFrom, 'minute') <= 0;

const isPointDateFuturePast = (dateFrom, dateTo) => dayjs().diff(dateFrom, 'minute') > 0 && dayjs().diff(dateTo, 'minute') < 0;

const capitalizeValue = (value) => {
  if (value === false) {
    return '';
  }

  const capFirstValue = value[0].toUpperCase();
  const restOfValue = value.slice(1);
  return capFirstValue + restOfValue;
};

export { generateWaypoints, humanizePointDueDate, calculateDuration, renderOffers, getDate, getTime,
  isPointDatePast, isPointDateFuture, isPointDateFuturePast, capitalizeValue};
