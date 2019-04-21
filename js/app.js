// ==============================
// State
// ==============================
const state = {
  setup() {
    this.expression = ''
    this.operands = []
    this.operators = []
    this.answer = ''
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
  if (((expression === '' || /[+*/.]/.test(expressionLastChar)) && /[+*/.]/.test(input)) || ((/[-]/.test(expressionLastChar)) && (/[-+*/]/.test(input)))) {
    return false
  }
  return true
}

function expressionParsing() {
  let { operands, operators } = state
  let isParsingSameNumber = false
  const expressionArr = [...state.expression]

  expressionArr.forEach((element, index) => {
    const operandsWithoutLast = operands.slice(0, operands.length - 1) || []
    const lastOperand = operands[operands.length - 1] || ''

    if (/\d/.test(element)) {
      if (expressionArr[index - 1]) {
        if (expressionArr[index - 1] === '-') {
          operands = [...operands, `-${element}`]
          if (expressionArr[index - 2] && /\d/.test(expressionArr[index - 2])) {
            operators = [...operators, '+']
          }
          isParsingSameNumber = true
          return
        }

        if (expressionArr[index - 1] === '.') {
          operands = [...operandsWithoutLast, `${lastOperand}.${element}`]

          return
        }
      }

      if (element !== '-' && element !== '.') {
        if (isParsingSameNumber) {
          operands = [...operandsWithoutLast, `${lastOperand}${element}`]
        } else {
          operands = [...operands, element]
          isParsingSameNumber = true
        }
      }
    } else if (/[+*/]/.test(element)) {
      isParsingSameNumber = false
      operators = [...operators, element]
    }
  })

  state.update({ operators, operands })
}

function calculateAnswer() {
  const { operators, operands } = state
  let operationIndex = 0
  let operationResult = null

  // Performing first priority operations
  while (operators.some((operator) => { return /[*/]/.test(operator) })) {
    const operator = operators[operationIndex]
    const firstOperand = parseFloat(operands[operationIndex])
    const secondOperand = parseFloat(operands[operationIndex + 1])

    if (secondOperand && (/[*/]/.test(operator))) {
      switch(operator) {
        case '*': 
          operationResult = firstOperand * secondOperand
          break
        case '/': 
          operationResult = firstOperand / secondOperand
          break
      }

      operands.splice(operationIndex, 2, operationResult)
      operators.splice(operationIndex, 1)
    }

    operationIndex += 1
  }

  // Performing lowest priority operations
  while (operators.length !== 0) {
    const operator = operators[0]
    const firstOperand = parseFloat(operands[0])
    const secondOperand = parseFloat(operands[1])

    if (secondOperand) {
      switch(operator) {
        case '+':
          operationResult = firstOperand + secondOperand
          break
      }
    }

    operands.splice(0, 2, operationResult)
    operators.splice(0, 1)
  }

  const answer = (operands[0] !== undefined) ? (Math.floor(operands[0] * 10000000) / 10000000).toString(10) : ''
  state.update({ answer })
}

function screenInputHandler(event) {
  const input = event.target.textContent
  if (inputIsValid(input)) {
    const { expression } = state
    const newExpression = expression + input
    state.update({ expression: newExpression })
    updateOutput('primary', state.expression)
    expressionParsing()
    calculateAnswer()
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

document.addEventListener('keypress', keyboardInputHandler)

// ==============================
// Exports
// ==============================

module.exports = {
  state,
  inputIsValid,
  expressionParsing,
  calculateAnswer,
}
