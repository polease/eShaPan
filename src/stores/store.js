import Vue from "vue";
import Vuex from "vuex";
import shortid from "shortid";

import * as ListService from "../services/list-service";
 

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    books: [],
    currentBook: {},
    currentList: {},
    listTypes: [],
    loaded: false, // sets if JSON data loaded
    errorDeleting: false // error deleting
  },
  getters: {},
  mutations: {
    setBooks(state, payload) {
      state.books = payload;
    },
    setCurrentBook(state, payload) {
      state.currentBook = payload;
    },
    setListTypes(state, payload) {
      state.listTypes = payload;
    },
    setCurrentList(state, payload) {
      state.currentList = payload;
    },
    setLoaded(state, payload) {
      state.loaded = payload;
    },
    setDeletingError(state, payload) {
      state.errorDeleting = payload;
    },
    addListItem(state, payload, index) {
      state.currentList.items.splice(index, 0, payload);
    }
  },
  actions: {
    async getBooks({ commit }) {
      // get data from JSON
      const types = await ListService.getListTypes();
      commit("setListTypes", types);

      const book = await ListService.getBook(1);
      commit("setCurrentBook", book);

      let books = await ListService.getBooks();
      commit("setBooks", books);
    },
    async getList({ commit }, id) {
      const list = await ListService.getList(id);
      commit("setCurrentList", list);
    }, 
    async createListItem({commit}, index){
      let newItem = { name: "", id: shortid.generate(), level: 0 };
      this.state.currentList.items.splice(index + 1, 0, newItem);
    },
    async saveCurrentList(){
      await ListService.saveList(this.state.currentList);
    }
  }
});
