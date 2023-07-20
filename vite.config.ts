import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import {NaiveUiResolver} from "unplugin-vue-components/resolvers";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import babel from 'vite-plugin-babel';
import legacy from '@vitejs/plugin-legacy'

export default defineConfig(({mode})=>{
    return {
        server:{
            host:'0.0.0.0'
        },
        base:'/',
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        plugins: [
            vue(),
            AutoImport({
                imports: [
                    'vue',
                    {
                        'naive-ui': [
                            'useDialog',
                            'useMessage',
                            'useNotification',
                            'useLoadingBar'
                        ]
                    }
                ]
            }),
            Components({
                resolvers: [NaiveUiResolver()]
            }),
            vueJsx(),
            babel(),
            legacy({
                targets: ['defaults', 'ie >= 11', 'chrome 52'],
                additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
                renderLegacyChunks:true,
                polyfills:[
                    'es.symbol',
                    'es.array.filter',
                    'es.array.map',
                    'es.array.find',
                    'es.promise',
                    'es.promise.finally',
                    'es/map',
                    'es/set',
                    'es.array.for-each',
                    'es.object.define-properties',
                    'es.object.define-property',
                    'es.object.get-own-property-descriptor',
                    'es.object.get-own-property-descriptors',
                    'es.object.keys',
                    'es.object.to-string',
                    'web.dom-collections.for-each',
                    'esnext.global-this',
                    'esnext.string.match-all'
                ]
            }),
        ],
    }
})
