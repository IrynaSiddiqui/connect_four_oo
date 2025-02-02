/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Player {
  constructor(color) {
    this.color = color; // Store the color for each player
  }
}


class Game {
    constructor(player1, player2, height=6, width=7) {
        this.players = [player1, player2]
        this.WIDTH = width;
        this.HEIGHT = height;
        this.currPlayer = player1; // Start with player1        
        this.makeBoard();
        this.makeHtmlBoard();
        this.gameOver = false; // to track if the game is over
    }

    /** makeBoard: create in-JS board structure:
     *   board = array of rows, each row is array of cells  (board[y][x])
     */
    
    makeBoard() {
      this.board =[]; // Reset the board when a new game starts
      for (let y = 0; y < this.HEIGHT; y++) {
        // console.log(Array.from({length: WIDTH}))
        this.board.push(Array.from({ length: this.WIDTH }));
      }
    }
    
    /** makeHtmlBoard: make HTML table and row of column tops. */
    
    makeHtmlBoard() {
      const board = document.getElementById('board');
      // make column tops (clickable area for adding a piece to that column)
      board.innerHTML=''; // Clear any existing board for a new game
      const top = document.createElement('tr');
      top.setAttribute('id', 'column-top');

    // store a reference to the handleClick bound function 
    // so that we can remove the event listener correctly later
      this.handleGameClick = this.handleClick.bind(this); 
      top.addEventListener('click', this.handleGameClick);
    
      for (let x = 0; x < this.WIDTH; x++) {
        const headCell = document.createElement('td');
        headCell.setAttribute('id', x);
        top.append(headCell);
      }
    
      board.append(top);
    
      // make main part of board
      for (let y = 0; y < this.HEIGHT; y++) {
        const row = document.createElement('tr');
    
        for (let x = 0; x < this.WIDTH; x++) {
          const cell = document.createElement('td');
          cell.setAttribute('id', `${y}-${x}`);
          row.append(cell);
        }
    
        board.append(row);
      }
    }
    
    /** findSpotForCol: given column x, return top empty y (null if filled) */
    
    findSpotForCol(x) {
      for (let y = this.HEIGHT - 1; y >= 0; y--) {
        if (!this.board[y][x]) {
          return y;
        }
      }
      return null;
    }
    
    /** placeInTable: update DOM to place piece into HTML table of board */
    
    placeInTable(y, x) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.style.backgroundColor = this.currPlayer.color; // Use the current player's color
      piece.style.top = -50 * (y + 2); // DON'T Understand?????
    
      const spot = document.getElementById(`${y}-${x}`);
      //console.log(spot)
      spot.append(piece);
    }
    
    /** endGame: announce game end */
    
    endGame(msg) {
      alert(msg);
      const top = document.querySelector('#column-top');
      top.removeEventListener('click', this.handleGameClick);
    }
    
    /** handleClick: handle click of column top to play piece */
    
    handleClick(evt) {
      // get x from ID of clicked cell
      const x = +evt.target.id;
    // console.log(evt.target)
      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }
    
      // place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);
      
      // check for win
      if (this.checkForWin()) {
        this.gameOver = true;
        return this.endGame(`Player with color ${this.currPlayer.color} won!`);
      }
      
      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Tie!');
      }
        
      // switch players
      this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    }
    
    /** checkForWin: check board cell-by-cell for "does a win start here?" */
    
    checkForWin() {
      const _win =  cells =>
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer
          cells.every(
          ([y, x]) =>
            y >= 0 &&
            y < this.HEIGHT &&
            x >= 0 &&
            x < this.WIDTH &&
            this.board[y][x] === this.currPlayer
        );
    
      for (let y = 0; y < this.HEIGHT; y++) {
        for (let x = 0; x < this.WIDTH; x++) {
          // get "check list" of 4 cells (starting here) for each of the different
          // ways to win
          const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
          const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
          const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
          const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
    
          // find winner (only checking each win-possibility as needed)
          if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
            return true;
          }
        }
      }
    }
    
  }


  // Function to start a new game
document.getElementById('start-game').addEventListener('click', () => {
  let player1 = new Player(document.getElementById('p1-color').value);
  let player2 = new Player(document.getElementById('p2-color').value);
  new Game(player1, player2);
  //console.log(new Game (player1, player2))
  //console.log(player1)
  //console.log(player2)
}) 