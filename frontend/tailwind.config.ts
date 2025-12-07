import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                cream: {
                    50: '#FDFBF7',
                    100: '#FAF7F0',
                    200: '#F2EBE0',
                    300: '#E6DCC9',
                    900: '#3D3830',
                },
                stone: {
                    900: '#1C1917',
                    800: '#292524',
                }
            },
            fontFamily: {
                serif: ["var(--font-merriweather)", "serif"],
                sans: ["var(--font-inter)", "sans-serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
