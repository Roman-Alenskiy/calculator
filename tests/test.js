require('jsdom-global')()
const chai = require('chai')

const { expect } = chai

const {
  state,
  inputIsValid,
  expressionParsing,
} = require('../js/app')

describe('Calculator', () => {
  beforeEach(() => { state.setup() })

  describe('#state.update()', () => {
    it('should update expression with value "test"', () => {
      expect(state.expression).to.equal('')
      state.update({ expression: 'test' })
      expect(state.expression).to.equal('test')
    })
  })

  describe('#inputIsValid()', () => {
    describe('current state of expression - ""', () => {
      it('should return true', () => {
        expect(inputIsValid(1)).to.be.true
      })

      it('should return true', () => {
        expect(inputIsValid('-')).to.be.true
      })

      it('should return false', () => {
        expect(inputIsValid('+')).to.be.false
      })

      it('should return false', () => {
        expect(inputIsValid('*')).to.be.false
      })

      it('should return false', () => {
        expect(inputIsValid('/')).to.be.false
      })

      it('should return false', () => {
        expect(inputIsValid('.')).to.be.false
      })
    })

    describe('current state of expression - "1"', () => {
      beforeEach(() => { state.update({ expression: '1' }) })

      it('should return true', () => {
        expect(inputIsValid(1)).to.be.true
      })

      it('should return true', () => {
        expect(inputIsValid('-')).to.be.true
      })

      it('should return true', () => {
        expect(inputIsValid('+')).to.be.true
      })

      it('should return true', () => {
        expect(inputIsValid('*')).to.be.true
      })

      it('should return true', () => {
        expect(inputIsValid('/')).to.be.true
      })

      it('should return true', () => {
        expect(inputIsValid('.')).to.be.true
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
})
