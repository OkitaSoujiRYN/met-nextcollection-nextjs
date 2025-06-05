/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/app/components/**/*.{js,ts,jsx,tsx}",
        "./src/lib/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                // Couleur personnalisée pour le MET par exemple
                metRed: "#A50000",
                metGray: "#F5F5F5",
            },
        },
    },
    plugins: [],
};
