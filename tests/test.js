const chai = require('chai')

const { expect } = chai

const {
  state,
  inputIsValid,
  keyboardInputHandler,
  expressionParsing,
  calculateAnswer,
  deleteLastInput,
} = require('../js/app')

describe('Calculator', () => {
  beforeEach(() => { state.setup() })

  describe('#state.update()', () => {
    it('should update expression with value "test"', () => {
      expect(state.expression).to.equal('')
      state.update({ expression: 'test' })
      expect(state.expression).to.equal('test')
    })

    it('should update state with few values', () => {
      expect(state.expression).to.equal('')
      expect(state.operands).to.deep.equal([])
      expect(state.operators).to.deep.equal([])
      expect(state.isParsingSameNumber).to.be.false
      state.update({ expression: '10*-20', operands: ['10', '-20'], operators: ['*'], isParsingSameNumber: true })
      expect(state.expression).to.equal('10*-20')
      expect(state.operands).to.deep.equal(['10', '-20'])
      expect(state.operators).to.deep.equal(['*'])
      expect(state.isParsingSameNumber).to.be.true
    })
  })

  describe('#keyboardInputHandler()', () => {
    it('should take correct input "1"', () => {
      const event = { key: 'F1' }
      expect(() => { keyboardInputHandler(event) }).to.not.throw()
      expect(state.expression).to.equal('')
      expect(state.operands).to.deep.equal([])
    })
  })

  describe('#inputIsValid()', () => {
    describe('current state of expression - ""', () => {
      it('should return true for "1"', () => {
        expect(inputIsValid('1')).to.be.true
      })

      it('should return true for "-"', () => {
        expect(inputIsValid('-')).to.be.true
      })

      it('should return false for "+"', () => {
        expect(inputIsValid('+')).to.be.false
      })

      it('should return false for "*"', () => {
        expect(inputIsValid('*')).to.be.false
      })

      it('should return false for "/"', () => {
        expect(inputIsValid('/')).to.be.false
      })

      it('should return false for "."', () => {
        expect(inputIsValid('.')).to.be.false
      })
    })

    describe('current state of expression - "1"', () => {
      beforeEach(() => { state.update({ expression: '1' }) })

      it('should return true for "1"', () => {
        expect(inputIsValid('1')).to.be.true
      })

      it('should return true for "-"', () => {
        expect(inputIsValid('-')).to.be.true
      })

      it('should return true for "+"', () => {
        expect(inputIsValid('+')).to.be.true
      })

      it('should return true for "*"', () => {
        expect(inputIsValid('*')).to.be.true
      })

      it('should return true for "/"', () => {
        expect(inputIsValid('/')).to.be.true
      })

      it('should return true for "."', () => {
        expect(inputIsValid('.')).to.be.true
      })
    })

    describe('current state of expression - "1."', () => {
      beforeEach(() => { state.update({ expression: '1.' }) })

      it('should return true for "1"', () => {
        expect(inputIsValid('1')).to.be.true
      })

      it('should return false for "-"', () => {
        expect(inputIsValid('-')).to.be.false
      })

      it('should return false for "+"', () => {
        expect(inputIsValid('+')).to.be.false
      })

      it('should return false for "*"', () => {
        expect(inputIsValid('*')).to.be.false
      })

      it('should return false for "/"', () => {
        expect(inputIsValid('/')).to.be.false
      })

      it('should return false for "."', () => {
        expect(inputIsValid('.')).to.be.false
      })
    })
  })

  describe('#expressionParsing()', () => {
    it('should parse expression "" into operators and operands', () => {
      expressionParsing()
      expect(state.operands).to.be.an('array').that.is.empty
      expect(state.operators).to.be.an('array').that.is.empty
    })

    it('should parse expression "-" into operators and operands', () => {
      state.update({ expression: '-' })
      expressionParsing()
      expect(state.operands).to.be.an('array').that.is.empty
      expect(state.operators).to.be.an('array').that.is.empty
    })

    it('should parse expression "-1" into operators and operands', () => {
      state.update({ expression: '-1' })
      expressionParsing()
      expect(state.operands).to.deep.equal(['-1'])
      expect(state.operators).to.be.an('array').that.is.empty
    })

    it('should parse expression "1-" into operators and operands', () => {
      state.update({ expression: '1-' })
      expressionParsing()
      expect(state.operands).to.deep.equal(['1'])
      expect(state.operators).to.be.an('array').that.is.empty
    })

    it('should parse expression "1+1" into operators and operands', () => {
      state.update({ expression: '1+1' })
      expressionParsing()
      expect(state.operands).to.deep.equal(['1', '1'])
      expect(state.operators).to.deep.equal(['+'])
    })

    it('should parse expression "1-1" into operators and operands', () => {
      state.update({ expression: '1-1' })
      expressionParsing()
      expect(state.operands).to.deep.equal(['1', '-1'])
      expect(state.operators).to.deep.equal(['+'])
    })

    it('should parse expression "10+20" into operators and operands', () => {
      state.update({ expression: '10+20' })
      expressionParsing()
      expect(state.operands).to.deep.equal(['10', '20'])
      expect(state.operators).to.deep.equal(['+'])
    })

    it('should parse expression "10-20" into operators and operands', () => {
      state.update({ expression: '10-20' })
      expressionParsing()
      expect(state.operands).to.deep.equal(['10', '-20'])
      expect(state.operators).to.deep.equal(['+'])
    })

    it('should parse expression "10*-20" into operators and operands', () => {
      state.update({ expression: '10*-20' })
      expressionParsing()
      expect(state.operands).to.deep.equal(['10', '-20'])
      expect(state.operators).to.deep.equal(['*'])
    })

    it('should parse expression "-10-50*-60" into operators and operands', () => {
      state.update({ expression: '-10-50*-60' })
      expressionParsing()
      expect(state.operands).to.deep.equal(['-10', '-50', '-60'])
      expect(state.operators).to.deep.equal(['+', '*'])
    })

    it('should parse expression "10.05+2.15" into operators and operands', () => {
      state.update({ expression: '10.05+2.15' })
      expressionParsing()
      expect(state.operands).to.deep.equal(['10.05', '2.15'])
      expect(state.operators).to.deep.equal(['+'])
    })

    it('should parse expression "10.05-2.15" into operators and operands', () => {
      state.update({ expression: '10.05-2.15' })
      expressionParsing()
      expect(state.operands).to.deep.equal(['10.05', '-2.15'])
      expect(state.operators).to.deep.equal(['+'])
    })

    it('should parse expression "20.000003" into operators and operands', () => {
      state.update({ expression: '20.000003' })
      expressionParsing()
      expect(state.operands).to.deep.equal(['20.000003'])
      expect(state.operators).to.be.an('array').that.is.empty
    })

    it('should parse expression "10.003+20.004" into operators and operands', () => {
      state.update({ expression: '10.003+20.004' })
      expressionParsing()
      expect(state.operands).to.deep.equal(['10.003', '20.004'])
      expect(state.operators).to.deep.equal(['+'])
    })

    it('should parse expression "-560.21*-0.25-9.2/0.36" into operators and operands', () => {
      state.update({ expression: '-560.21*-0.25-9.2/-0.36' })
      expressionParsing()
      expect(state.operands).to.deep.equal(['-560.21', '-0.25', '-9.2', '-0.36'])
      expect(state.operators).to.deep.equal(['*', '+', '/'])
    })
  })

  describe('#calculateAnswer()', () => {
    it('should calculate answer from ""', () => {
      calculateAnswer()
      expect(state.answer).to.equal('')
    })

    it('should calculate answer from "-"', () => {
      state.update({ expression: '-' })
      calculateAnswer()
      expect(state.answer).to.equal('')
    })

    it('should calculate answer from "-1"', () => {
      state.update({ operands: ['-1'] })
      state.update({ operators: [] })
      calculateAnswer()
      expect(state.answer).to.equal('-1')
    })

    it('should calculate answer from "1-"', () => {
      state.update({ operands: ['1'] })
      state.update({ operators: [] })
      calculateAnswer()
      expect(state.answer).to.equal('1')
    })

    it('should calculate answer from "1+1"', () => {
      state.update({ operands: ['1', '1'] })
      state.update({ operators: ['+'] })
      calculateAnswer()
      expect(state.answer).to.equal('2')
    })

    it('should calculate answer from "1-1"', () => {
      state.update({ operands: ['1', '-1'] })
      state.update({ operators: ['+'] })
      calculateAnswer()
      expect(state.answer).to.equal('0')
    })

    it('should calculate answer from "10+20"', () => {
      state.update({ operands: ['10', '20'] })
      state.update({ operators: ['+'] })
      calculateAnswer()
      expect(state.answer).to.equal('30')
    })

    it('should calculate answer from "10-20"', () => {
      state.update({ operands: ['10', '-20'] })
      state.update({ operators: ['+'] })
      calculateAnswer()
      expect(state.answer).to.equal('-10')
    })

    it('should calculate answer from "0*-69"', () => {
      state.update({ operands: ['0', '-69'] })
      state.update({ operators: ['*'] })
      calculateAnswer()
      expect(state.answer).to.equal('0')
    })

    it('should calculate answer from "10*-20"', () => {
      state.update({ operands: ['10', '-20'] })
      state.update({ operators: ['*'] })
      calculateAnswer()
      expect(state.answer).to.equal('-200')
    })

    it('should calculate answer from "10.04*20.71"', () => {
      state.update({ operands: ['10.05', '20.71'] })
      state.update({ operators: ['*'] })
      calculateAnswer()
      expect(state.answer).to.equal('208.1355')
    })

    it('should calculate answer from "0/0"', () => {
      state.update({ operands: ['0', '0'] })
      state.update({ operators: ['/'] })
      calculateAnswer()
      expect(state.answer).to.equal('Division by zero')
    })

    it('should calculate answer from "10/0"', () => {
      state.update({ operands: ['10', '0'] })
      state.update({ operators: ['/'] })
      calculateAnswer()
      expect(state.answer).to.equal('Division by zero')
    })

    it('should calculate answer from "10/0+20"', () => {
      state.update({ operands: ['10', '0', '20'] })
      state.update({ operators: ['/', '+'] })
      calculateAnswer()
      expect(state.answer).to.equal('Division by zero')
    })

    it('should calculate answer from "100/5"', () => {
      state.update({ operands: ['100', '5'] })
      state.update({ operators: ['/'] })
      calculateAnswer()
      expect(state.answer).to.equal('20')
    })

    it('should calculate answer from "100/7"', () => {
      state.update({ operands: ['100', '7'] })
      state.update({ operators: ['/'] })
      calculateAnswer()
      expect(state.answer).to.equal('14.2857142')
    })

    it('should calculate answer from "-10-50*-60"', () => {
      state.update({ operands: ['-10', '-50', '-60'] })
      state.update({ operators: ['+', '*'] })
      calculateAnswer()
      expect(state.answer).to.equal('2990')
    })

    it('should calculate answer from "10.05+2.15"', () => {
      state.update({ operands: ['10.05', '2.15'] })
      state.update({ operators: ['+'] })
      calculateAnswer()
      expect(state.answer).to.equal('12.2')
    })

    it('should calculate answer from "11.000000199999999"', () => {
      state.update({ operands: ['11.00000019999999'] })
      calculateAnswer()
      expect(state.answer).to.equal('11.00000019999999')
    })

    it('should calculate answer from "-560.21*-0.25-9.2/-0.36"', () => {
      state.update({ operands: ['-560.21', '-0.25', '-9.2', '-0.36'] })
      state.update({ operators: ['*', '+', '/'] })
      calculateAnswer()
      expect(state.answer).to.equal('165.6080555')
    })

    it('should calculate answer from "6*9-3/-6"', () => {
      state.update({ operands: ['6', '9', '-3', '-6'] })
      state.update({ operators: ['*', '+', '/'] })
      calculateAnswer()
      expect(state.answer).to.equal('54.5')
    })
  })

  describe('#deleteLastInput()', () => {
    it('should delete last character from ""', () => {
      deleteLastInput()
      expect(state.operands).to.be.an('array').that.is.empty
      expect(state.operators).to.be.an('array').that.is.empty
      expect(state.expression).to.equal('')
    })

    it('should delete last character from "-"', () => {
      state.update({ expression: '-' })
      deleteLastInput()
      expect(state.operands).to.be.an('array').that.is.empty
      expect(state.operators).to.be.an('array').that.is.empty
      expect(state.expression).to.equal('')
    })

    it('should delete last character from "1"', () => {
      state.update({ expression: '1' })
      state.update({ operands: ['1'] })
      deleteLastInput()
      expect(state.operands).to.be.an('array').that.is.empty
      expect(state.operators).to.be.an('array').that.is.empty
      expect(state.expression).to.equal('')
    })


    it('should delete last character from "1+"', () => {
      state.update({ expression: '1+' })
      state.update({ operands: ['1'] })
      state.update({ operators: ['+'] })
      deleteLastInput()
      expect(state.operands).to.deep.equal(['1'])
      expect(state.operators).to.be.an('array').that.is.empty
      expect(state.expression).to.equal('1')
    })

    it('should delete last character from "1*"', () => {
      state.update({ expression: '1*' })
      state.update({ operands: ['1'] })
      state.update({ operators: ['*'] })
      deleteLastInput()
      expect(state.operands).to.deep.equal(['1'])
      expect(state.operators).to.be.an('array').that.is.empty
      expect(state.expression).to.equal('1')
    })

    it('should delete last character from "1/"', () => {
      state.update({ expression: '1/' })
      state.update({ operands: ['1'] })
      state.update({ operators: ['/'] })
      deleteLastInput()
      expect(state.operands).to.deep.equal(['1'])
      expect(state.operators).to.be.an('array').that.is.empty
      expect(state.expression).to.equal('1')
    })

    it('should delete last character from "1-"', () => {
      state.update({ expression: '1-' })
      state.update({ operands: ['1'] })
      deleteLastInput()
      expect(state.operands).to.deep.equal(['1'])
      expect(state.operators).to.be.an('array').that.is.empty
      expect(state.expression).to.equal('1')
    })

    it('should delete last character from "1."', () => {
      state.update({ expression: '1.' })
      state.update({ operands: ['1'] })
      deleteLastInput()
      expect(state.operands).to.deep.equal(['1'])
      expect(state.operators).to.be.an('array').that.is.empty
      expect(state.expression).to.equal('1')
    })

    it('should delete last character from "1.0"', () => {
      state.update({ expression: '1.0' })
      state.update({ operands: ['1.0'] })
      deleteLastInput()
      expect(state.operands).to.deep.equal(['1'])
      expect(state.operators).to.be.an('array').that.is.empty
      expect(state.expression).to.equal('1.')
    })

    it('should delete last character from "-1"', () => {
      state.update({ expression: '-1' })
      state.update({ operands: ['-1'] })
      deleteLastInput()
      expect(state.operands).to.be.an('array').that.is.empty
      expect(state.operators).to.be.an('array').that.is.empty
      expect(state.expression).to.equal('-')
    })

    it('should delete last character from "10"', () => {
      state.update({ expression: '10' })
      state.update({ operands: ['10'] })
      deleteLastInput()
      expect(state.operands).to.deep.equal(['1'])
      expect(state.operators).to.be.an('array').that.is.empty
      expect(state.expression).to.equal('1')
    })

    it('should delete last character from "10-5"', () => {
      state.update({ expression: '10-5' })
      state.update({ operands: ['10', '-5'] })
      state.update({ operators: ['+'] })
      deleteLastInput()
      expect(state.operands).to.deep.equal(['10'])
      expect(state.operators).to.be.an('array').that.is.empty
      expect(state.expression).to.equal('10-')
    })

    it('should delete last character from "10+5"', () => {
      state.update({ expression: '10+5' })
      state.update({ operands: ['10', '5'] })
      state.update({ operators: ['+'] })
      deleteLastInput()
      expect(state.operands).to.deep.equal(['10'])
      expect(state.operators).to.deep.equal(['+'])
      expect(state.expression).to.equal('10+')
    })
  })
})
