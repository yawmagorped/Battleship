export { Ship, GameBoard, Player, IDBase };
export const events = new EventTarget();

const BOARD_SIZE = 10;
const States = Object.freeze({
    EMPTY: null,
    EMPTY_HIT: 1,
});
const Types = Object.freeze({
  HUMAN: 0,
  MACHINE: 1,
});

const IDBase = 1000;
const MAX_SHIP_COUNT = IDBase / 10;

const Ship = (inputLength, inputID) => {
  let _length = inputLength;
  let _rotation = 0;
  let _processedID = IDBase + inputID;
  let _hitCount = 0;

  const hit = (numberOfHits = 1) => {
    if(isSunk()) {
      console.error("hit was called even though the ship has sunk");
      return;
    }
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
    get processedID() {
      return _processedID;
    },
    get rotation() {
      return _rotation;
    },

    hit, isSunk}
};

const GameBoard = () => {
  let _board = [];
  let _shipList = [];
  let _shipRule = [2, 2, 3, 4, 5];
  
  for (let i = 0; i < BOARD_SIZE; i++) { 
    _board[i] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      _board[i].push(States.EMPTY);
    }
  }

  const ruleCheck = (length) => { // checking that the ships placed are [2, 2, 3, 4, 5]
    if (_shipRule.includes(length)) {
      _shipRule[_shipRule.indexOf(length)] = -1;
      
      if(!_shipRule.includes(length)) {
        let event = new CustomEvent('onShipPlacementLimit', {
          detail: {
            shipLength: length
          }
        });
        events.dispatchEvent(event);
      }
      return true;
    } else {
      return false;
    }
  }

  const placeShip = (x, y, rotation, shipToPlace) => {
    
    if (!ruleCheck(shipToPlace.length)) {
      console.error("unable to place more ships due the limit of ships have been reached");
      return false;
    }
    
    if(!checkForCollisions(x, y, rotation, shipToPlace)) {
      console.log("ship placement cancelled")
      return false;
    }
    let counter;
    switch (rotation) {
      case 0:
      default:
        counter = y;
        for (let i = 0; i < shipToPlace.length; i++) {
            _board[x][counter] = shipToPlace.processedID;
            // console.log(x + ", " + counter + " ==> " + _board[x][counter])
            counter++
        }
        break;
      case 90:
        counter = x;
        for (let i = 0; i < shipToPlace.length; i++) {
          _board[counter][y] = shipToPlace.processedID;
          counter++;
        }
        break;
    }
    _shipList.push(shipToPlace);
  }



  const checkForCollisions = (x, y, rotation, shipToPlace) => {
    switch (rotation) {
      case 0:
      default:
        if (0 >= y || y + shipToPlace.length > BOARD_SIZE) {
          return false;
        }
        break; 
      case 90:
        if (0 >= x || x + shipToPlace.length > BOARD_SIZE) {
          return false;
        }
        break;
    }
    for (let index = 0; index < shipToPlace.length; index++) {
      switch(rotation) {
        case 0:
        default:
          if(_board[x][y + index] != null) {
            return false;
          }
          break;
        case 90:
          if(_board[x + index][y] != null) {
            return false;
          }
          break;
      }
    }
    return true;
  }

  // placeShip(1, 2, 0, Ship(2, 1));
  // placeShip(2, 3, 90, Ship(3, 2));
  // placeShip(3, 4, 0, Ship(3, 3));
  // placeShip(5, 6, 90, Ship(4, 4));
  // placeShip(6, 7, 0, Ship(5, 5));

  const receiveAttack = (x, y) => {
    if(Math.floor(_board[x][y] / MAX_SHIP_COUNT) == (IDBase / MAX_SHIP_COUNT)) {
      getShip(_board[x][y]).hit();
    } else if(_board[x][y] == States.EMPTY) {
      _board[x][y] = States.EMPTY_HIT;
    } else
    {
      console.error("not a valid target to receive an attack");
    }
  }

  const getShip = (ID) => { 
    if (ID < IDBase) {
      ID = ID + IDBase;
    }
    return _shipList.find((element) => element.processedID == ID);
  }

  const areAllShipsSunk = () => {
    _shipList.forEach((element) => {
      if (!element.isSunk) {
        return false;
      }
    });
    return true;
  }

  return {
    get board() {
      return _board;
    },
    get shipList() {
      return _shipList;
    },
    placeShip, receiveAttack, getShip, areAllShipsSunk
  }
}

const Player = (inputName, inputType) => {
  let _name = inputName;
  let _type = inputType;
  let _playersGameBoard = GameBoard();
                                // if (_type == Types.HUMAN) {
                                //   let event = new CustomEvent('OnShipPlacement', {
                                //     detail: {
                                //       shipList: _playersGameBoard.shipList
                                //     }
                                //   });
                                //   events.dispatchEvent(event);
                                // }

  return {
    get name() {
      return _name;
    },
    get type() {
      return _type;
    },
    get playersGameBoard() {
      return _playersGameBoard;
    }
  }
}

  let gameBoard = GameBoard();
  gameBoard.placeShip(5, 2, 90, Ship(3, 1));
  gameBoard.receiveAttack(5, 2);
  // console.log(gameBoard.shipList[0].hitCount);
  console.log(gameBoard.getShip(1));