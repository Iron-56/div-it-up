let account = null;
const baseURL = '//localhost:5000';
const accountURL = 'api/accounts';

const routes = {
	'/login': { templateId: 'login', title: 'Login', style: 'login.css' },
	'/dashboard': { templateId: 'dashboard', title: 'Dashboard', style: 'dashboard.css', init: updateDashboard },
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
  
	account = data;
	navigate('/dashboard');
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
		account = result;
		navigate('/dashboard');
	}
}


// Helper function to send a request to the server
async function sendRequest(url, params = {}) {
    try {
		console.log('Sending request to:', baseURL + url);
        const response = await fetch(baseURL + url, params);
        return await response.json();
    } catch (error) {
        return { error: error.message || 'Unknown error' };
    }
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


// On navigation, update the route and the view using templates
function updateRoute()
{
	const path = window.location.pathname;
	const route = routes[path];

	// When invalid path or home page
	if (!route) {
		return navigate('/login');
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


// Event listener for back or forward buttons
window.onpopstate = () => updateRoute();
updateRoute();