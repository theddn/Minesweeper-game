'use strict'

// static mines
function createStaticMines(board) {
    board[2][0].isMine = true
    board[2][1].isMine = true
}

function createMine(board) {
    var emptyPos = getEmptyPos(board)
    board[emptyPos.i][emptyPos.j].isMine = true

}

function createMines(board) {
    for (var i = 0; i < gLevel.MINES; i++) {
        createMine(board)
    }
    return board
}

function setMinesNegsCount(pos, board) {
    var minesAroundCount = 0
    const elCell = document.querySelector(`.cell-${pos.i}-${pos.j}`)

    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === pos.i && j === pos.j) continue
            if (board[i][j].isMine === true) minesAroundCount++
        }
    }

    return minesAroundCount
}
function expandShown(i, j) {
    for (var idx = i - 1; idx <= i + 1; idx++) {
        if (idx < 0 || idx >= gBoard.length) continue
        for (var jdx = j - 1; jdx <= j + 1; jdx++) {
            if (jdx < 0 || jdx >= gBoard[0].length) continue
            if (idx === i && jdx === j) continue
            if (gBoard[idx][jdx].isShown) continue
            gBoard[idx][jdx].isShown = true
            if (gBoard[idx][jdx].minesAroundCount === 0) expandShown(idx, jdx)
        }
    }
    renderBoard(gBoard)
}

function createMineNeg(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount({ i, j }, board)
        }
    }
}
