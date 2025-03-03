
const routes = {
	'/login': { templateId: 'login', title: 'Login', style: 'style.css' },
	'/dashboard': { templateId: 'dashboard', title: 'Dashboard' },
	'/credits': { templateId: 'credits', title: 'Credits', style: 'credits.css' },
};

async function register() {
	const registerForm = document.getElementById('registerForm');
	const formData = new FormData(registerForm);
	const data = Object.fromEntries(formData);
	const jsonData = JSON.stringify(data);
	const result = await createAccount(jsonData);
	if (result.error == "User already exists")
	{
		document.getElementById('userError').hidden = false;
	} else {
		console.log('Account created!', result);
	}
}

async function createAccount(account) {
	try {
		const response = await fetch('//localhost:5000/api/accounts', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: account
		});
		return await response.json();
	} catch (error) {
		return { error: error.message || 'Unknown error' };
	}
}

function updateRoute() {
	const path = window.location.pathname;
	const route = routes[path];

	if (!route) {
		return navigate('/login');
	}

	if (route.style) {
		const style = document.getElementById('stylesheet');
		style.href = route.style;
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
}

function navigate(path) {
	window.history.pushState({}, path, path);
	
	updateRoute();
}

function onLinkClick(event) {
	event.preventDefault();
	navigate(event.target.href);
}

window.onpopstate = () => updateRoute();
updateRoute();

// updateRoute('login');