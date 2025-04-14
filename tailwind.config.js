/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/Public/Pages/**/*.html', './src/Views/**/*.ejs', './index.html'],
    theme: {
        extend: {
            colors: {
                'mobile-nav': '#101010d9',
                nav: '#0a0a0ad9',
                'main-bg': '#0a0a0a',
                'content-bg': '#181818',
                'primary-text': '#f3f5f7', // màu cho phần tên user hay nội dung
                'secondary-text': '#777', // màu cho phần timestamp 1 day hay Picked for you
                'border-color': '#2d2d2d',
            },
            fontFamily: {
                'main-font': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
            },
            fontSize: {
                'main-size': '15px', // font ở vùng nội dung status
            },
            fontWeight: {
                'content-weight': '400', // font ở vùng nội dung status
                'user-weight': '600', // font ở vùng tên user
            },
            screens: {
                tbl: '700px',
                pc: '792px',
                'lg-desktop': '1200px',
                'md-desktop': { min: '1100px', max: '1199px' },
                'sm-desktop': { min: '956px', max: '1099px' },
                tablet: { min: '768px', max: '955px' },
                'landscape-mobile': { max: '767px' },
                'sm-tablet': '520px',
                'portrait-mobile': { max: '519px' },
                'flexible-decoration': { raw: '(max-height: 860px)' },
                'signup-footer': { raw: '(max-height: 680px)' },
            },
        },
    },
    plugins: ['@tailwindcss/aspect-ratio'],
};
