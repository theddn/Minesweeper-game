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
    const board = createMat(gLevel.SIZE, gLevel.SIZE)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
        }
    }
    // createStaticMines(board)
    createMines(board)
    createMineNeg(board)

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
    getShownCount(board)
    const elBoard = document.querySelector('.game-board')
    elBoard.innerHTML = strHTML
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

function getClassName(pos) {
    const cellClass = `cell-${pos.i}-${pos.j}`
    return cellClass
}

function onCellRightClick(elCell, i, j) {
    gGame.isOn = true
    document.addEventListener('contextmenu', e => {
        e.preventDefault()
        // console.log("right button clicked");
    })
    //flag toggle
    if (gBoard[i][j].isShown === false) {
        // createFlag(i, j)
        gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    }
    renderBoard(gBoard)
}

function onCellClicked(elCell, i, j) {
    if (gBoard[i][j].isMarked) return
    gBoard[i][j].isShown = true
    checkIsLose(i, j)
    if (gBoard[i][j].minesAroundCount === 0) {
        expandShown(i, j)
    }
    renderBoard(gBoard)
}

function changeLevel(num) {
    switch (num) {
        case -1:
            gLevel.SIZE = 4
            gLevel.MINES = 2
            break;
        case 0:
            gLevel.SIZE = 8
            gLevel.MINES = 14
            break;
        case 1:
            gLevel.SIZE = 12
            gLevel.MINES = 32
            break;
    }
    onInit()
}

function checkIsLose(i, j) {
    const elMainBtn = document.querySelector('.play')
    const elPanel = document.querySelector('.panel')
    if (gBoard[i][j].isMine === true) {
        elMainBtn.innerHTML = DEAD_SMILEY
        elPanel.classList.add('hide')
        gGame.isOn = false
        console.log('game over');
        showAllMines()
    }

}

function showAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine === true) {
                gBoard[i][j].isShown = true

            }
        }
    }
}

function getShownCount(board) {
    const elShownCount = document.querySelector('.shown-count')
    var count = gLevel.MINES
    var markCount = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (gBoard[i][j].isMarked) count--
            if (gBoard[i][j].isMarked && gBoard[i][j].isMine) markCount++
        }
    }
    gGame.shownCount = count
    gGame.markedCount = markCount
    elShownCount.innerHTML = count
}

function mainButton(elMainBtn) {
    const elPanel = document.querySelector('.panel')
    elMainBtn = document.querySelector('.play')
    elMainBtn.innerHTML = SMILEY
    elPanel.classList.remove('hide')
    onInit()
}
