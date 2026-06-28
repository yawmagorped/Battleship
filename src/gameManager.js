import {Ship, GameBoard, Player, IDBase} from "./BattleShip.js";

const GameManager = (() => {
    
    return {}
})();

const GameUIManager = (() => {
    const board = document.querySelector(".board-section");
    const toolbars = [...document.querySelectorAll(".toolbar img")];
    
    
    let toggle = 0;
    let clone;
    let offsetX = 0;
    let offsetY = 0;
    const shipPlacingToggle = (e) => {
        toggle = 1 - toggle; 
        if (toggle == 1) {
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
        } else if (toggle == 0) {
            if (!clone) return;
            clone.remove();
            clone = null;
        }
    }
    
    board.addEventListener('click', (e) => {
        if (toolbars.find((element) => element == e.target) != undefined) {
            shipPlacingToggle(e);
        }
    })
    
    board.addEventListener('mousemove', (e) => {
        if (!clone) return;
        clone.style.left = `${e.clientX - offsetX}px`;
        clone.style.top = `${e.clientY - offsetY}px`;
    })
})();