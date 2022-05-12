import {StrictMode} from 'react';
import './Styles/css/index.css';
import App from './App';
import {createRoot} from "react-dom/client"
import { Provider } from 'react-redux'
import store from './Utils/store'


const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <Provider store={store}>
      <App />
  </Provider>,
);
