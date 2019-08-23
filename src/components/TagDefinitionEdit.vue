<template>
  <v-dialog v-model="dialog" persistent width="600">
    <template v-slot:activator="{ on }"> 
        <v-icon v-on="on" >mdi-tag-plus</v-icon>
 
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Edit Tags</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-flex class="table-view">
            <v-data-table :headers="headers" :items="items" class="elevation-1">
               <template v-slot:item.name="{item}">
                <td class="list-item-field-container">
                  <v-text-field
                    v-model="item.name"
                    single-line
                    class="pa-0 list-item-field"
                    flat
                    hide-no-data
                    hide-details
                  />
                </td>
              </template>
                
              <template v-slot:item.color="{item}">
                <td class="list-item-field-container">
                  <v-dialog  width="300">
                    <template v-slot:activator="{ on }">
                      <v-btn :color="item.color" v-on="on">
                        <v-icon>mdi-format-color-fill</v-icon>
                      </v-btn>
                      <v-spacer></v-spacer>
                    </template>
                    <v-color-picker v-model="item.color" :swatches="swatches" show-swatches></v-color-picker>
                  </v-dialog>
                </td>
              </template>

              <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="moveUp(item)">mdi-menu-up</v-icon>
                <v-icon small class="mr-2" @click="moveDown(item)">mdi-menu-down</v-icon>

                <v-icon small class="mr-2" @click="add(item)">mdi-table-row-plus-before</v-icon>
                <v-icon
                  v-if="item.type === 'custom' || !item.type"
                  small
                  @click="deleteTag(item)"
                >mdi-delete</v-icon>
              </template>
            </v-data-table>
          </v-flex>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="add(null)">New Tag</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" text @click="save()">Save</v-btn>
      </v-card-actions>
    </v-card> 
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

//var jmespath = require("jmespath");

export default {
  data() {
    return {
      dialog: false, 
      colorDialog : false, 
      headers: [
        { text: "Name", value: "name" }, 
        { text: "Color", value: "color" },
        { text: "", value: "action", sortable: false }
      ],
      swatches: [
        ["#FF0000", "#AA0000", "#550000"],
        ["#FFFF00", "#AAAA00", "#555500"],
        ["#00FF00", "#00AA00", "#005500"],
        ["#00FFFF", "#00AAAA", "#005555"],
        ["#0000FF", "#0000AA", "#000055"]
      ],
      items: this.tags
    };
  },
  props: ["tags"], 
  mounted() {},
  methods: {
    add(item) { 
      let index = this.items.indexOf(item);
      this.items.splice(index + 1, 0, {
        name: "", 
        color: "#FFFFFF"
      });
 
    },
    deleteTag(item) {
      let index = this.items.indexOf(item);
      this.items.splice(index, 1);
    },
    moveUp(item) {
      let index = this.items.indexOf(item);
      this.items.splice(index, 1);
      this.items.splice(index - 1, 0, item);
    },
    moveDown(item) {
      let index = this.items.indexOf(item);
      this.items.splice(index, 1);
      this.items.splice(index + 1, 0, item);
    },
    save(){
      this.$emit("save", this.items);
      this.dialog = false;
    }
  }
};
</script>

