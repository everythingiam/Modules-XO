const DOM = (() => {
    const startBtn = document.querySelector('.start');
    const menuBtn = document.querySelector('.menu');
    const restartBtn = document.querySelector('.restart');
    const playerName = document.querySelector('.player');

    const init = () =>{
        startBtn.onclick = () => Logic.startGame();
        menuBtn.onclick = () => Logic.backToMenu();
        restartBtn.onclick = () => Logic.startGame();
    }
    
    init();

    return {
        board: document.querySelector('.board'),
        sellDOM: function(){
            const sell = document.createElement('div');
            sell.className = 'sell';
            return sell;
        },
        displayMark: function(mark, place){
            const h1mark = document.createElement('h1');
            h1mark.textContent = mark;
            place.appendChild(h1mark);
        },
        startBtn,
        restartBtn,
        menuBtn,
        playerName,
    }
})();

const Gameboard = (() => {
    var board = [];    

    function Sell(){
        this.dom = DOM.sellDOM();
        this.mark = '';

        this.setMark = function(mark){
            this.mark = mark;
        }
        
        this.dom.addEventListener('click', () => {
            if (!this.dom.classList.contains('disabled')) {
                Logic.makeMove(this);  
                DOM.displayMark(this.mark, this.dom);
                console.log(board);
            }
        });
    }

    const getBoard = () => {
        return board;
    }

    const refillBoard = () => {
        DOM.board.innerHTML = '';
        board = []; 
        for (let i = 0; i < 9; i++){
            const sell = new Sell();
            DOM.board.appendChild(sell.dom);
            board.push(sell);
        }
    }
    const init = () => {
        DOM.board.style.cssText = 'display: flex';
        refillBoard();
    }
    return {
        getBoard,
        refillBoard,
        Sell,
        init,
    }
})();

const Logic = (() => {
    function Player(mark, name){
        this.mark = mark;
        this.name = name;
    }

    const player1 = new Player('X', 'Player 1');
    const player2 = new Player('O', 'Player 2');

    let turn = player1.name;
    const _changeTurn = () => {
        if (turn === player1.name) {
            turn = player2.name;
        } else {
            turn = player1.name;
        }
    }
    const makeMove = (sell) => {
        if (sell.mark === '') {  
            if (turn === player1.name) {
                sell.setMark(player1.mark);
                _changeTurn();
            } else {
                sell.setMark(player2.mark);
                _changeTurn();
            }
            lockElement(sell, 'single');
        }
        DOM.playerName.textContent = turn;
        if (checkWinner()) {
            lockElement(Gameboard.getBoard(), 'all');
            _changeTurn();
            DOM.playerName.textContent = `${turn} wins!`;
        } else if (boardFull()) {
            DOM.playerName.textContent = "It's a tie!";
        }
    }

    const lockElement = (elem, option) => {
        if (option === 'single') {
            elem.dom.classList.add('disabled');
        } 
        if (option === 'all') {
            elem.forEach(sell => {
                lockElement(sell, 'single');
            });
        }
    }

    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        return winConditions.some(comb => {
            const [a, b, c] = comb;
            return board[a].mark && board[a].mark === board[b].mark && board[a].mark === board[c].mark;
        });
    }

    const boardFull = () => {
        const board = Gameboard.getBoard();
        return board.every(sell => sell.mark !== '');
    }

    const startGame = () => {
        Gameboard.init();
        turn = player1.name;
        DOM.playerName.textContent = turn;
        DOM.playerName.style.cssText = 'display: flex';
        DOM.startBtn.style.cssText = 'display: none';
        DOM.menuBtn.style.cssText = 'display: flex';
        DOM.restartBtn.style.cssText = 'display: flex';
    }

    const backToMenu = () => {
        DOM.board.style.cssText = 'display: none';
        DOM.startBtn.style.cssText = 'display: flex';
        DOM.menuBtn.style.cssText = 'display: none';
        DOM.restartBtn.style.cssText = 'display: none';
        DOM.playerName.style.cssText = 'display: none';
    }
    return {
        makeMove,
        lockElement,
        startGame,
        backToMenu,
    }
})();