import {Ship, GameBoard, Player, IDBase, events} from "./BattleShip.js";

const GameUIManager = (() => {
    const board = document.querySelector(".board-section");
    const toolbars = [...document.querySelectorAll(".toolbar img")];
    const myBoardHouses = [...document.querySelectorAll(".my-board .board-container img")];
    
    let toggle = 0;
    let clone;
    let offsetX = 0;
    let offsetY = 0;
    const shipPlacing = (e) => {
        console.log(e.target.parentElement);
        if (toolbars.includes(e.target)) {
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
                board.appendChild(clone);
            } else if (toggle == 1) {
                if (!clone) return;
                clone.remove();
                clone = null;
            }
            toggle = 1 - toggle; 
        } else if (myBoardHouses.includes(e.target)) {
            if (toggle  == 1) {
                if (!clone) return;
                clone.remove();
                clone = null;
                let event = new CustomEvent('onShipPlcement', {
                    detail: {
                        offset: e.clientY / 50,
                        column: e.target.dataset.col
                    }
                });
                events.dispatchEvent(event);
            }
        } else {
            return;
        }
    }

    board.addEventListener('click', (e) => {
        shipPlacing(e);
    });
    
    board.addEventListener('mousemove', (e) => {
        if (!clone) return;
        clone.style.left = `${e.clientX - offsetX}px`;
        clone.style.top = `${e.clientY - offsetY}px`;
    });

    toolbars.forEach((shipImg) => {
        shipImg.addEventListener('onShipPlacementLimit', (e) => {
            if (shipImg.id == `ship-${e.detail.shipLength}`) {
                shipImg.classList.add("unavailable");
            }
        })
    });
})();

const GameManager = (() => {
    
    return {}
})();