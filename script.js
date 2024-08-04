'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Zeyad Albadawy',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2024-08-2T23:02:37.259Z',
    '2024-08-03T23:02:37.259Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Mohamed Mohamed',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Tomas Edison',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2024-07-30T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const balanceFormat = function (value, locale, currency) {
  const options = {
    style: 'currency',
    currency: currency,
  };
  return new Intl.NumberFormat(locale, options).format(value);
};
const getTheDateDiff = (date1, date2) =>
  Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

const dateFormatting = (getTheFullDate, locale) => {
  if (!(getTheFullDate instanceof Date) || isNaN(getTheFullDate.getTime())) {
    console.error('Invalid date:', getTheFullDate);
    return 'Invalid date';
  }

  const now = new Date();
  const dateDiffCalc = getTheDateDiff(now, getTheFullDate);

  if (dateDiffCalc === 0) return 'Today';
  else if (dateDiffCalc === 1) return 'Yesterday';
  else if (dateDiffCalc === 2) return '2 days ago';
  else if (dateDiffCalc <= 7) return `${dateDiffCalc} days ago`;

  return new Intl.DateTimeFormat(locale).format(getTheFullDate);
};

const displayMovements = function (acc, flag = false) {
  containerMovements.innerHTML = '';
  let movmnts = flag
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movmnts.forEach(function (movement, idx) {
    const getTheFullDate = new Date(acc.movementsDates[idx]);
    const fullDisplay = dateFormatting(getTheFullDate, acc.locale);

    const mov = movement > 0 ? 'deposit' : 'withdrawal';
    let formattedMovment = balanceFormat(movement, acc.locale, acc.currency);
    const htmlDisplay = `<div class="movements__row">
          <div class="movements__type movements__type--${mov}"> ${
      idx + 1
    } ${mov}</div>
              <div class="movements__value">${fullDisplay}</div>
          <div class="movements__value">${formattedMovment}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', htmlDisplay);
  });
};

const calcPrintBalance = function (account) {
  account.balance = account.movements.reduce((acc, curr) => acc + curr);

  let formattedBalance = balanceFormat(
    account.balance,
    account.locale,
    account.currency
  );
  labelBalance.textContent = account.balance < 0 ? '0' : `${formattedBalance}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  let formattedSts = balanceFormat(incomes, acc.locale, acc.currency);

  labelSumIn.textContent = `${formattedSts}`;

  const outcomes = Math.abs(
    acc.movements.filter((mov) => mov < 0).reduce((acc, curr) => curr + acc, 0)
  );
  formattedSts = balanceFormat(outcomes, acc.locale, acc.currency);
  labelSumOut.textContent = `${formattedSts}`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((elm) => (elm * acc.interestRate) / 100)
    .filter((itr) => itr >= 1)
    .reduce((acc, curr) => acc + curr, 0);
  formattedSts = balanceFormat(interest, acc.locale, acc.currency);

  labelSumInterest.textContent = `${formattedSts}`;
};

const accounts = [account1, account2, account3];
const createUserNames = function (accounts) {
  accounts.forEach((account) => {
    account.userName = account.owner
      .toLowerCase()
      .split(' ')
      .map((acc) => acc[0])
      .join('');
  });
};
createUserNames(accounts);

const updateUI = function (currentAccount) {
  displayMovements(currentAccount);
  calcPrintBalance(currentAccount);
  calcDisplaySummary(currentAccount);
};

let currentAccount, timerUpdate;

// const day = `${now.getDate()}`.padStart(2, 0);
// const month = `${now.getMonth()}`.padStart(2, 0);
// const year = now.getFullYear();
// const hour = `${now.getHours()}`.padStart(2, 0);
// const min = `${now.getMinutes()}`.padStart(2, 0);
// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
const now = new Date();

const userLogOut = () => {
  let startTime = 5 * 60; // starting time in seconds

  const intervalStartBegin = () => {
    let min = String(Math.trunc(startTime / 60)).padStart(2, '0');
    let sec = String(startTime % 60).padStart(2, '0');
    let formattedTime = `${min}:${sec}`;
    labelTimer.textContent = `${formattedTime}`;
    if (startTime === 0) {
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
      clearInterval(timerUpdate);
    }
    startTime--;
  };

  intervalStartBegin(); // Initialize the timer display immediately
  const timerUpdate = setInterval(intervalStartBegin, 1000); // Update the timer every second
  return timerUpdate;
};

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  // Check Credintials
  timerUpdate ? clearInterval(timerUpdate) : timerUpdate;
  timerUpdate = userLogOut();
  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(now);

  // Validate Pin Entered
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // The user can login successfully
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginPin.blur();
    inputLoginPin.value = inputLoginUsername.value = '';
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const currReciver = accounts.find(
    (acc) => inputTransferTo.value === acc.userName
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    currReciver &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    currReciver?.userName !== currentAccount.userName
  ) {
    currReciver.movements.push(amount);
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    currReciver.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
  inputTransferAmount.blur();
  inputTransferTo.blur();
});

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  let amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    setTimeout(() => updateUI(currentAccount), 3000);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    let delIdx = accounts.findIndex(
      (curr) => curr.userName === currentAccount.userName
    );
    console.log(delIdx);
    accounts.splice(delIdx, 1);
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
  inputCloseUsername.blur();
  inputClosePin.blur();
});

let isSorted = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !isSorted);
  isSorted = !isSorted;
});

// const future = new Date(2037, 10, 19, 25, 33);
// console.log(future.getDay());
