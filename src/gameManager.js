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
    
    let toggle = 0;
    let clone;
    let offsetX = 0;
    let offsetY = 0;
    let rotation = 0;
    let shipLength;
    const shipPlacing = (e) => {
        // console.log(e.target.parentElement.dataset.col, e.target.parentElement.dataset.row);
        if (toolbars.includes(e.target)) {
            rotation = 0;
            if (toggle == 0) {
                clone = e.target.cloneNode();
                
                const rect = e.target.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                
                clone.style.position = "fixed";
                clone.style.pointerEvents = "none";
                clone.style.opacity = "0.6";
                clone.style.left = `${e.clientX - offsetX}px`;
                clone.style.top = `${e.clientY - offsetY}px`;
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
                let event = new CustomEvent('onShipPlacement', {
                    detail: {

                    }
                });
                if (rotation == 0) {
                    event.detail = {
                        x: e.target.parentElement.dataset.col,
                        y: e.target.parentElement.dataset.row - offsetFromMouse,
                    }
                }
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
            } else {
                clone.style.rotate = "0deg";
                rotation = 0;
            }
        }
    })

    const updateClonePosition = (mode, rect = null) => {
        switch (mode) {
            case pos.free_roam:
                clone.style.left = `${e.clientX - offsetX}px`;
                clone.style.top = `${e.clientY - offsetY}px`;
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
            const rect = e.target.getBoundingClientRect();
            if (rotation == 0) {
                clone.style.left = `${rect.left}px`;
                clone.style.top = `${(rect.top - Math.floor(offsetY / SHIP_LENGTH) * SHIP_LENGTH) }px`;
            } else {
                clone.style.left = `${rect.left + (Math.floor(offsetY / SHIP_LENGTH)+1) * SHIP_LENGTH}px`;
                clone.style.top = `${(rect.top) }px`;
            }
        } else {
            clone.style.left = `${e.clientX - offsetX}px`;
            clone.style.top = `${e.clientY - offsetY}px`;
        }
    });

    // toolbars.forEach((shipImg) => {
    //     shipImg.addEventListener('onShipPlacementLimitReached', (e) => {
    //         if (shipImg.id == `ship-${e.detail.shipLength}`) {
    //             shipImg.classList.add("unavailable");
    //         }
    //     })
    // });
})();

const GameManager = (() => {
    
    return {}
})();