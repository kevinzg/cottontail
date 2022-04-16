import App from './App.svelte';
import './tailwind.css';
import { style as TiptapCSS } from '@tiptap/core/src/style';
import './main.css';

const styleElement = window.document.createElement('style');
styleElement.textContent = TiptapCSS;
window.document.head.appendChild(styleElement);

const app = new App({
    target: document.getElementById('app')!,
});

export default app;
