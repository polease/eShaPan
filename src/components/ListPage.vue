<template>
  <v-container v-resize="onResize" id="listpage">
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
      <div class="list-meta mb-3">{{currentList.createdTime}}</div>
    </v-row>
    <v-row>
      <v-bottom-navigation v-if="$vuetify.breakpoint.smAndDown" v-model="bottomNav" app>
        <router-link :to="{name: 'listview', params: {id: $route.params.uuid}}" tag="v-btn">
          <v-btn value="list">
            List
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
        </router-link>
        <router-link
          :to="{name: 'tableview', params: {id: $route.params.uuid, pan: pan}}"
          tag="v-btn"
        >
          <v-btn value="table">
            Table
            <v-icon>mdi-table</v-icon>
          </v-btn>
        </router-link>
        <router-link
          v-for="pan in currentList.pans"
          :key="pan.uuid"
          :to="{name: 'panview', params: {id: $route.params.uuid, pan:pan}}"
          tag="v-tab"
        >
          <v-btn>
            {{pan.title}}
            <v-icon>mdi-image-filter-hdr</v-icon>
          </v-btn>
        </router-link>
      </v-bottom-navigation>
      <v-tabs class="views" v-else>
        <router-link :to="{name: 'listview', params: {id: $route.params.uuid}}" tag="v-tab">
          <v-tab>
            <v-icon left>mdi-format-list-bulleted</v-icon>List
          </v-tab>
        </router-link>
        <router-link :to="{name: 'tableview', params: {id: $route.params.uuid}}" tag="v-tab">
          <v-tab>
            <v-icon left>mdi-table</v-icon>Table
          </v-tab>
        </router-link>
        <router-link
          v-for="pan in currentList.pans"
          :key="pan.uuid"
          :to="{name: 'panview', params: {id: $route.params.uuid, pan:pan}}"
          tag="v-tab"
        >
          <v-tab>
            <v-icon left>mdi-image-filter-hdr</v-icon>
            {{pan.title}}
          </v-tab>
        </router-link>
      </v-tabs>
    </v-row>
    <v-row>
      <router-view></router-view>
    </v-row>

    <v-row  v-if="$vuetify.breakpoint.smAndDown">
       <v-btn fab   fixed bottom right x-small  @click="up" class="up-button">
        <v-icon>mdi-arrow-up-bold</v-icon>
      </v-btn>
      <v-btn fab   fixed bottom right x-small   @click="down">
        <v-icon>mdi-arrow-down-bold</v-icon>
      </v-btn>
    </v-row>

    <v-dialog v-model="importFileDialog">
       <v-card>
      <v-file-input
        v-model="importFilePath"
        label="Select Import List File..."
        accept="*.json"
        @change="onFileChange"
      ></v-file-input>
       </v-card>
    </v-dialog>
  </v-container>
</template>
<style lang="scss" >
.list-meta {
  font-size: 10px;
  color: gray;
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
import PanCreate from "./PanCreate.vue";
import PanView from "./PanView.vue";

import * as List from "../models/list.js";
import { saveAs } from "file-saver";
import stringify from "csv-stringify";

import { mapState } from "vuex";

export default {
  components: {
    ListView,
    TableView,
    ResourceView,
    TimelineView,
    PanCreate,
    PanView
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
      fab: false,
      isMobile: false,
      bottomNav: "list",
      importFilePath: null,
      importFileDialog: false,
      panCreateDialog: false
    };
  },
  methods: {
 up() {
      window.scrollBy(0, -100);
    },
    down() {
      window.scrollBy(0, 100);
    },
    listNameUpdated() {
      this.$store.dispatch(
        "updateCurrentListName",
        this.$store.state.currentList.name
      );
    },
    async exportListToJson(list) {
      var myJSON = JSON.stringify(list);

      var blob = new Blob([myJSON], { type: "text/plain;charset=utf-8" });
      let name = `${list.name} ${new Date().toLocaleString()}.json`;
      saveAs(blob, name);
    },
    async exportListToCsv(list) {
      let cols = list.definition.map(col => col.value);
      var myJSON = stringify(list.items, { columns: cols });

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

