import Vue from "vue";
import Vuex from "vuex";
import shortid from "shortid";

import * as List from "../models/list";
import * as ListService from "../services/list-service";
import { cpus } from "os";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: {},
    currentBook: {},
    currentList: {},
    listTypes: [],
    loaded: false, // sets if JSON data loaded
    errorDeleting: false // error deleting
  },
  getters: {},
  mutations: {
    setCurrentUser(state, payload) {
      state.currentUser = payload;
    },
    setBooks(state, payload) {
      state.books = payload;
    },
    setCurrentBook(state, payload) {
      state.currentBook = payload;
    },
    setCurrentBookListMetas(state, listMetas){
      state.currentBook.lists = listMetas;
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
    createList(state, payload, index) {
      state.currentList = payload;
    }
  },
  actions: {
    async getUserData({ commit }) {
      // this is for testing only
      await ListService.initSampleData();

      // get data from JSON
      const types = await ListService.getListTypes();
      commit("setListTypes", types);

      let user = await ListService.getUser();
      commit("setCurrentUser", user);

      if (user.books && user.books.length > 0) {
        let book = await ListService.getBook(user.books[0].uuid);
        commit("setCurrentBook", book);

        if (book.lists && book.lists.length > 0)
          this.dispatch("getList", book.lists[0].uuid);
      }
    },
    async selectBook ({commit}, uuid){
      let book = await ListService.getBook(uuid);
      commit("setCurrentBook", book);
    },
    async getList({ commit }, uuid) {
      const list = await ListService.getList(uuid);
      commit("setCurrentList", list);
    },
    async createListItem({ commit }, index) {
      let newItem = List.newListItem(this.state.currentList);
      this.state.currentList.items.splice(index + 1, 0, newItem);
    },
    async saveCurrentList() {
      await ListService.saveList(this.state.currentList);
    },
    async createList({ commit }, index) {
      let baseTypes = this.state.listTypes.filter(i => i.type === "default");
      let newList = List.newList(baseTypes);
      commit("createList", newList, index);

      // save list
      await ListService.saveList(newList);

      // save list meta to currentBook
      let listMetas = [...this.state.currentBook.lists]; 
      listMetas.splice(index, 0, List.getListMeta(newList));
      commit("setCurrentBookListMetas", listMetas);
      await ListService.saveBook(this.state.currentBook);

    },
    async updateCurrentListName({ commit }, newName) {
      this.state.currentList.name = newName;
      let listMetas = this.state.currentBook.lists.filter(
        l => l.uuid == this.state.currentList.uuid
      );
      if (listMetas.length > 0) listMetas[0].name = newName;
    }
  }
});
