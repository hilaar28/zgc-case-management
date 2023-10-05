
import './App.css';
import '@fontsource/poppins/100.css'
import '@fontsource/poppins/100-italic.css'
import '@fontsource/poppins/200.css'
import '@fontsource/poppins/200-italic.css'
import '@fontsource/poppins/300.css'
import '@fontsource/poppins/300-italic.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/400-italic.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/500-italic.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/600-italic.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/700-italic.css'
import '@fontsource/poppins/800.css'
import '@fontsource/poppins/800-italic.css'
import '@fontsource/poppins/900.css'
import '@fontsource/poppins/900-italic.css'
import '@fontsource/public-sans';


import AppWrapper, { Route } from '@xavisoft/app-wrapper';
import Navbar from './components/Navbar';
import Test from './pages/Test';
import { Provider } from 'react-redux';
import store from './store';
import Footer from './components/Footer';
import Login from './pages/Login';
import Component from '@xavisoft/react-component';
import Menu from './pages/Menu';
import Users from './pages/Users';
import CaseEditor from './components/CaseEditor';
import NotFound from './pages/NotFound';
import Cases from './pages/Cases';
import Reports from './pages/Reports';
import ErrorBoundary from './components/ErrorBoundary';


Component.prototype.updateState = function (updates={}) {
	return new Promise(resolve => {
		const state = this.state || {};
		const newState = { ...state, ...updates }
		this.setState(newState, resolve);
	})
}

Component.prototype.overwriteState = function (newState={}) {
	return new Promise(resolve => {
		const oldState = { ...this.state };
		
		for (let key in oldState)
			oldState[key] = undefined;

		const effectiveState = { ...oldState, ...newState }
		this.setState(effectiveState, resolve);

	});
}

function setDimensions() {
	
	const width = window.innerWidth + 'px';
	const height = window.innerHeight + 'px';

	document.documentElement.style.setProperty('--window-width', width);
	document.documentElement.style.setProperty('--window-height', height);

}



window.addEventListener('resize', setDimensions);
setDimensions();

function App() {

	let router;

	if (window.electron)
		router = 'hash';

	return <ErrorBoundary>
		<Provider store={store}>
			<AppWrapper router={router}>

				<Navbar />

				<Route path="/" component={Login} />
				<Route path="/login" component={Login} />
				<Route path="/menu" component={Menu} />
				<Route path="/users" component={Users} />
				<Route path="/cases" component={Cases} />
				<Route path="/reports" component={Reports} />

				<Route path="/test" component={Test} />

				<Route path="*" component={NotFound} />

				<Footer />
				<CaseEditor />

			</AppWrapper>
		</Provider>
	</ErrorBoundary>
}

export default App;