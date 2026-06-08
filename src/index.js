//import "./style.css";

export { Ship };

const Ship = (inputLength) => {
  let _length = inputLength;
  let _hitCount = 0;

  const hit = (numberOfHits = 1) => {
    _hitCount = _hitCount + numberOfHits;
  }

  const isSunk = () => {
    if (_length == _hitCount) {
      return true;
    }
    else
      return false;
  }

  return {
    get hitCount() {
      return _hitCount;
    },
    get length() {
      return _length;
    },

    hit, isSunk}
};
