import Dashboard from './Dashboard.svelte';
import './main.css';

const app = new Dashboard({
    target: document.getElementById('app')!,
});

export default app;
