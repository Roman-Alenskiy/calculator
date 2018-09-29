const inputField = document.querySelector('.input-field')
const numField = document.querySelector('.num-field')
const contentOutputs = document.querySelectorAll('.content-output')
const outputPrimary = document.querySelector('input')
const outputSecondary = document.querySelector('.output-secondary input')
const equallyButton = document.querySelector('#equally')
const deleteButton = document.querySelector('#delete')

const operandsRegExp = /[\d\.]/
const operatorsRegExp = /[\+\-\*\/]/
const generalRegExp = /[\+\-\*\/\d\.]/

let exp = ""
let operationIndex = 0
let operands = []
let operators = []

let holdTimer

// Event listeners
contentOutputs.forEach(function(contentOutput) {
    contentOutput.addEventListener('mousedown', inputFromScreen)
})
equallyButton.addEventListener('mousedown', answerToOutputPrimary)
deleteButton.addEventListener('mousedown', onDeleteDown)
deleteButton.addEventListener('mouseup', onDeleteUp)
deleteButton.addEventListener('touchstart', onDeleteDown)
deleteButton.addEventListener('touchend', onDeleteUp)
document.addEventListener('keydown', inputFromKeyboard)

// Handling holds and clicks
function onDeleteDown() {
    holdTimer = window.setTimeout(onDeleteHold, 1000)
}

function onDeleteUp() {
    if (holdTimer) window.clearTimeout(holdTimer) // if clicking 'DEL' button, then clear last character
    lastClear()
}

function onDeleteHold() {
    allClear() // if holding 'DEL' - clear all
}

// Main functions
function inputFromKeyboard(event) {
    if (generalRegExp.test(event.key) && !(/[f]/i.test(event.key))) { // second test() is need to prevent F1-F12 keys input
        outputPrimary.value += event.key
        inputProcessing()
    }

    switch(event.key) {
        case 'Enter': 
            answerToOutputPrimary()
            break
        case 'Backspace':
            lastClear()
            break
    }
}

function inputFromScreen(event) {
    outputPrimary.value += event.target.textContent
    inputProcessing()
}

function inputProcessing() {
    updateExp() 
    parsingExp()
    outputAnswer(calculateAnswer())
}

function updateExp() {
    exp = outputPrimary.value
}

function parsingExp() {
        let expLast = exp[exp.length - 1]  
        if (operandsRegExp.test(expLast)) {
            if (operands[operationIndex] === undefined) {operands[operationIndex] = ''}
            operands[operationIndex] += expLast
            console.log(operands)
        } else if (operatorsRegExp.test(expLast)) {
            operators[operationIndex] = expLast
            console.log(operators)
            operationIndex++
        }
}

function outputAnswer(answer) {
    outputSecondary.value = answer
}

function calculateAnswer() {
    let answer
    let operationResult
    let operandsClone = operands.slice()
    let operatorsClone = operators.slice()
    const operatorTypes = ['*', '/', '+', '-']

    operatorTypes.forEach(function(operator) {
        while (operatorsClone.findIndex(findHelper) !== -1) {
            let index = operatorsClone.findIndex(findHelper)
            let firstOperand = parseFloat(operandsClone[index])
            let secondOperand = parseFloat(operandsClone[index+1])
            if (Number.isNaN(secondOperand)) {return}
            switch(operator) {
                case '*': 
                    operationResult = firstOperand * secondOperand
                    break
                case '/': 
                    operationResult = firstOperand / secondOperand
                    break
                case '+': 
                    operationResult = firstOperand + secondOperand
                    break
                case '-': 
                    operationResult = firstOperand - secondOperand
                    break
            }    
            operandsClone.splice(index + 1, 1, operationResult)
            operandsClone.splice(index, 1)
            operatorsClone.splice(index, 1) 
        }

        function findHelper(el) {return el === operator}
    })

    answer = operandsClone[0]
    return answer
}

function answerToOutputPrimary() {
    if (!operatorsRegExp.test(outputPrimary.value)) {return}
    clearVars()
    outputPrimary.value = operands[0] = outputSecondary.value
}

function allClear() {
    exp = ""
    operationIndex = 0
    operands = []
    operators = []
    outputPrimary.value = ''
    outputSecondary.value = ''
}

function lastClear() {
    let opValLastIndex = outputPrimary.value.length - 1
    let opValLast = outputPrimary.value[opValLastIndex]
    if (operandsRegExp.test(opValLast)) {
        let operandsLastIndex = operands.length - 1
        let operandsLast = operands[operandsLastIndex]
        operands[operandsLastIndex] = operandsLast.slice(0, operandsLast.length - 1)
        if (operands[operandsLastIndex] === '') {operands.pop()}
        console.log(operands)
    } else if (operatorsRegExp.test(opValLast)) {
        operators.pop()
        console.log(operators)
        operationIndex--
    }
    outputPrimary.value = outputPrimary.value.slice(0, opValLastIndex)
    if (!(outputPrimary.value === '')) {
        outputAnswer(calculateAnswer())
    } else {
        clearOutputs()
    }
}

function clearVars() {
    exp = ""
    operationIndex = 0
    operands = []
    operators = []
}

function  clearOutputs() {
    outputPrimary.value = ''
    outputSecondary.value = '' 
}