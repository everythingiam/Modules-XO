const Gameboard = (() => {
    var board = [];    

    function Sell(){
        this.dom = document.createElement('div');
        this.dom.className = "sell";
        this.mark = '';

        this.setMark = function(mark){
            this.mark = mark;
        }
        
        const _showMark = () => {
            const hh = document.createElement('h1');
            hh.textContent = this.mark;
            this.dom.appendChild(hh);
        }

        this.dom.addEventListener('click', () => {
            if (!this.dom.classList.contains('disabled')) {
                Logic.makeMove(this);  
                _showMark();
            }
        });
    }

    const boardDOM = document.querySelector('.board');
    
    const getBoard = () => {
        return board;
    }

    const refillBoard = () => {
        boardDOM.innerHTML = '';
        board = []; 
        for (let i = 0; i < 9; i++){
            const sell = new Sell();
            boardDOM.appendChild(sell.dom);
            board.push(sell);
        }
    }

    return {
        getBoard,
        refillBoard,
        Sell,
        board
    }
})();
console.log(Gameboard.getBoard());

const Logic = (() => {
    function Player(mark){
        this.mark = mark;
    }

    const player1 = new Player('X');
    const player2 = new Player('O');

    let turn = 'player 1';

    const makeMove = (sell) => {
        if (sell.mark === '') {  
            if (turn === 'player 1') {
                sell.setMark(player1.mark);
                turn = 'player 2';
            } else {
                sell.setMark(player2.mark);
                turn = 'player 1';
            }
            lockElement(sell, 'single');
        }
        if (checkWinner()) {
            lockElement(Gameboard.getBoard(), 'all');
            console.log(turn, ' wins');
        } else if (boardFull()) {
            console.log("It's a tie");
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
        [2, 4, 6]
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

    const startBtn = document.querySelector('.start');
    startBtn.addEventListener('click', () => {
        Gameboard.refillBoard();
        turn = 'player 1';
    });

    return {
        makeMove,
        lockElement,
    }
})();
