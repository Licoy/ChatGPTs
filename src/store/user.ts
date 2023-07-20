import {defineStore} from "pinia";
import Cookies from "js-cookie";

export interface UserStore {
    colorMode: 'light' | 'dark' | 'auto',
    _sysDarkMode: boolean
}

export const useUserStore = defineStore('userStore', {
    state: (): UserStore => {
        return {
            colorMode: 'auto',
            _sysDarkMode: false,
        }
    },
    getters: {
        darkMode(): boolean {
            if(this.colorMode==='auto'){
                return this._sysDarkMode
            }
            return this.colorMode === 'dark'
        }
    },
    actions: {
        toggleColorMode() {
            if (this.colorMode == 'auto') {
                this.colorMode = 'light'
            } else if (this.colorMode == 'light') {
                this.colorMode = 'dark'
            } else {
                this.colorMode = 'auto'
            }
            Cookies.set('colorMode', this.colorMode)
        },
        bodyColorModeClassSync() {
            document.body.classList?.forEach((item) => {
                if (item.startsWith('theme-')) {
                    document.body.classList.remove(item)
                }
            })
            document.body.classList?.add('theme-'+this.colorMode)
        },
    },
    persist: true
})