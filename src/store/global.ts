import {defineStore} from "pinia";

export interface GlobalStore {
    mobile: boolean,
}

export const useGlobalStore = defineStore('globalStore', {
    state: (): GlobalStore => {
        return {
            mobile: false
        }
    },
    getters: {
    },
    actions: {
    }
})