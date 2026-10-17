import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { seedRng } from './state/rng';
import { flags } from './state/flags';
import { bootStore } from './state/store';
import './index.css';
import './polish.css';

if (flags.seed !== null) seedRng(flags.seed);
bootStore();
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
