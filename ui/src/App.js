
import './App.css';
import '@fontsource/poppins'

import AppWrapper, { Route } from '@xavisoft/app-wrapper';
import Navbar from './components/Navbar';
import Test from './pages/Test';
import { Provider } from 'react-redux';
import store from './store';
import Footer from './components/Footer';
import Login from './pages/Login';
import Component from '@xavisoft/react-component';


Component.prototype.updateState = function (updates={}) {
	return new Promise(resolve => {
		const state = this.state || {};
		const newState = { ...state, ...updates }
		this.setState(newState, resolve);
	})
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

	if (window.cordova)
		router = 'hash';

	return <Provider store={store}>
		<AppWrapper router={router}>

			<Navbar />

			<Route path="/" component={Login} />
			<Route path="/login" component={Login} />

			<Route path="/test" component={Test} />

			<Footer />

		</AppWrapper>
	</Provider>
}

export default App;