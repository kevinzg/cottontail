import browser from 'webextension-polyfill';

import Cottontail from './Cottontail.svelte';

import BaseCSS from './base.css';
import TailwindCSS from './tailwind.css';
import MainCSS from './main.css';

const get = (): Cottontail => {
    let w = window as any;
    if (w.__cottontail__) {
        return w.__cottontail__;
    }

    console.info('Cottontail loading');

    const div = window.document.createElement('div');
    window.document.body.appendChild(div);

    const shadowRoot = div.attachShadow({ mode: 'open' });

    const styleElement = window.document.createElement('style');
    styleElement.textContent = [BaseCSS, TailwindCSS, MainCSS].join('\n');

    shadowRoot.appendChild(styleElement);

    const app = new Cottontail({
        target: shadowRoot,
    });
    app.$on('save', async (ev) => {
        const resp = await browser.runtime.sendMessage({ card: ev.detail });
        console.log('Cottontail', resp);
    });

    w.__cottontail__ = app;
    return app;
};

try {
    get().open();
} catch (err) {
    console.error(err);
}
