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

const isPointDatePast = (date) => dayjs().diff(date, 'day') > 0;

const isPointDateFuture = (date) => date.diff(dayjs(), 'day') >= 0;

const isPointDateFuturePast = (dateFrom, dateTo) => dayjs().diff(dateFrom, 'day') > 0 && dateTo.diff(dayjs(), 'day') > 0;

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const sortPricePoint = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const sortDayPoint = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortTimePoint = (pointA, pointB) => {
  const timePointA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const timePointB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return timePointB - timePointA;
};

export { generateWaypoints, humanizePointDueDate, calculateDuration, renderOffers, getDate, getTime,
  isPointDatePast, isPointDateFuture, isPointDateFuturePast, updateItem, sortPricePoint, sortDayPoint, sortTimePoint};
