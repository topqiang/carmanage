import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
    count: 10,
    e_id: sessionStorage.getItem('e_id') || ''
}

// 定义所需的 mutations
const mutations = {
    INCREMENT(state) {
        state.count++
    },
    DECREMENT(state) {
        state.count--
    },
    saveId(state, id) {
        state.e_id = id
        sessionStorage.setItem('e_id', id)
    },
    loginOut(state) {
        state.e_id = ''
        sessionStorage.removeItem('e_id')
    }
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})
