'use strict'

const EMPTY = ''
const ROOF = 'ROOF'
const MINE = '💣'
const FLAG = '🚩'

// The Model
var gBoard
var gMinePos
var gMinesCount

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

// var gLevel = {
//     SIZE: 4,
//     MINES: 2
// }

function onInit() {
    gBoard = buildBoard()

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
    // board[1][2].isMine = true
    // board[2][1].isMine = true
    // board[3][2].isMine = true
    addsMines(board)
    console.log(board);
    return board
}
function addsMines(board) {
    board[1][2].isMine = true
    board[2][1].isMine = true
    board[3][2].isMine = true
    setMinesNegsCount(board)

}
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            var cellClass = getClassName({ i, j })
            strHTML += `\t<td class="cell ${cellClass}"
            onclick = "onCellClicked(this,${i},${j})">`
            if(currCell.isMine === true) strHTML += MINE
            if (currCell.isMine === true)
                setMinesNegsCount({ i, j }, board)
            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

// TODO: store number in model + dom 
function setMinesNegsCount(pos, board) {
    var minesCount = 0

    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === pos.i && j === pos.j) continue

            if (board[i][j].isMine === true) minesCount++

        }
    }
    console.log(pos, minesCount);
    return minesCount
}

function onCellClicked(elCell, i, j) {
    elCell = document.querySelector('.cell')
    const cell = `cell-${i}-${j}`
    console.log(cell);
}

//  Returns the class name for a specific cell
function getClassName(pos) {
    const cellClass = `cell-${pos.i}-${pos.j}`
    return cellClass
}


