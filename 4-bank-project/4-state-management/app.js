let state = Object.freeze({
	account: null
});
const baseURL = '//localhost:5000';
const accountURL = 'api/accounts';
const storageKey = 'savedAccount';

const routes = {
	'/login': { templateId: 'login', title: 'Login', style: 'login.css' },
	'/dashboard': { templateId: 'dashboard', title: 'Dashboard', style: 'dashboard.css', init: refresh },
	'/transactions': { templateId: 'transaction-template', title: 'Transactions', style: 'transaction.css' },
	'/credits': { templateId: 'credits', title: 'Credits', style: 'credits.css' },
};


// Helper function to get element by id and update its text content
function updateElement(id, textOrNode)
{	
	const element = document.getElementById(id);
	element.textContent = '';
	element.hidden = false;
	element.append(textOrNode);
}


// Gets login form data and sends a request to the server
async function login()
{
	const loginForm = document.getElementById('loginForm')
	const user = loginForm.user.value;
	const data = await sendRequest('/api/accounts/' + encodeURIComponent(user));
  
	if (data.error) {
		updateElement('loginError', data.error);
		return console.log('loginError', data.error);
	}
  
	// account = data;
	localStorage.setItem(storageKey, user);
	updateState('account', data);
	navigate('/dashboard');
}

function logout() {
	localStorage.removeItem(storageKey);
	updateState('account', null);
	navigate('/login');
}

// Gets register form data and sends a POST request to the server
async function register()
{
	const registerForm = document.getElementById('registerForm');
	const formData = new FormData(registerForm);
	const data = Object.fromEntries(formData);
	const jsonData = JSON.stringify(data);
	const result = await sendRequest('/api/accounts', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: jsonData
	});

	if (result.error)
	{
		updateElement('userError', result.error);
		
	} else {
		console.log('Account created!', result);
		// account = result;
		localStorage.setItem(storageKey, result.user);
		updateState('account', result);
		navigate('/dashboard');
	}
}

// Helper function to send a request to the server
async function sendRequest(endpoint, options = {}) {
    try {
		console.log('Sending request to:', baseURL + endpoint);
        const response = await fetch(baseURL + endpoint, options);
        return await response.json();
    } catch (error) {
        return { error: error.message || 'Unknown error' };
    }
}


function newTransaction()
{
	const transactionForm = document.getElementById('transaction-form');
	const formData = new FormData(transactionForm);
	const data = Object.fromEntries(formData);
	const jsonData = JSON.stringify(data);
	const result = sendRequest('/api/accounts/' + encodeURIComponent(state.account.user) + '/transactions', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: jsonData
	});
	if (result.error)
	{
		console.log('Error creating transaction', result);
	}
	refresh();
	navigate('/dashboard');
}

// Clones the transaction template and fills it with data
function createTransactionRow(transaction)
{
	const template = document.getElementById('transaction');
	const transactionRow = template.content.cloneNode(true);
	const tr = transactionRow.querySelector('tr');
	tr.children[0].textContent = transaction.date;
	tr.children[1].textContent = transaction.object;
	tr.children[2].textContent = transaction.amount.toFixed(2);
	return transactionRow;
}


// Updates the dashboard with the account data
function updateDashboard()
{
	const account = state.account;
	if (!account) {
		return navigate('/login');
	}
  
	updateElement('description', account.description);
	updateElement('balance', account.balance.toFixed(2));
	updateElement('currency', account.currency);
	
	const transactionsRows = document.createDocumentFragment();
	
	for (const transaction of account.transactions) {
		const transactionRow = createTransactionRow(transaction);
		transactionsRows.appendChild(transactionRow);
	}

	updateElement('transactions', transactionsRows);
}

async function updateAccountData() {
	const account = state.account;
	if (!account) {
		return logout();
	}
  
	const data = await sendRequest('/api/accounts/' + encodeURIComponent(account.user));
	if (data.error) {
		return logout();
	}
  
	updateState('account', data);
}

function updateState(property, newData) {
	state = Object.freeze({
		...state,
		[property]: newData
	});
	localStorage.setItem(storageKey, JSON.stringify(state.account));
}

// On navigation, update the route and the view using templates
function updateRoute()
{
	const path = window.location.pathname;
	const route = routes[path];

	// When invalid path or home page
	if (!route) {
		return navigate('/dashboard');
	}

	document.title = route.title;

	if (route.templateId == 'dashboard') {
		console.log('Dashboard is shown');
	}

	const template = document.getElementById(route.templateId);
	const view = template.content.cloneNode(true);
	const app = document.getElementById('app');
	app.innerHTML = '';
	app.appendChild(view);
	
	if (route.style) {
		const style = document.getElementById('stylesheet');
		style.href = route.style;
	}

	if (typeof route.init === 'function') {
		route.init();
	}
}

async function refresh() {
	await updateAccountData();
	updateDashboard();
}

// Navigate to the given path
function navigate(path)
{
	window.history.pushState({}, path, path);	
	updateRoute();
}


// Prevent default behavior and navigate to the href
function onLinkClick(event)
{
	event.preventDefault();
	navigate(event.target.href);
}


// Checks localStorage for an account
async function init() {
	const savedAccount = localStorage.getItem(storageKey);
	if (savedAccount) {
		// local storage account exists but is not in state
		// This allows to reload page and still be logged in
		updateState('account', JSON.parse(savedAccount));
		await updateAccountData();
	}
	window.onpopstate = () => updateRoute();
	updateRoute();
}

init();