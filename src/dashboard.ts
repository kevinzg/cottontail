import Dashboard from './Dashboard.svelte';
import './tailwind.css';
import './main.css';

const app = new Dashboard({
    target: document.getElementById('app')!,
});

export default app;
