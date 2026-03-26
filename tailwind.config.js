import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                headline: ['"Space Grotesk"', ...defaultTheme.fontFamily.sans],
                body: ['Inter', ...defaultTheme.fontFamily.sans],
                mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
            },
            colors: {
                // Primary
                'primary': '#d0bcff',
                'primary-container': '#a078ff',
                'on-primary': '#3c0091',
                'on-primary-container': '#340080',

                // Secondary
                'secondary': '#4cd7f6',
                'secondary-container': '#03b5d3',
                'on-secondary': '#003640',
                'on-secondary-container': '#00424e',

                // Tertiary
                'tertiary': '#fbabff',
                'tertiary-container': '#e14ef6',
                'on-tertiary': '#580065',
                'on-tertiary-container': '#4d0059',

                // Surface
                'surface': '#131313',
                'surface-dim': '#131313',
                'surface-bright': '#393939',
                'surface-container-lowest': '#0e0e0e',
                'surface-container-low': '#1b1b1b',
                'surface-container': '#1f1f1f',
                'surface-container-high': '#2a2a2a',
                'surface-container-highest': '#353535',

                // On Surface & Outlines
                'on-surface': '#e2e2e2',
                'on-surface-variant': '#cbc3d7',
                'outline': '#958ea0',
                'outline-variant': '#494454',

                // Error
                'error': '#ffb4ab',
                'error-container': '#93000a',
                'on-error': '#690005',
                'on-error-container': '#ffdad6',
            },
        },
    },

    plugins: [forms],
};
