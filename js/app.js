// ==============================
// State
// ==============================
const state = {
  setup() {
    this.expression = ''
    this.operands = []
    this.operators = []
    this.answer = ''
    this.isParsingSameNumber = false
  },
  update(updatedProps) {
    Object.keys(updatedProps).forEach((prop) => {
      this[prop] = updatedProps[prop]
    })
  },
}

state.setup()

// ==============================
// Display controller
// ==============================
function updateOutput(outputType, newValue) {
  const output = document.querySelector(`.output-${outputType} input`)
  output.value = newValue
}

// ==============================
// Main functions
// ==============================
function inputIsValid(input) {
  if (/\d/.test(input)) return true

  const { expression } = state
  const expressionLastChar = expression[expression.length - 1]
  if (((expression === '' || /[+*/.]/.test(expressionLastChar)) && /[+*/.]/.test(input)) || ((/[-]/.test(expressionLastChar)) && (/[-+*/.]/.test(input)))) {
    return false
  }
  return true
}

function expressionParsing() {
  const { expression } = state
  const expressionArr = [...expression]
  const operands = []
  const operators = []
  let isParsingSameNumber = false

  expressionArr.forEach((element, index) => {
    if (/\d/.test(element)) {
      if (expressionArr[index - 1]) {
        if (expressionArr[index - 1] === '-') {
          operands.push(`-${element}`)
          if (expressionArr[index - 2] && /\d/.test(expressionArr[index - 2])) {
            operators.push('+')
          }
          isParsingSameNumber = true
          return
        }

        if (expressionArr[index - 1] === '.') {
          operands[operands.length - 1] = `${operands[operands.length - 1]}.${element}`
          return
        }
      }

      if (element !== '-' && element !== '.') {
        if (isParsingSameNumber) {
          operands[operands.length - 1] = `${operands[operands.length - 1]}${element}`
        } else {
          operands.push(element)
          isParsingSameNumber = true
        }
      }
    } else if (/[+*/]/.test(element)) {
      isParsingSameNumber = false
      operators.push(element)
    }
  })

  state.update({ operators, operands, isParsingSameNumber })
}

function calculateAnswer() {
  const operands = [...state.operands]
  const operators = [...state.operators]
  let operationIndex = 0
  let operationResult = null

  // Performing first priority operations
  while (operators.includes('/') || operators.includes('*')) {
    const operator = operators[operationIndex]
    const firstOperand = parseFloat(operands[operationIndex])
    const secondOperand = parseFloat(operands[operationIndex + 1])

    if (Number.isNaN(secondOperand)) { break }

    if (/[/*]/.test(operator)) {
      switch (operator) {
        case '*':
          operationResult = firstOperand * secondOperand
          break
        case '/':
          operationResult = firstOperand / secondOperand

          // If happened division by zero
          if (operationResult === Infinity || Number.isNaN(operationResult)) {
            state.update({ answer: 'Division by zero' })
            return
          }
          break
        default:
          break
      }

      operands.splice(operationIndex, 2, operationResult)
      operators.splice(operationIndex, 1)
    } else {
      operationIndex += 1
    }
  }

  // Performing lowest priority operations
  while (operators.length !== 0) {
    const operator = operators[0]
    const firstOperand = parseFloat(operands[0])
    const secondOperand = parseFloat(operands[1])

    if (secondOperand) {
      switch (operator) {
        case '+':
          operationResult = firstOperand + secondOperand
          break
        default:
          break
      }
    }

    operands.splice(0, 2, operationResult)
    operators.splice(0, 1)
  }

  const answer = (operands[0] !== undefined && operands[0] !== null) ? (Math.floor(operands[0] * 10000000) / 10000000).toString(10) : ''
  state.update({ answer })
}

function screenInputHandler(event) {
  const input = event.target.textContent
  if (inputIsValid(input)) {
    const { expression } = state
    const newExpression = expression + input
    state.update({ expression: newExpression })
    updateOutput('primary', newExpression)
    expressionParsing()
    calculateAnswer()
    const { answer } = state
    updateOutput('secondary', answer)
  }
}

function keyboardInputHandler(event) {
  const input = event.key

  switch (true) {
    case /[+\-*/.\d]/.test(input): {
      if (inputIsValid(input)) {
        const { expression } = state
        const newExpression = expression + input
        state.update({ expression: newExpression })
        updateOutput('primary', state.expression)
        expressionParsing()
        calculateAnswer()
      }
      break
    }

    case input === 'Enter': {
      break
    }

    case input === 'Backspace': {
      break
    }
    default:
      break
  }
}

// ==============================
// Event controller
// ==============================
const contentInputs = document.querySelectorAll('.content-input')

contentInputs.forEach((contentInput) => {
  contentInput.addEventListener('click', screenInputHandler)
})

window.addEventListener('keypress', keyboardInputHandler)

// ==============================
// Exports
// ==============================

module.exports = {
  state,
  inputIsValid,
  expressionParsing,
  calculateAnswer,
}
