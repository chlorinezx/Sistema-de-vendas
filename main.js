const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransaction = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransaction : []

const removeTransaction = ID => {
    transactions = transactions.filter(transaction => 
        transaction.id !== ID)
    updateLocalStorage()
    init() 
}

const addTransactionIntoDOM = ({ amount, name, id }) => {
    const operador = amount < 0 ? '-' : '+'
    const   CSSClass = amount < 0? 'minus' : 'plus'
    const amountWithoutOperador = Math.abs(amount)
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `
       ${name} 
       <span>${operador} R$ ${amountWithoutOperador}</span>
       <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
    `
     transactionsUl.prepend(li)
}

const getExpenses = transactionsAmounts =>  Math.abs( transactionsAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)

const getIncome = transactionsAmounts => transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getTotal = transactionsAmounts => transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

const updateBalenceValues = () => {
    const transactionsAmounts =  transactions.map(({amount}) => amount)
    const total = getTotal(transactionsAmounts)
    const income =  getIncome(transactionsAmounts)
    const expense = getExpenses(transactionsAmounts)
    
    
    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
  
}

const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalenceValues()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionAmounts) => {
    transactions.push({
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmounts)
    })
}

const cleanInput = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

const  handleFormSubmit =  event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmounts = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionAmounts === ''

    if (isSomeInputEmpty){
        alert('por favor, preencha tanto o nome quanto o valor da transação')
        return
    }

    addToTransactionsArray(transactionName, transactionAmounts)
    init()
    updateLocalStorage()
    cleanInput()
}

form.addEventListener('submit', handleFormSubmit)
    