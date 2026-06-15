import {Ship, GameBoard, IDBase} from "./BattleShip.js";

describe("ship tests", () => { 
    let ship;
    let shipTestLength = 5;
    
    beforeEach(() => {
        ship = Ship(shipTestLength, 1);
    });

    test("ship length verification", () => expect(ship.length).toBe(shipTestLength));

    test("hitting a ship", () => {
        ship.hit();
        expect(ship.hitCount).toBe(1);
    });

    test("sinking a ship", () => {
        ship.hit(ship.length);
        expect(ship.isSunk()).toBe(true);
    });
});

describe("GameBoard tests", () => {
    let testGameBoard;
    let testShip;
    let testShipID;
    let testX, testY;
    let testRotation;

    beforeEach(() => {
        testGameBoard = GameBoard();
        testShipID = 1;
        testShip = Ship(3, testShipID);
        testX = 1;
        testY = 2;
        testRotation = 90;    
    });

    test("initial board is null", () => {
        for (let i = 0; i < testGameBoard.board.length; i++) { 
            for (let j = 0; j < testGameBoard.board[0].length; j++) {
                testGameBoard.board[i][j] == null;
            }
        }
    });

    test("placing a ship on the board (90 degree rotation)", () => {
        testGameBoard.placeShip(testX, testY, testRotation, testShip);
        expect([testGameBoard.board[1][2],
            testGameBoard.board[2][2],
            testGameBoard.board[3][2]]
        ).toEqual([IDBase + 1, IDBase + 1, IDBase + 1]);
    });

    test("placing a ship on the board(0 degree rotation)", () => {
        testGameBoard.placeShip(6, 2, 0, Ship(4, 2));
        expect([testGameBoard.board[6][1],
            testGameBoard.board[6][2],
            testGameBoard.board[6][3],
            testGameBoard.board[6][4],
            testGameBoard.board[6][5]]
        ).toEqual([null, IDBase + 2, IDBase + 2, IDBase + 2, IDBase + 2]);
    });
    
    test("placing a ship on the board(edge case)", () => {
        testGameBoard.placeShip(8, 2, 90, testShip);
        expect(testGameBoard.board[8][2]).toBe(null);
    });

    test("placing a ship on top of another ship", () => {
        testGameBoard.placeShip(1, 2, 0, testShip);
        testGameBoard.placeShip(1, 2, 0, Ship(5, 3));

        expect([testGameBoard.board[1][2],
            testGameBoard.board[4][2]
        ]).toEqual([IDBase + 1, null]);

    });

    // test("shipList length", () => {
    //     testGameBoard.placeShip(testX, testY, 0, Ship(3, 1));
    //     expect(testGameBoard.shipList.length).toBe(1);
    // });

    test("hitting a ship", () => {
        let hitCountBeforeHit = testShip.hitCount;
        testGameBoard.placeShip(testX, testY, testRotation, Ship(3, testShipID));
        testGameBoard.receiveAttack(testX, testY);
        console.log(testGameBoard.shipList[0].length);
        expect(testGameBoard.getShip(testShipID).hitCount - hitCountBeforeHit).toBe(1);
    });

    test("checking if all ships are sunk", () => {
        testGameBoard.placeShip(1, 1, 0, Ship(3, testShipID));
        testGameBoard.receiveAttack(1,1);
        testGameBoard.receiveAttack(1, 2);
        testGameBoard.receiveAttack(1,3);
        testGameBoard.placeShip(2, 2, 90, Ship(2, testShipID + 1));
        testGameBoard.receiveAttack(2, 2);
        testGameBoard.receiveAttack(3, 2);
        
        expect(testGameBoard.areAllShipsSunk()).toBe(true);
    });

    // afterAll(() => {
    //     for (let i = 0; i < 10; i++) {
    //         console.log(testGameBoard.board[i]);
    //     } 
    // });
});

describe("Player tests", () => {
    
});