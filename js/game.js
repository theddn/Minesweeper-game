'use strict'

const EMPTY = ''
const MINE = '💣'
const FLAG = '🚩'
const SMILEY = '😃'
const DEAD_SMILEY = '🤯'
const WIN_SMILEY = '😎'

// The Model
var gBoard
var gTimer

const GAME = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

const LVL = {
    SIZE: 4,
    MINES: 2
}

function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {
    const board = []
    const changeLevel = LVL.SIZE

    for (var i = 0; i < changeLevel; i++) {
        const row = []
        for (var j = 0; j < changeLevel; j++) {
            row.push({ minesAroundCount: 0, isShown: false, isMine: false, isMarked: false })
        }
        board.push(row)
    }
    createMines(board)

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
        strHTML += `<tr>\n`
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            var cellClass = getClassName({ i, j })
            var cellContent = currCell.isShown ? currCell.minesAroundCount : ''
            if (cellContent === 0) cellContent = EMPTY
            if (currCell.isMarked) { cellContent = FLAG }
            if (currCell.isShown) cellClass += ' shown'
            if (currCell.isMine && currCell.isShown) {
                cellContent = MINE
                cellClass += ' bomb'
            }
            strHTML += `\t<td class="cell ${cellClass}" onclick="onCellClicked(this,${i},${j})"
             oncontextmenu="onCellRightClick(this,${i},${j})"
             >${cellContent}</td>\n`
        }
        strHTML += `</tr>\n`
    }
    getShownCount()
    const elBoard = document.querySelector('.game-board')
    elBoard.innerHTML = strHTML
}

function getEmptyPos(board) {
    const emptyPos = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isMine)
                emptyPos.push({ i, j })
        }
    }
    const idx = getRandomInt(0, emptyPos.length)
    return emptyPos[idx]
}

function getClassName(pos) {
    const cellClass = `cell-${pos.i}-${pos.j}`
    return cellClass
}
//TODO: 
function renderCell(pos, board) {
    const cellSelector = '.' + getClassName(location)
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}

function onCellRightClick(elCell,i, j) {
    document.addEventListener('contextmenu', e => {
        e.preventDefault()
    })
    //flag toggle
    if (gBoard[i][j].isShown === false) {
        gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    }
    renderBoard(gBoard)
}

function onCellClicked(i, j) {
    if (gBoard[i][j].isMarked) return
    gBoard[i][j].isShown = true
    checkIsLose(i, j)
    if (gBoard[i][j].minesAroundCount === 0) {
        expandShown(i, j)
    }
    renderBoard(gBoard)
}

function getShownCount() {
    const elShownCount = document.querySelector('.shown-count')
    var count = LVL.MINES
    var markCount = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMarked) count--
            if (gBoard[i][j].isMarked && gBoard[i][j].isMine) markCount++
        }
    }
    GAME.shownCount = count
    GAME.markedCount = markCount
    elShownCount.innerHTML = count
    checkIsWin()
}

function checkIsLose(i, j) {
    const elMainBtn = document.querySelector('.play')
    if (gBoard[i][j].isMine) {
        elMainBtn.innerHTML = DEAD_SMILEY
        GAME.isOn = false
        showAllMines()
    }
}

function showAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true
            }
        }
    }
}

function checkIsWin() {
    const elMainBtn = document.querySelector('.play')
    if (GAME.shownCount === 0 && (GAME.markedCount === LVL.MINES)) {
        console.log('win');
        elMainBtn.innerHTML = WIN_SMILEY
        GAME.isOn = false
    }
}

function mainButton(elMainBtn) {
    const elPanel = document.querySelector('.panel')

    GAME.isOn = true
    elMainBtn = document.querySelector('.play')
    elMainBtn.innerHTML = SMILEY
    onInit()
}

function changeLevel(num) {
    switch (num) {
        case 4:
            LVL.SIZE = 4
            LVL.MINES = 2
            break;
        case 8:
            LVL.SIZE = 8
            LVL.MINES = 14
            break;
        case 12:
            LVL.SIZE = 12
            LVL.MINES = 32
            break;
    }
    onInit()
}

