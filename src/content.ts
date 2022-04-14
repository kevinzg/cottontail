import browser from 'webextension-polyfill';

import Cottontail from './Cottontail.svelte';
import './main.css';

const get = (): Cottontail => {
    let w = window as any;
    if (w.__cottontail__) {
        return w.__cottontail__;
    }

    console.info('Cottontail loading');

    const div = document.createElement('div');
    document.body.appendChild(div);

    const app = new Cottontail({
        target: div,
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
