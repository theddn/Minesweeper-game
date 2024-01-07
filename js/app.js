'use strict'

const WALL = 'WALL'
const FLOOR = 'FLOOR'
const PORTAL = 'PORTAL'

const BALL = 'BALL'
const GAMER = 'GAMER'
const GLUE = 'GLUE'

const GAMER_IMG = '<img src="img/gamer.png">'
const BALL_IMG = '<img src="img/ball.png">'
const GLUE_IMG = '<img src="img/candy.png">'

// Model:
var gBoard
var gGamerPos
var gIsGlued
var gBallCount
var gBallInterval
var gGlueInterval
var gCollectedBalls

function initGame() {
	gGamerPos = { i: 2, j: 9 }
    gIsGlued = false
	gBoard = buildBoard()
    gCollectedBalls = 0
	
    renderBoard(gBoard)

    gBallInterval = setInterval(addBall, 2000)
    gGlueInterval = setInterval(addGlue, 5000)
    
    const elModal = document.querySelector('.modal')
    elModal.classList.add('hidden')
}

function buildBoard() {
    const board = createMat(10, 12)

    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[i].length; j++){
            if(i === 0 || i === board.length - 1 || j === 0 || j === board[i].length - 1){
                board[i][j] = { type: WALL, gameElement: null }
            } else {
                board[i][j] = { type: FLOOR, gameElement: null }
            }
        }
    }
    board[0][5].type = PORTAL
    board[board.length - 1][5].type = PORTAL
    
    board[5][0].type = PORTAL
    board[5][board[0].length - 1].type = PORTAL

    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER

    board[6][6].gameElement = BALL
    board[3][3].gameElement = BALL
    gBallCount = 2

    return board
}

// Render the board to an HTML table
function renderBoard(board) {

	const elBoard = document.querySelector('.board')
	var strHTML = ''
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n'
		for (var j = 0; j < board[0].length; j++) {
			const currCell = board[i][j]

			var cellClass = getClassName({ i, j })

			if (currCell.type === FLOOR || currCell.type === PORTAL) cellClass += ' floor'
			else if (currCell.type === WALL) cellClass += ' wall'

			// strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n'
			strHTML += `\t<td class="cell ${cellClass}" onclick="moveTo(${i},${j})">`

			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG
			}

			strHTML += '</td>\n'
		}
		strHTML += '</tr>\n'
	}
	elBoard.innerHTML = strHTML
}

function addBall() {
    const pos = getEmptyPos()
    if(!pos) return

    gBoard[pos.i][pos.j].gameElement = BALL
    gBallCount++

    renderCell(pos, BALL_IMG)

    updateNegCount()
}

function addGlue() {
    const pos = getEmptyPos()
    if(!pos) return

    // Model
    gBoard[pos.i][pos.j].gameElement = GLUE

    // DOM
    renderCell(pos, GLUE_IMG)

    setTimeout(() => {
        if(gBoard[pos.i][pos.j].gameElement !== GLUE) return
        // Model
        gBoard[pos.i][pos.j].gameElement = ''
        // DOM
        renderCell(pos, '')
    }, 3000)
}

function getEmptyPos() {
    var emptyPositions = []

    for(var i = 1; i < gBoard.length - 1; i++){
        for(var j = 1; j < gBoard[i].length - 1; j++){
            var currCell = gBoard[i][j]
            if(!currCell.gameElement) emptyPositions.push({ i, j })
        }
    }
    const idx = getRandomInt(0, emptyPositions.length)
    return emptyPositions[idx]
}

// Move the player to a specific location
function moveTo(i, j) {

    if(gIsGlued) return 

    if(i < 0) i = gBoard.length - 1
    if(i === gBoard.length) i = 0

    if(j < 0) j = gBoard[0].length - 1
    if(j === gBoard[0].length) j = 0

    const fromCell = gBoard[gGamerPos.i][gGamerPos.j]
	const toCell = gBoard[i][j]

	if (toCell.type === WALL) return

	// Calculate distance to make sure we are moving to a neighbor cell
	const iAbsDiff = Math.abs(i - gGamerPos.i)
	const jAbsDiff = Math.abs(j - gGamerPos.j)

	// If the clicked Cell is one of the four allowed

	// if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {
	if (iAbsDiff + jAbsDiff === 1 || fromCell.type === PORTAL) {

		if (toCell.gameElement === BALL) {
            // Model
            gCollectedBalls++
            gBallCount--
            // DOM
            const elSpan = document.querySelector('.collected-balls')
            elSpan.innerText = gCollectedBalls
		} else if (toCell.gameElement === GLUE) {
            gIsGlued = true
            setTimeout(() => gIsGlued = false, 3000)
        }

		// TODO: Move the gamer

        // Model - origin
        fromCell.gameElement = null

        // DOM - origin
        renderCell(gGamerPos, '')
        
        // Model - destination
        toCell.gameElement = GAMER
        
        // DOM - destination
        renderCell({ i, j }, GAMER_IMG) // { i: i, j: j }

        // Model = gGamerPos
        gGamerPos = { i, j }

        updateNegCount()
    
	} else console.log('Bad Move', iAbsDiff, jAbsDiff)
    if(gBallCount === 0) endGame()
}

function countBallsAround(pos) {
    var count = 0

    for(var i = pos.i - 1; i <= pos.i + 1; i++){
        if(i < 0 || i >= gBoard.length) continue
        for(var j = pos.j - 1; j <= pos.j + 1; j++){
            if(j < 0 || j >= gBoard[i].length) continue
            if(i === pos.i && j === pos.j) continue
            if(gBoard[i][j].gameElement === BALL) count++
        }
    }
    return count
}

function updateNegCount() {
    const negCount = countBallsAround(gGamerPos)
    const elSpan = document.querySelector('.balls-around')
    elSpan.innerText = negCount
}

function endGame() {
    const elModal = document.querySelector('.modal')

    clearInterval(gBallInterval)
    clearInterval(gGlueInterval)

    elModal.classList.remove('hidden')
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	const cellSelector = '.' + getClassName(location)
	const elCell = document.querySelector(cellSelector)
	elCell.innerHTML = value
}

// Move the player by keyboard arrows
function handleKey(event) {
	const i = gGamerPos.i
	const j = gGamerPos.j

	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1)
			break
		case 'ArrowRight':
			moveTo(i, j + 1)
			break
		case 'ArrowUp':
			moveTo(i - 1, j)
			break
		case 'ArrowDown':
			moveTo(i + 1, j)
			break
	}
}

// Returns the class name for a specific cell
function getClassName(position) {
	const cellClass = `cell-${position.i}-${position.j}`
	return cellClass
}