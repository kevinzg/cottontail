import Cottontail from './Cottontail.svelte';
import './main.css';

const div = document.createElement('div');
document.body.appendChild(div);

const app = new Cottontail({
    target: div,
});

export default app;
