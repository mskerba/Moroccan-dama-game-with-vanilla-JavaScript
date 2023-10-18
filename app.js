
const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");
const width = 8
let playerGo = 'black'
let numberOfWhitePiece = 12
let numberOfBlackPiece = 12
playerDisplay.textContent = playerGo

infoDisplay.textContent = "black have a " + numberOfBlackPiece + " peice's and white have a " + numberOfWhitePiece + " peice's";  


const startPieces = [
    blackPiece, "", blackPiece, "", blackPiece, "", blackPiece, "",
    "", blackPiece, "", blackPiece, "", blackPiece, "", blackPiece,
    blackPiece, "", blackPiece, "", blackPiece, "", blackPiece, "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", whitePiece, "", whitePiece, "", whitePiece, "", whitePiece,
    whitePiece, "", whitePiece, "", whitePiece, "", whitePiece, "",
    "", whitePiece, "", whitePiece, "", whitePiece, "", whitePiece,
]


function createBoard() {
    startPieces.forEach((startPieces, i) => {
        const square = document.createElement('div')  
        square.innerHTML = startPieces
        square.firstChild?.setAttribute("draggable", "true")
        square.setAttribute("square-id", i)
        if(square.firstChild)
            square.setAttribute("style", "padding-top: 0px")
        square.classList.add('square')
        square.classList.add((((i % 16 >= 8) ? i - 1 : i) % 2) ? 'beige' : 'brown')
        gameBoard.append(square)
    }) 
    
}

createBoard()


const allSquares = document.querySelectorAll("#gameboard .square")
let startPostitionId
let toPositionId
let draggedElement
let pieceColor

allSquares.forEach(square => {
    square.addEventListener('dragstart',dragStart)
    square.addEventListener('dragover',dragOver)
    square.addEventListener('drop', dragDrop)
})


function dragStart(event) {
    
    startPostitionId = parseInt(event.target.parentNode.getAttribute('square-id'))
    draggedElement = event.target
    if (event.target.getAttribute("id"))
        pieceColor = event.target.getAttribute("id")
}


function dragOver(event) {
    event.preventDefault()
}


function isValid() {
    let isplein = document.querySelectorAll('#gameboard div.square')
    if(pieceColor == 'white')
    {
        if(toPositionId + 7 == startPostitionId || toPositionId + 9 == startPostitionId)
        return true
        if (toPositionId + 14 == startPostitionId && (isplein[toPositionId + 7].childNodes[0]?.getAttribute("id") !== 'black' ||  isplein[toPositionId + 7].childNodes[0]?.getAttribute("id") !== 'blackDiam'))
        {
            numberOfBlackPiece--
            let removed = isplein[toPositionId + 7].childNodes[0]
            removed.parentNode.removeChild(removed)
            return true
        }
        if( toPositionId + 18 == startPostitionId &&  (isplein[toPositionId + 9].childNodes[0]?.getAttribute("id") !== 'black' ||  isplein[toPositionId + 9].childNodes[0]?.getAttribute("id") !== 'blackDiam'))
        {
            numberOfBlackPiece--
            let removed = isplein[toPositionId + 9].childNodes[0]
            removed.parentNode.removeChild(removed)
            return true
        }
    }
    else
    {
        if(toPositionId - 7 == startPostitionId || toPositionId - 9 == startPostitionId)
            return true
        if (toPositionId - 14 == startPostitionId &&  (isplein[toPositionId - 7].childNodes[0]?.getAttribute("id") !== 'white' ||  isplein[toPositionId - 7].childNodes[0]?.getAttribute("id") !== 'whiteDiam'))
        {
            numberOfWhitePiece--
            let removed = isplein[toPositionId - 7].childNodes[0]
            removed.parentNode.removeChild(removed)
            return true
        }
        if( toPositionId - 18 == startPostitionId &&  (isplein[toPositionId - 9].childNodes[0]?.getAttribute("id") !== 'white' ||  isplein[toPositionId - 9].childNodes[0]?.getAttribute("id") !== 'whiteDiam') )
        {
            numberOfWhitePiece--
            let removed = isplein[toPositionId - 9].childNodes[0]
            removed.parentNode.removeChild(removed)
            return true
        }
    }
    return false;
}

function isValidDaim() {
    if (pieceColor !== 'blackDaim' && pieceColor !== 'whiteDaim')
        return false
    return true
}

function getFactor(start, from) {
    let ret
    if (start == 0 && from == 63)
        ret = 9
    else if (from == 0 && start == 63)
        ret = -9
    else if (!((start - from) % 9))
        ((start - from) > 0) ? ret =  -9 : ret = 9 
    else if (!((start - from) % 7))
        ((start - from) > 0) ? ret =  -7 : ret = 7
    return ret
}

function mvDaim() {
    let isplein = document.querySelectorAll('#gameboard div.square')
    let distance = startPostitionId - toPositionId
    let factor = getFactor(startPostitionId, toPositionId)
    let numberOfCont = -1

    if ((Math.abs(distance % 7)) && (Math.abs(distance % 9)))
        return false
    let start = startPostitionId

    while (start != toPositionId)
    {
        start += factor
        const addColor = isplein[start].childNodes[0]?.getAttribute("id")
        if (!isplein[start].childNodes[0])
            continue
        else if (numberOfCont != -1 || pieceColor == addColor + 'Daim')
            return false
        else if (numberOfCont == -1 )
            numberOfCont = start
    }
    if (numberOfCont != -1)
    {
        let removed = isplein[numberOfCont].childNodes[0]
        removed.parentNode.removeChild(removed)
        if (pieceColor === 'whiteDaim')
            numberOfBlackPiece--
        else
            numberOfWhitePiece--
    }
    return true
}

function isDaim()
{
    let isplein = document.querySelectorAll('#gameboard div.square')
    if (pieceColor == 'white' && toPositionId < 8)
    {
        let removed = isplein[toPositionId].childNodes[0]
        removed.parentNode.removeChild(removed)
        isplein[toPositionId].innerHTML = whiteDaim
        isplein[toPositionId].firstChild?.setAttribute("draggable", "true")
    }
    else if ( toPositionId > 56)
    {
        let removed = isplein[toPositionId].childNodes[0]
        removed.parentNode.removeChild(removed)
        isplein[toPositionId].innerHTML = blackDaim
        isplein[toPositionId].firstChild?.setAttribute("draggable", "true")
    }
     
}

function dragDrop(event) {
    event.stopPropagation()
    const take = event.target.classList.contains('piece')
    const newCase = event.target.classList[1]
    toPositionId = parseInt(event.target.getAttribute('square-id'))
    if (take || newCase != 'brown')
        return ;

    console.log(pieceColor, "   ", playerGo)
    if (pieceColor !== playerGo && pieceColor !== playerGo + 'Daim')
        return ;
    if (isValidDaim())
    {
        if (!mvDaim())
            return ;
        let isplein = document.querySelectorAll('#gameboard div.square')
        isplein[toPositionId].setAttribute("style", "padding-top: 0px")
        event.target.append(draggedElement)
        changePlayer()
    }
    else if (isValid())
    {
        let isplein = document.querySelectorAll('#gameboard div.square')
        isplein[toPositionId].setAttribute("style", "padding-top: 0px")
        event.target.append(draggedElement)
        isDaim()
        changePlayer()
    }
    if(!numberOfBlackPiece)
        infoDisplay.textContent = "White player wins";  
    else if (!numberOfWhitePiece)
        infoDisplay.textContent = "Black player wins";  
    else
        infoDisplay.textContent = "Black have a " + numberOfBlackPiece + " peice's and White have a " + numberOfWhitePiece + " peice's";  

}

function changePlayer() {
    
    playerDisplay.textContent =  (playerGo == 'black') ? playerGo = 'white' : playerGo = 'black'
    
}
