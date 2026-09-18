/* eslint-env jest */
jest.mock('@react-native-async-storage/async-storage', () => ({
	getItem: jest.fn(() => Promise.resolve(null)),
	setItem: jest.fn(() => Promise.resolve()),
	removeItem: jest.fn(() => Promise.resolve()),
	clear: jest.fn(() => Promise.resolve()),
}));
jest.mock('react-native-gesture-handler', () => ({
	PanGestureHandler: 'PanGestureHandler',
	TapGestureHandler: 'TapGestureHandler',
	GestureHandlerRootView: 'GestureHandlerRootView',
	State: {},
	Directions: {},
}));
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('react-native-webview', () => ({ WebView: 'WebView' }));
jest.mock('react-native-image-picker', () => ({
	launchCamera: jest.fn(),
	launchImageLibrary: jest.fn(),
}));
jest.mock('@react-native-community/geolocation', () => ({
	getCurrentPosition: jest.fn(),
}));
jest.mock('./src/services/authService', () => ({
	getUser: jest.fn(() => Promise.resolve(null)),
	signIn: jest.fn(),
	signUp: jest.fn(),
	signInAsGuest: jest.fn(),
	logout: jest.fn(),
	resetPassword: jest.fn(),
}));

const mockCreateNavigationMock = () => {
	const Navigator = ({ children, initialRouteName }) => {
		const screens = Array.isArray(children) ? children : [children];
		const activeScreen = screens.find(screen => screen?.props?.name === initialRouteName) || screens[0];
		const Component = activeScreen?.props?.component;
		return Component ? React.createElement(Component, { navigation: {} }) : null;
	};

	const Screen = () => null;
	const createNavigator = () => ({ Navigator, Screen });
	return {
		Navigator,
		Screen,
		createStackNavigator: createNavigator,
		createNativeStackNavigator: createNavigator,
		createBottomTabNavigator: createNavigator,
	};
};

const React = require('react');
jest.mock('@react-navigation/stack', () => mockCreateNavigationMock());
jest.mock('@react-navigation/native-stack', () => mockCreateNavigationMock());
jest.mock('@react-navigation/bottom-tabs', () => mockCreateNavigationMock());