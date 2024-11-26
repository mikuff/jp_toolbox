import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from '@svgr/rollup';

export default defineConfig({
    plugins: [react(), svgr(),],
})
