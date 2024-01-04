'use strict'

const EMPTY = ''
const MINE = '💣'
const FLAG = '🚩'

// The Model
var gBoard


const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

const gLevel = {
    SIZE: 4,
    MINES: 2
}

function onInit() {

    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {
    //TODO: inject: board size
    const board = createMat(gLevel.SIZE, gLevel.SIZE)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
        }
    }
    // createStaticMines(board)
    createMines(board)
    createMineNeg(board)
    // console.log(board);
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            var cellClass = getClassName({ i, j })
            var cellContent = currCell.isShown ? currCell.minesAroundCount : ''
            if (currCell.isMarked) cellContent = FLAG
            if (currCell.isMine && currCell.isShown) cellContent = MINE
            strHTML += `\t<td class="cell ${cellClass}" onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellRightClick(this,${i},${j})">${cellContent}</td>\n`
        }
        strHTML += '</tr>\n'
    }
    const elBoard = document.querySelector('.board')

    elBoard.innerHTML = strHTML

}
// hint
function createStaticMines(board) {
    board[2][0].isMine = true
    board[2][1].isMine = true
}

function createMines(board) {
    for (var i = 0; i < gLevel.MINES; i++) {
        createMine(board)
    }
}

function createMine(board) {
    const emptyPos = getEmptyPos(board)
    board[emptyPos.i][emptyPos.j].isMine = true
}

function getEmptyPos(board) {
    var emptyPos = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            emptyPos.push({ i, j })
        }
    }
    const idx = getRandomInt(0, emptyPos.length - 1)
    return emptyPos[idx]
}

function setMinesNegsCount(pos, board) {
    var minesAroundCount = 0

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

function expandShown(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            gBoard[i][j].isShown = true
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

function getClassName(pos) {
    const cellClass = `cell-${pos.i}-${pos.j}`
    return cellClass
}

function onCellClicked(elCell, i, j) {
    gBoard[i][j].isShown = true
    if (gBoard[i][j].minesAroundCount === 0 && gBoard[i][j].isMine === false) {
        expandShown(i, j)
    }
    renderBoard(gBoard)
}

function onCellRightClick(elCell, i, j) {
    const contextMenu = document.querySelector('.elCell')
    document.addEventListener('contextmenu', e => {
        e.preventDefault()
        // console.log("right button clicked");
    })
    if (gBoard[i][j].isShown === false) {
        createFlag(i, j)
    }
}

function createFlag(i, j) {
    if (gBoard[i][j].isMarked === false) gBoard[i][j].isMarked = true
    else gBoard[i][j].isMarked = false
    renderBoard(gBoard)
}

function changeLevel(num) {
    switch (num) {
        case 1:
            gLevel.SIZE = 4
            gLevel.MINES = 2
            break;
        case 2:
            gLevel.SIZE = 8
            gLevel.MINES = 14
            break;
        case 3:
            gLevel.SIZE = 12
            gLevel.MINES = 32
            break;
    }
    onInit()
}

