import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root');
const app = <React.StrictMode><App /></React.StrictMode>;
// Production pages already contain the same full React tree as the browser.
if (root.firstElementChild) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
