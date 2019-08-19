<template>
  <v-flex class="mx-2 my-2" fill-height align-start>
    <v-layout>
      <v-flex md4 lg4>
        <v-text-field
          class="title ma-0 pa-0"
          v-model="currentList.name"
          @input="listNameUpdated()"
          single-line
        ></v-text-field>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex md4 lg3>
        <v-select
          class="ma-0 pa-0"
          v-model="baseTypes"
          :items="listTypes"
          item-text="name"
          item-value="key"
          prepend-icon="mdi-shape"
          attach
          chips
          hint="List Type"
          persistent-hint
          multiple
          rounded
        ></v-select>
      </v-flex>
    </v-layout>
    <div class="list-meta mb-3">{{currentList.createdTime}}</div>
    <v-tabs class="views">
      <v-tab>List</v-tab>
      <v-tab v-on:click="tableViewClicked()">Table</v-tab>
      <v-tab>Resource</v-tab>
      <v-tab>Timeline</v-tab>
      <v-tab>Image</v-tab>
      <v-tab>Landscape</v-tab>
      <v-tab>Map</v-tab>
      <v-tab-item class="mx-3 my-3">
        <list-view></list-view>
      </v-tab-item>
      <v-tab-item class="my-3">
        <table-view ref="tableView"></table-view>
      </v-tab-item>
      <v-tab-item class="my-3">
        <resource-view></resource-view>
      </v-tab-item>
      <v-tab-item class="my-3">
        <timeline-view></timeline-view>
      </v-tab-item>
    </v-tabs>
  </v-flex>
</template>
<style lang="scss" >
.list-meta {
  margin-top: -24px;
  font-size: 10px;
  color: gray;
}
.views {
  height: 20px;
}
</style>

<script>
import ListView from "./ListView.vue";
import TableView from "./TableView.vue";
import ResourceView from "./ResourceView.vue";
import TimelineView from "./TimelineView.vue"

import { mapState } from "vuex";

export default {
  components: {
    ListView,
    TableView,
    ResourceView,
    TimelineView
  },
  computed: {
    ...mapState(["listTypes", "currentList"]),
     baseTypes: {
      get() {
        return this.currentList.baseTypes;
      },
      set(v) {
        this.$store.dispatch("updateCurrentListBaseTypes",  v);
      }
    },
  },
  data() {
    return {};
  },
  methods: {
    listNameUpdated() {
      this.$store.dispatch(
        "updateCurrentListName",
        this.$store.state.currentList.name
      );
    },
    tableViewClicked() {
      //this.$refs.tableView.setData();
    }
  }
};
</script>

