import Vuex from "vuex";
import Vue from "vue"

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        cred:{
            username:'',
            password:''
        },
        prod:{
            id:'',
            name:'',
            city:''
        },
        paginator:{
            max:'',
            from:'',
            to:''
        },
        store:{
            cellNumber:'',
            quanity:'',
            cellSize:'',
            productName:''
        }
    },
    getters: {
        username: state=>{
            return state.cred.username
        },
        password: state=>{
            return state.cred.password
        },
        store: state=>{
            return state.store
        },
        prod: state=>{
            return state.prod
        },
        paginator:state=>{
            return state.paginator
        }
    },
    mutations: {
        changeU(state,info){
            state.cred.username = info
        },
        changeP(state,info){
            state.cred.password = info
        },
        changeStore(state,info){
            state.store = {...info}
        },
        changeProd(state,info){
            state.prod = {...info}
        },
        changeFrom(state,info){
            state.paginator.from = info
        },
        changeTo(state,info){
            state.paginator.to = info
        },
        changeMax(state,info){
            state.paginator.max = info
        },
    },
    actions: {}
});