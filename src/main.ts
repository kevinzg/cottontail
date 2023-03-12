import App from './DevApp.svelte';
import './base.css';
import './tailwind.css';
import './main.css';

const app = new App({
    target: document.getElementById('app')!,
});

export default app;
