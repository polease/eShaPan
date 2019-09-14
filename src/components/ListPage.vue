<template>
  <v-flex class="mx-2 my-2" fill-height align-start>
    <v-row>
      <v-text-field
        class="title mt-0 pt-0 ml-3"
        v-model="currentList.name"
        @input="listNameUpdated()"
        single-line
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-select
        class="mt-0 pt-0 list-type"
        v-model="baseTypes"
        :items="listTypes"
        item-text="name"
        item-value="key"
        prepend-icon="mdi-shape"
        attach
        chips
        persistent-hint
        multiple
        rounded
      ></v-select>
      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
            
          <v-list-item @click="importJsonAsList()">
            <v-list-item-icon>
              <v-icon>mdi-import</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Import from JSON file</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="exportListToJson(currentList)">
            <v-list-item-icon>
              <v-icon>mdi-export</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Export to JSON file</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="exportListToCsv(currentList)">
            <v-list-item-icon>
              <v-icon>mdi-export</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Export to CSV</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-row>
    <v-dialog v-model="importFileDialog">
      <v-file-input
        v-model="importFilePath"
        label="Select Import List File..."
        accept="*.json"
        @change="onFileChange"
      ></v-file-input>
    </v-dialog>
    <div class="list-meta mb-3">{{currentList.createdTime}}</div>
    <v-tabs class="views">
      <v-tab>List</v-tab>
      <v-tab v-on:click="tableViewClicked()">Table</v-tab> 
      <v-tab>Pan</v-tab>
      <v-tab-item class="mx-3 my-3">
        <list-view></list-view>
      </v-tab-item>
      <v-tab-item class="my-3">
        <table-view ref="tableView"></table-view>
      </v-tab-item>
      <v-tab-item class="my-3">
        
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

.list-type {
  max-width: 300px;
}
</style>

<script>
import ListView from "./ListView.vue";
import TableView from "./TableView.vue";
import ResourceView from "./ResourceView.vue";
import TimelineView from "./TimelineView.vue";
import PanCreate from "./PanCreate.vue"

import * as List from "../models/list.js";
import { saveAs } from 'file-saver';
import stringify from 'csv-stringify';

import { mapState } from "vuex";

export default {
  components: {
    ListView,
    TableView,
    ResourceView,
    TimelineView,
    PanCreate
  },
  computed: {
    ...mapState(["listTypes", "currentList"]),
    baseTypes: {
      get() {
        return this.currentList.baseTypes;
      },
      set(v) {
        this.$store.dispatch("updateCurrentListBaseTypes", v);
      }
    }
  },
  data() {
    return {
      importFilePath: null,
      importFileDialog: false,
      panCreateDialog : false
    };
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
    },
    async exportListToJson(list) {
      var myJSON = JSON.stringify(list);

      var blob = new Blob([myJSON], { type: "text/plain;charset=utf-8" });
      let name = `${list.name} ${new Date().toLocaleString()}.json`;
      saveAs(blob, name);
    }, 
    async exportListToCsv(list) {

      let cols = list.definition.map(col =>  col.value);
      var myJSON = stringify(list.items, {columns : cols});

      var blob = new Blob([myJSON], { type: "text/plain;charset=utf-8" });
      let name = `${list.name} ${new Date().toLocaleString()}.csv`;
      saveAs(blob, name);
    },
    async importJsonAsList() {
      this.importFileDialog = true;
    },
    onFileChange() {
      let reader = new FileReader();
      reader.onload = () => {
        let json = reader.result;
        var list = JSON.parse(json);
        this.$store.dispatch("copyList", list);
        this.importFileDialog = false;
      };
      reader.readAsText(this.importFilePath);
    } 
  }
};
</script>

