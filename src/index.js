import Vue3ConfirmDialog from './vue3-confirm-dialog.vue'
import EventBus from './eventBus'

var confirmFunction = paramsList => {
    if (paramsList.length !== 1) {
        throw new Error(
            `Vue3 Confirm dialog: function $confirm() expects exactly one parameter`
        )
    }
    let params = {};

    if (typeof paramsList != 'object' || Array.isArray(paramsList)) {
        params = paramsList[0];
    }

    if (params.hasOwnProperty('callback') && typeof params.callback != 'function') {
        let callbackType = typeof params.callback
        throw new Error(
            `Vue3 Confirm dialog: Callback type must be an function. Caught: ${callbackType}. Expected: function`
        )
    }
    EventBus.emit('open', params);
}

function target() {}

let handler = {
    apply: (target, thisArg, argumentsList) => {
        return confirmFunction(argumentsList);
    },
    get: (target, prop, receiver) => {
        if (prop === 'close'){
            EventBus.emit('close')
            return true
        }
        return false
    },
}

//Composition API / Vuex
export const confirm = new Proxy(target, handler);

export default {
    emits: ['open', 'close'],
    install: (app, args = {}) => {

        app.component(args.componentName || 'vue3-confirm-dialog', Vue3ConfirmDialog)

        //options API
        app.config.globalProperties.$confirm = confirm;

        //Composition API
        app.provide('@zapadale/vue3-confirm-dialog', confirm)
    },
}
