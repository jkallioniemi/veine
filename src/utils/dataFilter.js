import { curry } from 'ramda';

const filterBasedOnHours = curry((min, max, item) => {
  const hours = item.x.getUTCHours();
  return hours >= min && hours <= max;
});

module.exports = {
  filterBasedOnHours
};
