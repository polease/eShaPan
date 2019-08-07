import Vue from "vue";
import Vuex from "vuex";
import shortid from "shortid";

import {newList} from "../models/list"

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
    },
    newList(state, payload, index){
      state.currentList = payload;
      state.currentBook.lists.splice(index,0,payload);
    }
  },
  actions: {
    async getBooks({ commit }) {
      // get data from JSON
      const types = await ListService.getListTypes();
      commit("setListTypes", types);

      let books = await ListService.getBooks();
      commit("setBooks", books);

      let book = await ListService.getBook(books[0]);
      commit("setCurrentBook", book);

      if(book.lists.length > 0)
        await this.getList({commit}, book.lists[0].id);
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
    },
    async newList({commit}, index){
      let baseTypes = this.state.listTypes.filter(i=>i.type === "default");
      let newList = newList(baseTypes);
      commit("newList", newList,index);
    }
  }
});
