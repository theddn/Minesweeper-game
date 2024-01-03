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

var gLevel = {
    SIZE: 4,
    MINES: 2
}

function onInit() {
    gBoard = buildBoard()
    addsMines()
    renderBoard(gBoard)
}

function buildBoard() {
    //TODO: inject: board size
    const board = createMat(4, 4)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
        }
    }
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount({ i, j }, board)
        }
    }

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
            if (currCell.isMine && currCell.isShown) cellContent = MINE

            strHTML += `\t<td class="cell ${cellClass}" onclick="onCellClicked(this,${i},${j})">`
            strHTML += cellContent
            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    // console.log(elBoard);
}
// TODO: 
function addsMines() {
    const emptyPos = getEmptyPos()
    gBoard[emptyPos.i][emptyPos.j].isMine = true
}

function getEmptyPos() {
    const emptyPos = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
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

function onCellClicked(elCell, i, j) {
    gBoard[i][j].isShown = true
    renderBoard(gBoard)
    if (gBoard[i][j].minesAroundCount === 0 && gBoard[i][j].isMine === false) {
        exposeNeg(i, j)
    }
}

function exposeNeg(rowIdx, colIdx) {

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

function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location)
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}

function getClassName(pos) {
    const cellClass = `cell-${pos.i}-${pos.j}`
    return cellClass
}


