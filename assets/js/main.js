window.onload = loadPage;
let score = 0;
let gameStatus = false;
let timer;
let time = 60;
// Get the modal
var modal = document.getElementById('scoreModal');

function loadPage() {
    let start = document.getElementById("start");
    printGameTable();

    if(localStorage.getItem("moleGame") !== null) {
        loadLocalStorage();
    }
    start.addEventListener('click', startGame, false);
    addEventListenerDivs();
}

function addEventListenerDivs(){
    let gameDiv = document.querySelectorAll(".house, .mole");
    for(let i = 0; i< gameDiv.length; i++){
        gameDiv[i].addEventListener('click', (event)=>{hitMole(event.target)}, false);
    }
}

function loadLocalStorage(){
    const GameS = JSON.parse(localStorage.getItem("moleGame"));
    if(GameS.status){
        let tableGame = document.getElementById("gameTable");
        tableGame.innerHTML = "";
        time = GameS.time;
        score = GameS.score;
        gameStatus = GameS.status;

        for(let itemCol in GameS.gameTable){
            let col = document.createElement("div");
            for(let div in GameS.gameTable[itemCol]){
                let divs = document.createElement("div");
                divs.classList.add(GameS.gameTable[itemCol][div]);
                if(GameS.gameTable[itemCol][div] === "house"){
                    divs.innerText = "X"
                }
                col.appendChild(divs);
            }
            tableGame.appendChild(col);
        }
        addEventListenerDivs();
        document.getElementById("score").firstElementChild.innerText = score;
        startgameTimer();

        window.setTimeout(()=>{
            createMoles();
        }, 1000);
    }
}

function startGame() {
    let gameDiv = document.querySelectorAll(".mole");
    gameStatus = true;
    time = 60;
    score = 0;
    document.getElementById("score").firstElementChild.innerText = "00";
    for(let i = 0; i< gameDiv.length; i++){
        gameDiv[i].classList.replace("mole", "house");
        gameDiv[i].innerText = "X";
    }

    window.setTimeout(()=>{
        startgameTimer();
        createMoles();
        }, 1000);

    return false;
}

function hitMole(element){
    if(element.classList.contains("mole") && gameStatus){
        element.classList.replace("mole", "house");
        element.innerText = "X";
        score++;
        fadeIn(document.getElementById("score").firstElementChild, 1000);
        document.getElementById("score").firstElementChild.innerText = score;
    }
}

function fadeIn(el, time) {
    el.style.opacity = 0;

    var last = +new Date();
    var tick = function() {
        el.style.opacity = +el.style.opacity + (new Date() - last) / time;
        last = +new Date();

        if (+el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };

    tick();
}

function printGameTable() {
    let gameTable = document.getElementById("gameTable");
    let counter= 2;
    let decrement = false;
    for(let i = 0; i < 6; i++){
        let div = document.createElement("div");
        for(let j = 0; j< counter; j++){
            let house = document.createElement("div");
            house.classList.add("house");
            house.innerText = "X";
            div.appendChild(house);
        }
        if(counter >= 6){
            if(counter === 6 && !decrement){
                counter += 2;
            }
            decrement = true;
        }
        if(decrement){
            counter -= 2;
        } else {
            counter += 2;
        }
        gameTable.appendChild(div);
    }
}

function createMoles(){
    if(!gameStatus){
        return true;
    }

    let tableGame= document.querySelector("#gameTable");
    let randomTime = getRandom(1000, 3000);
    let randomMoles = getRandom(1, 5);

    if(randomMoles >= tableGame.querySelectorAll(".house").length){
        gameEnd(false);
        return false;
    }

    if(tableGame.querySelectorAll(".house").length > 0){
        for(let i = 0; i<randomMoles; i++){
            const houses = tableGame.querySelectorAll(".house");
            const randomHouse = getRandom(0, houses.length - 1);

            houses[randomHouse].innerText = "";
            houses[randomHouse].classList.replace("house", "mole");
        }

        window.setTimeout(()=>{createMoles()}, randomTime);
    }
}
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function gameEnd(status){
    if(!status){
        let tableGame= document.querySelector("#gameTable");
        let houses = tableGame.querySelectorAll(".house");
        for(let i = 0; i<houses.length; i++){
            houses[i].innerText = "";
            houses[i].classList.replace("house", "mole");
        }
        document.getElementById("titleModal").innerText = "Game Over";
        document.querySelector(".alert").classList.replace("alert-primary", "alert-warning")
        document.getElementById("bodyModal").innerText = "You Lost because the Moles invaded you. Your score is: "+score;
        openModal()
        //alert("YOU LOST. YOUR SCORE IS: "+score)
    } else {
        document.getElementById("titleModal").innerText = "Time Over";
        document.getElementById("bodyModal").innerText = "Your current score is: "+score;
        openModal()
        //alert("YOUR SCORE IS: "+score)
    }
    localStorage.removeItem("moleGame");
    gameStatus = false;
    createMoles();
    document.getElementById("start").disabled = false;
}
// Timer
function startgameTimer() {
    updateTimerText(time);
    document.getElementById("start").disabled = true;

    timer = setInterval(() => {
        if (time <= 0 || !gameStatus) {
            clearInterval(timer);

            if(gameStatus){
                gameEnd(true);
            }

            return;
        }
        updateTimerText(--time);
    }, 1000);

}
function updateTimerText(time) {
    let gameTimer = document.getElementById("timer");
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    gameTimer.innerHTML = `Time: ${minutes} : ${seconds}`;
}
window.onbeforeunload = function() {
    if(gameStatus){
        const gameTable = Array.from(document.getElementById("gameTable").childNodes);
        const divsGame = [];

        for(let num in gameTable){
            const col = [];
            const sons = Array.from(gameTable[num].childNodes);
            for(let value in sons){
                col.push(sons[value].className);
            }
            divsGame.push(col)
        }
        let Game = {score:score, time:time, gameTable:divsGame, status:gameStatus};
        localStorage.setItem("moleGame", JSON.stringify(Game));
    }
};

function openModal() {
    document.getElementById("backdrop").style.display = "block"
    document.getElementById("scoreModal").style.display = "block"
    document.getElementById("scoreModal").classList.add("show")
}
function closeModal() {
    document.getElementById("backdrop").style.display = "none"
    document.getElementById("scoreModal").style.display = "none"
    document.getElementById("scoreModal").classList.remove("show")
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal()
    }
}