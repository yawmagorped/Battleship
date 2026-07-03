import {Ship, GameBoard, Player, IDBase, events} from "./BattleShip.js";

const SHIP_LENGTH = 50;

const pos = Object.freeze({
    free_roam: 0,
    snap_rotation_0: 1,
    snap_rotation_90:2
});

const GameUIManager = (() => {
    const board = document.querySelector(".board-section");
    const toolbars = [...document.querySelectorAll(".toolbar img")];
    const myBoardHouses = [...document.querySelectorAll(".my-board .board-container img")];
    const myBoardContainer = document.querySelector(".my-board");

    let toggle = 0;
    let clone;
    let offsetX = 0;
    let offsetY = 0;
    let rotation = 0;
    let shipLength;
    let selectedRect;
    const shipPlacing = (e) => {
        // console.log(e.target.parentElement.dataset.col, e.target.parentElement.dataset.row);
        if (toolbars.includes(e.target)) {
            rotation = 0;
            if (toggle == 0) {
                clone = e.target.cloneNode();
                
                selectedRect = e.target.getBoundingClientRect();
                offsetX = e.clientX - selectedRect.left;
                offsetY = e.clientY - selectedRect.top;
                
                clone.style.position = "fixed";
                clone.style.pointerEvents = "none";
                clone.style.opacity = "0.6";

                updateClonePosition(pos.free_roam, [e.clientX, e.clientY]);
                
                toolbars[0].parentElement.appendChild(clone);
                // console.log(offsetY / SHIP_LENGTH);
            } else if (toggle == 1) {
                if (!clone) return;
                clone.remove();
                clone = null;
            }
            toggle = 1 - toggle; 
        } else if (myBoardHouses.includes(e.target)) {
            if (toggle  == 1) {
                shipLength = clone.dataset.length;
                let offsetFromMouse = (shipLength-1) - Math.floor(offsetY / SHIP_LENGTH);
                // console.log(e.target.parentElement.dataset.col, e.target.parentElement.dataset.row  - offsetFromMouse)
                // console.log(e.target.parentElement.dataset.col - offsetFromMouse, e.target.parentElement.dataset.row)
                let x, y;
                if (rotation == 0) {
                    x = e.target.parentElement.dataset.col;
                    y = e.target.parentElement.dataset.row - offsetFromMouse;
                } else if (rotation == 90) {
                    x = e.target.parentElement.dataset.col - offsetFromMouse;
                    y = e.target.parentElement.dataset.row;
                }
                let event = new CustomEvent('onShipPlacement', {
                    detail: {
                        
                    }
                });
                // let event = new CustomEvent('onShipPlcement', {
                //     detail: {
                //         x: e.target.dataset.parentElement.col,
                //         y: e.target.parentElement.dataset.row  - offsetFromMouse,
                //         rotation: rotation
                //     }
                // });
                events.dispatchEvent(event);
            }
        } else {
            return;
        }
    }

    document.addEventListener('keydown', (e) =>  {
        if (!clone) return;
        if (e.key == 'r') {
            if (clone.style.rotate == "0deg" || !clone.style.rotate) {
                clone.style.rotate = "90deg";
                rotation = 90;
                updateClonePosition(pos.snap_rotation_90, null, selectedRect);    
            } else {
                clone.style.rotate = "0deg";
                rotation = 0;
                updateClonePosition(pos.snap_rotation_0, null, selectedRect);
            }
        }
    })

    const updateClonePosition = (mode, clientPositions = null, rect = null) => {
        switch (mode) {
            case pos.free_roam:
                clone.style.left = `${clientPositions[0] - offsetX}px`;
                clone.style.top = `${clientPositions[1] - offsetY}px`;
                break;
            case pos.snap_rotation_0:
                clone.style.left = `${rect.left}px`;
                clone.style.top = `${(rect.top - Math.floor(offsetY / SHIP_LENGTH) * SHIP_LENGTH) }px`;
                break;
            case pos.snap_rotation_90:
                clone.style.left = `${rect.left + (Math.floor(offsetY / SHIP_LENGTH)+1) * SHIP_LENGTH}px`;
                clone.style.top = `${(rect.top) }px`;
                break;
        }
    }

    board.addEventListener('click', (e) => {
        shipPlacing(e);
    });
    
    board.addEventListener('mousemove', (e) => {
        if (!clone) return;
        if (myBoardHouses.includes(e.target)) {
            selectedRect = e.target.getBoundingClientRect();
            if (rotation == 0) {
                updateClonePosition(pos.snap_rotation_0, null, selectedRect);
            } else {
                updateClonePosition(pos.snap_rotation_90, null, selectedRect);
            }
        } else {
            clone.style.left = `${e.clientX - offsetX}px`;
            clone.style.top = `${e.clientY - offsetY}px`;
        }
    });

    const drawShip = (posX, posY, rotation, length) => {
        let imageToDraw = toolbars.find((element) => element.dataset.length == length);
        let cloneImage = imageToDraw.cloneNode();
        let selectedGridHouse = myBoardHouses.find((element) => element.parentElement.dataset.col == posX && element.parentElement.dataset.row == posY);
        let selectedGridHouseRect = selectedGridHouse.getBoundingClientRect();
        cloneImage.style.position = "fixed";
        cloneImage.style.pointerEvents = "none";
        cloneImage.style.opacity = "0.6";
        if (rotation == 0) {
            cloneImage.style.rotate = "0deg"; 
        } else if (rotation == 90) {
            cloneImage.style.rotate = "90deg";
        }
        cloneImage.style.left = `${selectedGridHouseRect.left}px`;
        cloneImage.style.top = `${selectedGridHouseRect.top}px`;

        myBoardContainer.appendChild(cloneImage);
    }
})();

const GameManager = (() => {
    
    return {}
})();