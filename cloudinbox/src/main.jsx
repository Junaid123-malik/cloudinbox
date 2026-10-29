import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './aws-amplify';

import 'aws-amplify/auth/enable-oauth-listener';


createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
