import browser from 'webextension-polyfill';

import type { IFlashcardData, SaveCardMessage } from './lib/types';
import Cottontail from './Cottontail.svelte';

import BaseCSS from './base.css?inline';
import TailwindCSS from './tailwind.css?inline';
import MainCSS from './main.css?inline';

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
    app.$on('save', (ev) => {
        const card: IFlashcardData = ev.detail;
        browser.runtime
            .sendMessage({
                type: 'save-card',
                payload: {
                    card,
                },
            } satisfies SaveCardMessage)
            .then((resp) => console.log('[Cottontail] Card saved', resp))
            .catch((err) => console.error('[Cottontail] Error', err));
    });

    w.__cottontail__ = app;
    return app;
};

try {
    get().open();
} catch (err) {
    console.error('[Cottontail] App error', err);
}
