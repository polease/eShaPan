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
        .catch(error => {
          console.log(error);
          commit("setError", true);
          commit("setLoaded", true);
        });
    },
    getCurrentListDetails({ id, commit }) {
      emulateGetListDetails()
        .then(success => {
          commit("setCurrentList", success);
          commit("setLoaded", true);
          commit("setError", false);
        })
        .catch(error => {
          console.log(error);
          commit("setError", true);
          commit("setLoaded", true);
        });
    },
    addListItem({ commit, state }, item, index) {
      //state
      //save to server
    },
    deleteProduct({ commit, state }, payload) {
      // delete data from JSON (not exactly)
      emulateDeleteRequest()
        .then(success => {
          console.log(success);
          // if success start searching and deleting data in products

          // if we want to delete several products
          if (toString.call(payload) === "[object Array]") {
            for (let i = 0; i < payload.length; i++) {
              for (let j = 0; j < state.products.length; j++) {
                if (state.products[j].id === payload[i].id) {
                  commit("deleteProduct", j);
                }
              }
            }
          }
          // if we want to delete one product
          else if (toString.call(payload) === "[object Object]") {
            for (let j = 0; j < state.products.length; j++) {
              if (state.products[j].id === payload.id) {
                commit("deleteProduct", j);
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
          commit("setDeletingError", true);
        });
    }
  }
});
