<template>
  <v-dialog v-model="dialog" persistent>
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" color="blue-grey" class="white--text">
        Edit Columns
        <v-icon right dark>mdi-shape-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Edit List Columns</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-flex class="table-view">
            <v-data-table :headers="headers" :items="definition" class="elevation-1">
              <template v-slot:item.text="{item}">
                <td class="list-item-field-container">
                  <v-text-field
                    v-model="item.text"
                    single-line
                    class="pa-0 list-item-field"
                    flat
                    hide-no-data
                    hide-details
                  />
                </td>
              </template>
              <template v-slot:item.value="{item}">
                <td class="list-item-field-container">
                  <v-text-field
                    v-if="item.type === 'custom' || !item.type"
                    v-model="item.value"
                    single-line
                    class="pa-0 list-item-field"
                    flat
                    hide-no-data
                    hide-details
                  />
                  <span v-else>{{item.value}}</span>
                </td>
              </template>
              <template v-slot:item.dataType="{item}">
                <td class="list-item-field-container">
                  <v-row v-if="!item.type || item.type === 'custom'">
                    <v-select
                      v-model="item.dataType"
                      :items="dataTypes"
                      item-text="name"
                      item-value="value"
                      flat
                      hide-no-data
                      hide-details
                      dense
                      @change="itemTypeChanged(item)"
                    />
                    <tag-definition-edit v-if="item.dataType === 'tag'" :tags="item.tags" @save="item.tags = $event"></tag-definition-edit>
                  </v-row>
                </td>
              </template>
               <template v-slot:item.width="{item}">
                <td class="list-item-field-container">
                  <v-text-field
                    v-if="item.type === 'custom' || !item.type || item.type ==='default'"
                    v-model="item.width"
                    single-line
                    class="pa-0 list-item-field"
                    flat
                    hide-no-data
                    hide-details
                  /> 
                </td>
              </template>
              <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="moveFieldUp(item)">mdi-menu-up</v-icon>
                <v-icon small class="mr-2" @click="moveFieldDown(item)">mdi-menu-down</v-icon>

                <v-icon small class="mr-2" @click="addField(item)">mdi-table-row-plus-before</v-icon>
                <v-icon
                  v-if="item.type === 'custom' || !item.type"
                  small
                  @click="deleteField(item)"
                >mdi-delete</v-icon>
              </template>
            </v-data-table>
          </v-flex>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" text @click="updateDefinition()">Save</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog></v-dialog>
  </v-dialog>
</template>

<style lang="scss">
.table-view {
  .list-item-prefix {
    color: gray;
    padding-top: 10px;
    padding-left: 10px;
    text-align: center;
    width: 14px;
    font-size: 10px;
  }

  .list-item-field-container {
    padding: 0px;
  }

  .list-item-field {
    width: 100%;
  }

  .v-text-field input {
    font-size: 0.8em;
  }
}
</style>

<script>
import { mapState } from "vuex";
import cloneDeep from "clone-deep";
import TagDefinitionEdit from "./TagDefinitionEdit.vue";

//var jmespath = require("jmespath");

export default {
  components: {TagDefinitionEdit},
  data() {
    return {
      dialog: false,
      definition: [],
      headers: [
        { text: "Type", value: "type" },
        { text: "Name", value: "text" },
        { text: "Key", value: "value" },
        { text: "Field Type", value: "dataType" },
        { text: "From", value: "from" },
        { text: "Default Value", value: "defaultValue" },
        { text: "Width", value: "width" },
        { text: "", value: "action", sortable: false }
      ],
      dataTypes: [
        { name: "Text", value: "text" },
        { name: "Number", value: "number" },
        { name: "Date Time", value: "datetime" },
        { name: "Rich Text", value: "html" },
        { name: "Tag", value: "tag" }
      ]
    };
  },
  computed: {
    ...mapState(["currentList"])
  },
  mounted() {
    this.definition = cloneDeep(this.currentList.definition);
  },
  methods: {
    async updateDefinition() {
      this.$store.dispatch("updateCurrentListDefinition", this.definition);
      this.dialog = false;
    },
    addField(item) {
      let index = this.definition.indexOf(item);
      this.definition.splice(index + 1, 0, {
        text: "",
        value: "",
        type: "custom"
      });
    },
    deleteField(item) {
      let index = this.definition.indexOf(item);
      this.definition.splice(index, 1);
    },
    moveFieldUp(item) {
      let index = this.definition.indexOf(item);
      this.definition.splice(index, 1);
      this.definition.splice(index - 1, 0, item);
    },
    moveFieldDown(item) {
      let index = this.definition.indexOf(item);
      this.definition.splice(index, 1);
      this.definition.splice(index + 1, 0, item);
    },
    itemTypeChanged(item){
      if(item.dataType === "tag"){
        item.tags = [];
      }
    }
  }
};
</script>

