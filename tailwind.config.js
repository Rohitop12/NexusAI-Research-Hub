import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: '#08080A',
                'accent-blue': '#0055FF',
                'accent-yellow': '#FFD600',
                // New Design System
                'bg-main': '#F7F7F8',
                'bg-card': '#FFFFFF',
                'ui-border': '#E5E7EB',
                'ui-divider': '#D1D5DB',
                'text-sec': '#9CA3AF',
                'ui-muted': '#6B7280',
                'ui-heading': '#111827',
                'ui-navbar': '#1F2937',
                'ui-black': '#000000',
            }
        },
    },

    plugins: [forms],
};
