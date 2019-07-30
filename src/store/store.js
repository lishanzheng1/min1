import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export const store = new Vuex.Store({
    state: {
        username: "",
        sessionId: ""
    },
    getters: {},
    mutations: {
        getSessionId: (state, sessionId) => {
            state.sessionId = sessionId

        },
        changeUsername: (state, username) => {
            state.username = username;
        },

    }

})
