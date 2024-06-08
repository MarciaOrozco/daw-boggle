document.addEventListener("DOMContentLoaded", function () {
  var board = document.getElementById("boggle-board");
  var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (var i = 0; i < 4; i++) {
    var row = document.createElement("tr");
    for (var j = 0; j < 4; j++) {
      var cell = document.createElement("td");
      cell.textContent = letters.charAt(
        Math.floor(Math.random() * letters.length)
      );
      row.appendChild(cell);
    }
    board.appendChild(row);
  }
});
