const SIZE = 5;
  let calledNumbers = new Set();
  let player1, player2;
  let gameOver = false;

  // ✅ Correct: Both players use numbers 1–25, different layout
  function createBoard() {
    const nums = Array.from({ length: 25 }, (_, i) => i + 1); // 1 to 25
    nums.sort(() => Math.random() - 0.5); // shuffle

    const board = [];
    for (let i = 0; i < SIZE; i++) {
      board.push(nums.slice(i * SIZE, (i + 1) * SIZE));
    }
    return board;
  }

  function renderBoard(id, board) {
    const container = document.getElementById(id);
    container.innerHTML = '';
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = board[i][j];
        container.appendChild(cell);
      }
    }
  }

  function markBoard(board, number, boardId) {
    const cells = document.getElementById(boardId).children;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (board[i][j] === number) {
          board[i][j] = 0;
          const idx = i * SIZE + j;
          cells[idx].classList.add('marked');
          cells[idx].textContent = 'X';
        }
      }
    }
  }

  function checkBingo(board) {
    let count = 0;
    for (let i = 0; i < SIZE; i++) {
      if (board[i].every(val => val === 0)) count++;
      if (board.map(row => row[i]).every(val => val === 0)) count++;
    }
    if (board.every((row, i) => row[i] === 0)) count++;
    if (board.every((row, i) => row[SIZE - 1 - i] === 0)) count++;
    return count >= 5;
  }

  function submitNumber() {
    if (gameOver) return;

    const input = document.getElementById('numberInput');
    const num = parseInt(input.value);
    input.value = '';
    input.focus();

    if (!num || num < 1 || num > 25) {
      alert("Please enter a number between 1 and 25.");
      return;
    }

    if (calledNumbers.has(num)) {
      alert("This number has already been called.");
      return;
    }

    calledNumbers.add(num);
    markBoard(player1, num, 'board1');
    markBoard(player2, num, 'board2');

    if (checkAndEnd()) return;

    document.getElementById('turnLabel').textContent = "Computer's Turn...";
    setTimeout(computerTurn, 1000);
  }

  function computerTurn() {
    if (gameOver) return;

    let num;
    do {
      num = Math.floor(Math.random() * 25) + 1;
    } while (calledNumbers.has(num));

    alert("Computer called: " + num);
    calledNumbers.add(num);

    markBoard(player1, num, 'board1');
    markBoard(player2, num, 'board2');

    if (checkAndEnd()) return;

    document.getElementById('turnLabel').textContent = "Player 1's Turn";
  }

  function checkAndEnd() {
    const p1Bingo = checkBingo(player1);
    const p2Bingo = checkBingo(player2);

    if (p1Bingo || p2Bingo) {
      gameOver = true;
      document.getElementById('board2').classList.remove('hidden-board');

      const result = document.getElementById('result');
      if (p1Bingo && p2Bingo) {
        result.textContent = "🤝 It's a draw! Both got BINGO!";
      } else if (p1Bingo) {
        result.textContent = "🎉 Player 1 wins!";
      } else {
        result.textContent = "💻 Computer wins!";
      }
      return true;
    }
    return false;
  }

  function restartGame() {
    player1 = createBoard();
    player2 = createBoard();
    calledNumbers.clear();
    gameOver = false;

    renderBoard('board1', player1);
    renderBoard('board2', player2);
    document.getElementById('board2').classList.add('hidden-board');
    document.getElementById('turnLabel').textContent = "Player 1's Turn";
    document.getElementById('result').textContent = '';
  }

  // Initial setup
  restartGame();