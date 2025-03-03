
const routes = {
	'/login': { templateId: 'login', title: 'Login' },
	'/dashboard': { templateId: 'dashboard', title: 'Dashboard' },
	'/credits': { templateId: 'credits', title: 'Credits' },
};

function updateRoute() {
	const path = window.location.pathname;
	const route = routes[path];

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