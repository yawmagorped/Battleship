//import "./style.css";

export { Ship, GameBoard };

const BOARD_SIZE = 10;

const Ship = (inputLength, inputID) => {

  let _length = inputLength;
  let _rotation = 0;
  let _ID = inputID;
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
    get ID() {
      return _ID;
    },
    get rotation() {
      return _rotation;
    },

    hit, isSunk}
};

const GameBoard = () => {
  let _board = [];
  let _shipList = [];
  
  for (let i = 0; i < BOARD_SIZE; i++) { 
    _board[i] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      _board[i].push(null);
    }
  }

  
  const placeShip = (x, y, rotation, shipToPlace) => {
    let counter;
    switch (rotation) {
      case 0:
      default:
        counter = y;
        if (0 >= y || y + shipToPlace.length > BOARD_SIZE) {
          console.error("failed to add ship");
          return;
        }
        for (let i = 0; i < shipToPlace.length; i++) {
          if (_board[x][counter] == null) {
            _board[x][counter] = shipToPlace.ID;
            // console.log(x + ", " + counter + " ==> " + _board[x][counter])
            counter++
          } else { // throw an error
            console.error("failed to add ship");
            return;
          }
        }
        break;
      case 90:
        counter = x;
        if (0 >= x || x + shipToPlace.length > BOARD_SIZE) {
          console.error("failed to add ship");
          return;
        }
        for (let i = 0; i < shipToPlace.length; i++) {
          if (_board[counter][y] == null) {
            _board[counter][y] = shipToPlace.ID;
            counter++;
          } else { // throw an error
            console.error("failed to add ship");
            return;
          }
        }
        break;
    }
    _shipList.push(shipToPlace);
  }

  // placeShip(1, 2, 0, Ship(2, 101));
  // placeShip(2, 3, 90, Ship(3, 102));
  // placeShip(3, 4, 0, Ship(3, 103));
  // placeShip(5, 6, 90, Ship(4, 104));
  // placeShip(6, 7, 0, Ship(5, 105));

  return {
    get board() {
      return _board;
    },

    placeShip
  }
}

let gameBoard = GameBoard();
gameBoard.placeShip(8, 2, 90, Ship(3, 101));