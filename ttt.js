var currentPlayer = 'X';
var isBot = true;
var playerOne = "X";
var playerTwo = "O";
var board = [];
var playerOneScore = 0;
var playerTwoScore = 0;

function initialState() {
  board = [];
  currentPlayer = playerOne;
  var elements = $(".ttt-element");
  console.log(elements);
  for(var i = 0; i < 9; i++) {
    board.push('0');
    $(elements[i]).text("");
  }
}

function updateScore() {
  if(currentPlayer === playerOne) {
    playerOneScore++;
    $(".score-player-one").text(""+playerOneScore);
  }
  else {
    playerTwoScore++;
    $(".score-player-two").text(""+playerTwoScore);
  }
}

function clearScore() {
  playerOneScore = 0;
  playerTwoScore = 0;
  $(".score-player-one").text("0");
  $(".score-player-two").text("0");
}

function victoryCondition(player, _board) {
  if(player === _board[0] && _board[0] === _board[1] && _board[1] === _board[2] ||
    player === _board[3] && _board[3] === _board[4] && _board[4] === _board[5] ||
    player === _board[6] && _board[6] === _board[7] && _board[7] ===_board[8])
    return true;
  if(player === _board[0] && _board[0] === _board[4] && _board[4] === board[8] ||
     player === _board[2] && _board[2] === _board[4] && _board[4] ===board[6])
    return true
  if(player === _board[0] && _board[0] === _board[3] && _board[3] === _board[6] ||
          player === _board[1] && _board[1] === _board[4] && _board[4] === _board[7] ||
          player === _board[2] && _board[2] === _board[5] && _board[5] === _board[8])
          return true;
  return false;

}

function nextTurn() {
  currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
}

function playerTurn(choice) {
  var square = +$(choice).attr('id')
  if(board[square] === '0') {
    board[square] = currentPlayer;
    $(choice).text(currentPlayer);
    if(victoryCondition(currentPlayer, board) === true) {
      console.log(currentPlayer  + " WINS!");
      updateScore();
      initialState();
    }
    else if($.inArray('0', board) === -1) {
      console.log("DRAW");
      initialState();
    }
    else nextTurn();
    if(isBot && currentPlayer === playerTwo)
      aiTurn();
 }
}

function aiTurn() {
  if($.inArray('0', board) !== -1) {
    var tmp = board.slice(0);
    var choice = miniMax(tmp, playerTwo, 4, true);
    board[choice] = playerTwo;
    if(!victoryCondition(currentPlayer, board))
      if($.inArray('0', board) === -1) {
        console.log("DRAW");
        initialState();
      }
      else {
        $(".ttt-element#"+choice).text("O");
        nextTurn();
      }
    else {
      console.log(currentPlayer+" WINS!", board, choice);
      updateScore();
      initialState();
    }
  }
}

function miniMax(_board, player, depth, initial) {
  var choiceValue = 0;
  var total = 0;

  if($.inArray('0', _board) === -1) {
    if(victoryCondition(player, _board))
      if(player === playerTwo) return 10;
      else return -10;
    else return 0;
  }
  else {
    if(victoryCondition(player, _board)) {
     if(player === playerTwo)
      return 10;
     else return -10;
    }
    if(depth <= 0) return 0;
  }

  for(var i = 0; i < _board.length; i++){
    if(_board[i] === '0') {
      var tmp = _board.slice(0);
      tmp[i] = player;
      if(player === playerTwo) {
        var max = miniMax(tmp, playerOne, depth-1, false);
        if(max >= 0)
          if(initial) choiceValue = i;
          total += max;
        }
      if(player === playerOne) {
        var max = miniMax(tmp, playerTwo, depth-1, false);
        if(max <= 0) total += max;
      }
    }
  }

  if(initial) return choiceValue;
  else {
    return total;
  }
}



$(function(){

  initialState();
  
  $(".ttt-element").on("click", function(){
    playerTurn($(this));
  });

  $(".multiplayer").on("click", function(){
    isBot = isBot ? false : true;
    $(".multiplayer-text").text($(".multiplayer-text").text() === "MULTIPLAYER" ? "SINGLE" : "MULTIPLAYER");
    clearScore();
    initialState();
  });

  $(".reset").on("click", function() {
    clearScore();
    initialState();
  })

});
