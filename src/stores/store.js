import Vue from "vue";
import Vuex from "vuex";
import shortid from "shortid";

import * as List from "../models/list";
import * as ListService from "../services/list-service";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: {},
    currentBook: {},
    currentList: {},
    currentPan: {},
    newPan: {},
    listTypes: []
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
    setCurrentBookListMetas(state, listMetas) {
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
    },
    updateListDefinition(state, definition) {
      state.currentList.definition = definition;
    },
    updateNewPan(state, payload) {
      state.newPan = payload;
    },
    updateCurrentPan(state, payload) {
      state.currentPan = payload;
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
    async selectBook({ commit }, uuid) {
      let book = await ListService.getBook(uuid);
      commit("setCurrentBook", book);
    },
    async updateBook({ commit }, book) {
      await ListService.saveBook(book);
    },
    async getList({ commit }, uuid) {
      const list = await ListService.getList(uuid);
      commit("setCurrentList", list);
    },
    async createListItem({ commit }, index) {
      let newItem = List.newListItem(this.state.currentList);
      this.state.currentList.items.splice(index + 1, 0, newItem);

      this.dispatch("saveCurrentList");
    },
    async deleteListItem({ commit }, index) {
      this.state.currentList.items.splice(index, 1);

      this.dispatch("saveCurrentList");
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
    async copyList({ commit }, fromList) {
      let newList = List.copyFrom(fromList);
      // save list
      await ListService.saveList(newList);
      commit("setCurrentList", newList);

      // save list meta to currentBook
      let listMetas = [...this.state.currentBook.lists];
      let index = listMetas.findIndex(
        meta => meta.uuid === this.state.currentList.uuid
      );
      listMetas.splice(index + 1, 0, List.getListMeta(newList));
      commit("setCurrentBookListMetas", listMetas);
      await ListService.saveBook(this.state.currentBook);
    },
    async updateCurrentListName({ commit }, newName) {
      let list = this.state.currentList;
      list.name = newName;
      let listMetas = this.state.currentBook.lists.filter(
        l => l.uuid == list.uuid
      );
      if (listMetas.length > 0) listMetas[0].name = newName;
      await ListService.updateList(list.uuid, { name: newName });

      this.dispatch("updateBook", this.state.currentBook);
    },
    async updateCurrentListBaseTypes({ commit }, baseTypeKeys) {
      let list = this.state.currentList;
      let baseTypes = this.state.listTypes.filter(type =>
        baseTypeKeys.includes(type.key)
      );

      // find all fields in baseTypes but not exists in list definitions
      let listFieldKeys = list.definition.map(listField => listField.value);
      baseTypes.forEach(type => {
        type.definition.forEach(field => {
          if (!listFieldKeys.includes(field.value))
            list.definition.splice(list.definition.length, 0, field);
        });
      });

      await ListService.updateList(list.uuid, {
        baseTypes: baseTypeKeys,
        definition: list.definition
      });
    },
    async updateCurrentListDefinition({ commit }, definition) {
      let list = this.state.currentList;
      await ListService.updateList(list.uuid, { definition: definition });

      commit("updateListDefinition", definition);
    },
    async initializeNewPan({commit}){
      let newPan = List.newPan();
      commit("updateNewPan", newPan);
    },
    async editPan({commit}, pan){
      let newPan = pan;
      commit("updateNewPan", newPan);
    },
    
    async savePan({commit}, pan){
      let list = this.state.currentList;
      let index = list.pans.findIndex(t=>t.uuid === pan.uuid);
      if(index > -1)
        list.pans.splice(index,1,pan);
      else
        list.pans.push(pan);
      
      await ListService.updateList(list.uuid, {pans : list.pans});

      commit("updateCurrentPan", pan);
      this.dispatch("initializeNewPan");

    }
  }
});
