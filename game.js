'use strict'

var gameOfLife = {
  width: 12,
  height: 12,
  stepInterval: null,

  createAndShowBoard: function () {

    var dimensionsButton = document.getElementById('submit');

    var dimensions = function () {
      var height = document.getElementById('height');
      var width = document.getElementById('width');
      gameOfLife.width = width.value;
      gameOfLife.height = height.value;
      document.getElementsByClassName('dimensions')[0].style.display = "none";

      // create <table> element
      document.getElementById("control_panel").style.display = "block";
      var goltable = document.createElement("tbody");
      debugger;
      // build Table HTML
      var tablehtml = '';
      for (var h=0; h<gameOfLife.height; h++) {
        tablehtml += "<tr id='row+" + h + "'>";
        for (var w=0; w<gameOfLife.width; w++) {
          tablehtml += "<td data-status='dead' future-status='' id='" + w + "-" + h + "'></td>";
        }
        tablehtml += "</tr>";
      }
      goltable.innerHTML = tablehtml;

      var board = document.getElementById('board');
      board.appendChild(goltable);

      gameOfLife.setupBoardEvents();
    }

    dimensionsButton.onclick = dimensions;
  },

  forEachCell: function (iteratorFunc) {
    for (var x = 0; x < this.width; x++){
      for (var y = 0; y < this.height; y++) {
        var cellCoords = x+"-"+y;
        var targetElement = document.getElementById(cellCoords);
        iteratorFunc(targetElement, x, y);
      }
    }
  },


  setupBoardEvents: function() {

    var onCellClick = function (e) {

      if (this.getAttribute('data-status') == 'dead') {
        this.className = "alive";
        this.setAttribute('data-status', 'alive');
      } else {
        this.className = "dead";
        this.setAttribute('data-status', 'dead');
      }
    };

    var allCells = document.querySelectorAll("td");
    for (var i = 0; i < allCells.length; i ++) {
      allCells[i].onclick = onCellClick;
    }

    var stepButton = document.getElementById('step_btn');

    stepButton.onclick = this.step;

    var playButton = document.getElementById('play_btn');

    playButton.onclick = this.enableAutoPlay;

    var clearButton = document.getElementById('clear_btn');

    var clearCells = function (cell) {
      cell.setAttribute('data-status', 'dead');
      cell.className = 'dead';
      cell.setAttribute('future-status', '');
    }

    var clearFunction = this.forEachCell.bind(this, clearCells);

    clearButton.onclick = clearFunction;

    var randomButton = document.getElementById('reset_btn');

    var randomIterator = function (cell) {
      var randNum =  Math.floor(Math.random() * 100);
      if (randNum < 25) {
        cell.setAttribute('data-status', 'alive');
        cell.className = 'alive';
      }
    }

    randomButton.onclick = function () {
      clearFunction();
      gameOfLife.forEachCell(randomIterator);
    }

  },

  step: function () {

    var setFutureStatus = function (cell, x, y) {
      var aliveNeighbors = 0;
      for (var i = x-1; i <= x+1; i++) {
        for (var j = y-1; j <= y+1; j++) {
          if(!(i === x && j === y)) {
            var neighbor = document.getElementById(i+"-"+j);
            if (neighbor) {
              if (neighbor.getAttribute('data-status') === "alive") {
                aliveNeighbors ++;
              }
            }
          }
        }
      }

      if ((aliveNeighbors > 3 || aliveNeighbors < 2) && (cell.getAttribute('data-status') === "alive")) {
        cell.setAttribute('future-status', 'dead');
      } else if (aliveNeighbors === 3 && cell.getAttribute('data-status') === 'dead') {
        cell.setAttribute('future-status', 'alive');
      }
    }

    gameOfLife.forEachCell(setFutureStatus);

    var changeStatus = function () {
      for ( var x = 0; x < gameOfLife.width; x++) {
        for (var y = 0; y < gameOfLife.height; y++) {
          var targetElement = document.getElementById(x+"-"+y);
          var futureStatus = targetElement.getAttribute('future-status');
          if (futureStatus !== "") {
            targetElement.setAttribute('data-status', futureStatus);
            targetElement.className = futureStatus;
          }
        }
      }
    }
    changeStatus();
  },

  enableAutoPlay: function () {
    gameOfLife.gameToggle(gameOfLife.playGame, gameOfLife.stopGame);
  },

  // Helper functions

  interval: 0,

    playGame: function () {
      gameOfLife.interval = setInterval(gameOfLife.step, 200);
    },

    stopGame: function () {
      clearInterval(gameOfLife.interval);
    },

  isTrue: true,
  gameToggle: function (startFunc, stopFunc) {
    if (gameOfLife.isTrue) {
      startFunc();
      gameOfLife.isTrue = false;
    } else {
      stopFunc();
      gameOfLife.isTrue = true;
    }
  },
};

gameOfLife.createAndShowBoard();

