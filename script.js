const transactionUL = document.querySelector('#transactions')//recupera a ul da dom
const incomeDisplay = document.querySelector('#money-plus')//pega o p da dom para mostra a receita
const expenseDisplay = document.querySelector('#money-minus')//pega o p da dom para mostra a despesas
const balanceDisplay = document.querySelector('#balance')//pega o h1 da dom para mostra o saldo total
const form = document.querySelector('#form'); //pega o id do form 
const inputTransactionName = document.querySelector('#text')//pega o id do imput
const inputTransactionAmount = document.querySelector('#amount')
//const data = new Date();
// const datas = {
//     mes: data.getMonth(),
//     dia: data.getDay(),
//     hora: data.getHours(),
//     minutos: data.getMinutes()

// }
// var dias = new Array(
//     'domingo','segunda','terça','quarta','quinta','sexta','sábado'
//    );
// console.log(dias[datas.dia])
// let transactions = [
//     {id:1, nome: 'Bolo de brigadeiro',amount:-20},
//     {id:2, nome: 'Salário',amount:300},
//     {id:3, nome: 'Torta de frango',amount:-10},
//     {id:4, nome: 'Violão',amount:150}
// ]
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID =>{
    transactions = transactions.filter(transaction => transaction.id !== ID)
    updateLocalStorage()
    init()
   
}
const addtransactionIntoDom = ({amount,nome,id})=>{
    //add sinal de mais ou menos de acordo com o valor  da propriedade amount do obj passdo no parametro 
    const operator = amount < 0 ? '-' : '+';
    //add a class  de acordo com o valor  da propriedade amount do obj passdo no parametro 
    const CSSClass = amount < 0 ? 'minus' : 'plus';
    //vai tirar qual sinal que vir no mumero
    const amountWithoutOperator = Math.abs(amount);
    // cria a li 
    const li = document.createElement('li');
    li.classList.add(CSSClass);//add a class na li
    //add a span na li
    li.innerHTML =`
        ${nome} 
        <span> ${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${id})">
        x
        </button>`;
    transactionUL.prepend(li);//inserido a li na dom
    //append coloca o ultimo elememto inserido como o ultimo filho
    //prepend coloca o ultimo elemento inserido como o primeiro filho
    
}
//aqui o valor total saldo
const getTotal = transactonsAmounts => transactonsAmounts
.reduce((accumulator, transaction) => accumulator + transaction,0)
.toFixed(2);

//aqui a saldo total da receitas
const getIcome = transactonsAmounts => transactonsAmounts
.filter(value => value > 0)
.reduce((accumulator, value) => accumulator + value,0)
.toFixed(2);

//valor da despesas
const getExpenses = transactonsAmounts =>  Math.abs(transactonsAmounts
.filter(value => value < 0 )
.reduce((accumulator, value) => accumulator + value,0))
.toFixed(2);

const updateBalanceValues = () =>{
    // const transactonsAmounts = transactions.map(transaction => transaction.amount);
    const transactonsAmounts = transactions.map(({amount}) => amount ) //usando destructuring ou usa a linha de cima
    const total = getTotal(transactonsAmounts)
    const income = getIcome(transactonsAmounts)
    const  expense = getExpenses(transactonsAmounts)

           balanceDisplay.textContent =`R$ ${total}`;
           incomeDisplay.textContent = `R$ ${income}`;
           expenseDisplay.textContent =`R$ ${expense}`;
   

}
 const init = () =>{
    transactionUL.innerHTML ='';
     transactions.forEach(addtransactionIntoDom);
     updateBalanceValues()
 }
//responsavél para inicializar os dados na tela
init();
const  updateLocalStorage = () =>{
     localStorage.setItem('transactions',JSON.stringify(transactions)) //salva os dados no localStorage mas
                                                                          // antes transforma os dados em uma string
}
const generateID = ()=> Math.round(Math.random() * 1000);//gera id 
const inputClean= () =>{
    inputTransactionName.value ='';
    inputTransactionAmount.value ='';
}
const addToTransactionsArray = (transactionName, transactionAmount) => {
    const transaction = {
        id: generateID(), 
        nome: transactionName ,
        amount: Number(transactionAmount)//transformando a string que vem do form em numero poderia ser o sinal de +
       };
    transactions.push(transaction);
}

const handleFormSubmit =  event =>{
    event.preventDefault()
    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim();
    const isSomeInputEmpty = transactionName ==='' || transactionAmount ==='';
   
    if( isSomeInputEmpty){
        alert('Por favor, preenche  tanto o nome quando o valor da transação')
        return
    }
    addToTransactionsArray(transactionName, transactionAmount);
    init()   
    updateLocalStorage();
    inputClean();
    
   }

//evento que vai ouvir o form e fazer a validação dele
form.addEventListener('submit',handleFormSubmit);