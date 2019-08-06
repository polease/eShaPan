import Vue from "vue";
import Vuex from "vuex";
import {
  getBook,
  getBooks,
  getList,
  getListTypes
} from "../services/list-service";
 

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
      const types = await getListTypes();
      commit("setListTypes", types);

      const book = await getBook(1);
      commit("setCurrentBook", book);

      let books = await getBooks();
      commit("setBooks", books);
    },
    async getList({ id, commit }) {
      const list = await getList(id);
      commit("setCurrentList", list);
    }
  }
});
