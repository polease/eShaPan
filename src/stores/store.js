import Vue from "vue";
import Vuex from "vuex";
import {
  emulateGetListTypes,
  emulateGetListDetails
} from "../services/requests";

// Также можно использовать async/await
/*async function getData() {
  try {
    let data = await emulateGetRequest();
    return data;
  }
  catch(err) {
    console.log(err);
  }
}*/

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    books: [],
    currentBookListMeta: [],
    currentList: {},
    listTypes: [],
    loaded: false, // sets if JSON data loaded
    errorDeleting: false // error deleting
  },
  getters:{
     
  },
  mutations: {
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
    getData({ commit }) {
      // get data from JSON
      emulateGetListTypes()
        .then(success => {
          commit("setListTypes", success);
          commit("setLoaded", true);
          commit("setError", false);
        })
        .catch(() => { 
          commit("setError", true);
          commit("setLoaded", true);
        });
    },
    getCurrentListDetails({ id, commit }) {
      emulateGetListDetails(id)
        .then(success => {
          commit("setCurrentList", success);
          commit("setLoaded", true);
          commit("setError", false);
        })
        .catch(() => {
          commit("setError", true);
          commit("setLoaded", true);
        });
    },

  }
});
