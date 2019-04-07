var board, menu, net;
$(document).ready(function () {
    net = new Net();
    board = new Board();
    menu = new Menu(board, net);
})