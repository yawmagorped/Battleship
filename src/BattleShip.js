export { Ship, GameBoard, Player, IDBase };
export const events = new EventTarget();

const BOARD_SIZE = 10;

export const States = Object.freeze({
    EMPTY: null,
    EMPTY_HIT: 1,
    HIT: 2,
});

export const Types = Object.freeze({
  HUMAN: 0,
  MACHINE: 1,
});

const IDBase = 1000;
const MAX_SHIP_COUNT = IDBase / 10;

const Ship = (inputLength, inputID) => {
  let _length = Number(inputLength);
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

const GameBoard = (type) => {
  let _board = [];
  let _shipList = [];
  let _shipRule = [2, 2, 3, 4, 5];
  let _boardType = type;

  for (let i = 0; i < BOARD_SIZE; i++) { 
    _board[i] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      _board[i].push(States.EMPTY);
    }
  }

  const ruleCheck = (shipLength) => { // checking that the ships placed are [2, 2, 3, 4, 5]
    if(_boardType == Types.MACHINE) {
      if(_shipRule.includes(shipLength)) {
        return true;
      } else {
        return false;
      }
    }
    if (_shipRule.includes(shipLength)) {
      return true;
    } else if(!_shipRule.includes(shipLength)) {
        if (_shipRule.every(value => value === -1)) {
          // console.log("all ships placed")
          let event2 = new CustomEvent('onGameStart');
          events.dispatchEvent(event2);
        }
        let event = new CustomEvent('onShipPlacementLimitReached', {
          detail: {
            shipLength: shipLength
          }
        });
        events.dispatchEvent(event);
      return false;
    }
  }

  let idCounter = 0;
  events.addEventListener('onShipPlacement', (e) => {
    if(placeShip(e.detail.x, e.detail.y, e.detail.rotation, Ship(e.detail.length, idCounter))) {
      idCounter++;
    }
  });

  const placeShip = (x, y, rotation, shipToPlace) => {
    
    if(!checkForCollisions(x, y, rotation, shipToPlace)) {
      // console.log("ship placement cancelled")
      return false;
    }
    if (!ruleCheck(shipToPlace.length)) {
      // console.log("unable to place more ships due the limit of ships have been reached");
      return false;
    }
    _shipRule[_shipRule.indexOf(shipToPlace.length)] = -1;

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
      ruleCheck(shipToPlace.length);

    let event = new CustomEvent('onSuccessfulShipPlacement',{
      detail: {
        x:x,
        y:y,
        rotation:rotation,
        length:shipToPlace.length,
        type: _boardType
      }
    });
    events.dispatchEvent(event);
    return true;
  }



  const checkForCollisions = (x, y, rotation, shipToPlace) => {
    switch (rotation) {
      case 0:
      default:
        if (0 > y || y + shipToPlace.length > BOARD_SIZE) {
          return false;
        }
        break; 
      case 90:
        if (0 > x || x + shipToPlace.length > BOARD_SIZE) {
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

  const receiveAttack = (x, y) => {
    if(Math.floor(_board[x][y] / MAX_SHIP_COUNT) == (IDBase / MAX_SHIP_COUNT)) {
      getShip(_board[x][y]).hit();
      _board[x][y] = States.HIT;
      return States.HIT;
    } else if(_board[x][y] == States.EMPTY) {
      _board[x][y] = States.EMPTY_HIT;
      return States.EMPTY_HIT;
    } else if(_board[x][y] == States.HIT) {
      return false;
    } else {
      // console.log("not a valid target to receive an attack");
      return false;
    }
  }

  const getShip = (ID) => { 
    if (ID < IDBase) {
      ID = ID + IDBase;
    }
    return _shipList.find((element) => element.processedID == ID);
  }

  const areAllShipsSunk = () => {
    let result = true;
    _shipList.forEach((element) => {
      if (!element.isSunk()) {
        result = false;
      }
    });
    return result;
  }

  let enemyCounter = 50;
  const placeShipsAtRandom = (shipType = Types.MACHINE) => {
    _shipRule.forEach((length) => {
      while(!placeShip(
        Math.floor(Math.random() * 10), 
        Math.floor(Math.random() * 10), 
        Math.floor(Math.random() * 2) * 90, 
        Ship(length, enemyCounter),
        shipType)) {
          continue;
      }
      enemyCounter++;
    });
  }

  return {
    get board() {
      return _board;
    },
    get boardType() {
      return _boardType;
    },
    get shipList() {
      return _shipList;
    },
    placeShip, receiveAttack, getShip, areAllShipsSunk, checkForCollisions, placeShipsAtRandom
  }
}

const Player = (inputName, inputType) => {
  let _name = inputName;
  let _type = inputType;
  let _gameBoard = GameBoard(_type);

  if (_type == Types.MACHINE) {
    _gameBoard.placeShipsAtRandom();
  }

  const hit = (x = 0, y = 0) => {
    if (_type == Types.HUMAN) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    }
    let reciever = _gameBoard.receiveAttack(x, y); 
    if(reciever) {
      let event = new CustomEvent('onBoardHouseUpdate', {
        detail: {
          x: x,
          y: y,
          type: _type,
          hitType: reciever
        }
      });
      events.dispatchEvent(event);
      return true;
    } else
        return false;
  }

  return {
    get name() {
      return _name;
    },
    get type() {
      return _type;
    },
    get gameBoard() {
      return _gameBoard;
    },
    hit
  }
}



  // let gameBoard = GameBoard();
  // gameBoard.placeShip(5, 2, 90, Ship(3, 1));
  // gameBoard.receiveAttack(5, 2);
  // console.log(gameBoard.shipList[0].hitCount);
  // console.log(gameBoard.getShip(1));