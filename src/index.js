import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <GoogleOAuthProvider clientId="594952063409-cb5s7mnmo15eqcflofmgoajldfci8n32.apps.googleusercontent.com"><App /></GoogleOAuthProvider>
);

