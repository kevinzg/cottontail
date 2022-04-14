import Cottontail from './Cottontail.svelte';
import './main.css';

const get = (): Cottontail => {
    let w = window as any;
    if (w.__cottontail__) {
        return w.__cottontail__;
    }
    console.info('Loading Cottontail');
    const div = document.createElement('div');
    document.body.appendChild(div);
    w.__cottontail__ = new Cottontail({
        target: div,
    });
    return w.__cottontail__;
};

try {
    get().open();
} catch (err) {
    console.error(err);
}
