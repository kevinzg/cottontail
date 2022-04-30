const theme = require('tailwindcss/defaultTheme');

// From https://github.com/tailwindlabs/tailwindcss/issues/800#issuecomment-974620969
const deepMap = (val, fn) => {
    const it = (val) => {
        if (Array.isArray(val)) {
            return val.map(it);
        }
        if (typeof val === 'object') {
            const res = {};
            for (const key of Object.keys(val)) {
                res[key] = it(val[key]);
            }
            return res;
        }
        return fn(val);
    };
    return it(val);
};

const emify = (val) => {
    if (typeof val === 'string') {
        val = val.replace(/((\d*\.)?\d+)rem\b/g, (_, num) => `${num}em`);
    }
    return val;
};

module.exports = {
    content: ['./src/**/*.svelte'],
    theme: {
        spacing: {
            ...deepMap(theme.spacing, emify),
        },
        fontSize: {
            ...deepMap(theme.fontSize, emify),
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
};
