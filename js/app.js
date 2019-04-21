// ==============================
// State
// ==============================
const state = {
  setup() {
    this.expression = ''
    this.operands = []
    this.operators = []
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


function inputFromScreenHandling(e) {
  const input = e.target.textContent
  if (inputIsValid(input)) {
    const { expression } = state
    const newExpression = expression + input
    state.update({ expression: newExpression })
    updateOutput('primary', state.expression)
    expressionParsing()
  }
}

// ==============================
// Event controller
// ==============================
const contentInputs = document.querySelectorAll('.content-input')

contentInputs.forEach((contentInput) => {
  contentInput.addEventListener('click', inputFromScreenHandling)
})

// ==============================
// Exports
// ==============================

module.exports = {
  state,
  inputIsValid,
  expressionParsing,
}
