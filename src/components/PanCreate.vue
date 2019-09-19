<template>
  <v-dialog v-model="dialog" persistent width="1024" height="800">
    <template v-slot:activator="{ on }">
      <v-btn v-if="!pan" v-on="on" color="blue-grey" class="white--text" @click="initNewPan()">
        Create Sha Pan
        <v-icon right dark>mdi-image-filter-hdr</v-icon>
      </v-btn>
      <v-btn v-else v-on="on" icon color="blue-grey" class="white--text" @click="editCurrentPan()">
        <v-icon right dark>mdi-settings</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <v-text-field class="headline" v-model="newPan.title"></v-text-field>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="9" class="pan-definition-container">
              <div class="pan-definition-bg">
                <svg width="800" height="600" id="pansvg">
                  <line x1="5" y1="5" x2="505" y2="5" class="dimension-line"></line>
                  <polygon points="500,0 500,10 510,5" class="dimension-shape"></polygon>
                  <line x1="5" y1="5" x2="5" y2="505" class="dimension-line"></line>
                  <polygon points="0,500 10,500 5,510" class="dimension-shape"></polygon>
                  <circle cx="5" cy="5" r="4" class="point-shape"></circle>
                  <line x1="5" y1="5" x2="40" y2="55" class="comment-line"></line>
                  <circle cx="505" cy="505" r="4" class="point-shape"></circle>
                  <line x1="505" y1="505" x2="450" y2="450" class="comment-line"></line>
                  <line x1="205" y1="5" x2="205" y2="205" class="comment-line"></line>
                  <line x1="5" y1="205" x2="205" y2="205" class="comment-line"></line>
                  <polygon points="205,205 205,355 405,355 405,205" class="dimension-shape"></polygon>
                </svg>
              </div>
              <div class="pan-x0y0">
                <v-container>
                  <v-row dense>
                    <v-col class="ma-0 pa-0" cols="3">x0:</v-col>
                    <v-col class="ma-0 pa-0">
                      <v-text-field class="ma-0 pa-0 pan-static-field" v-model="newPan.definition.x0" single-line></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col class="ma-0 pa-0" cols="3">y0:</v-col>
                    <v-col class="ma-0 pa-0">
                      <v-text-field class="ma-0 pa-0 pan-static-field" v-model="newPan.definition.y0" single-line></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
              <div class="pan-x-dim">
                <v-select
                  v-model="newPan.definition.xDimension"
                  :items="dimensions"
                  @change="xDimensionChanged()"
                  prepend-icon="mdi-notebook"
                  editable
                  attach
                  chips
                  dense
                  flat
                  solo
                  hide-no-data
                  hide-details
                ></v-select>
              </div>
              <div class="pan-y-dim">
                <v-select
                  v-model="newPan.definition.yDimension"
                  :items="dimensions"
                  @change="yDimensionChanged()"
                  prepend-icon="mdi-notebook"
                  editable
                  attach
                  chips
                  dense
                  flat
                  solo
                  hide-no-data
                  hide-details
                ></v-select>
              </div>
              <div class="pan-x">
                x :
                <pan-create-field-slot v-model="newPan.definition.x"/>
              </div>
              <div class="pan-y">
                y :
                <pan-create-field-slot v-model="newPan.definition.y"/>
              </div>
              <div class="pan-w">
                width/x':
                <pan-create-field-slot v-model="newPan.definition.w"/>
              </div>
              <div class="pan-h">
                height/y':
                <pan-create-field-slot v-model="newPan.definition.h"/>
              </div>
              <div class="pan-element">
                text :
                <pan-create-field-slot v-model="newPan.definition.text"/>color :
                <pan-create-field-slot v-model="newPan.definition.color"/>
              </div>
              <div class="pan-x1y1">
                <v-container>
                  <v-row dense>
                    <v-col class="ma-0 pa-0" cols="3">x1:</v-col>
                    <v-col class="ma-0 pa-0">
                      <v-text-field class="ma-0 pa-0 pan-static-field" v-model="newPan.definition.x1" single-line></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col class="ma-0 pa-0" cols="3">y1:</v-col>
                    <v-col class="ma-0 pa-0">
                      <v-text-field class="ma-0 pa-0 pan-static-field" v-model="newPan.definition.y1" single-line></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </v-col>
            <v-col cols="3">
              <v-list dense>
                <v-subheader class="grey--text text--darken-1" align-left>Static</v-subheader>
                <draggable
                  v-model="staticFields"
                  :group="{ name: 'people', pull: 'clone', put: false }"
                  :clone="cloneStaticField"
                  @start="drag=true"
                  @end="drag=false"
                >
                  <v-row v-for="prop in staticFields" :key="prop.value">
                    <v-chip class="ma-1" outlined>
                      <v-icon left>mdi-numeric</v-icon>
                      {{prop.text}}
                    </v-chip>
                  </v-row>
                </draggable>

                <v-subheader class="grey--text text--darken-1" align-left>List Fields</v-subheader>
                <draggable
                  v-model="currentList.definition"
                  :group="{ name: 'people', pull: 'clone', put: false }"
                  :clone="cloneListField"
                  @start="drag=true"
                  @end="drag=false"
                >
                  <v-row v-for="prop in currentList.definition" :key="prop.value">
                    <v-chip class="ma-1" outlined>
                      <v-icon left>mdi-auto-fix</v-icon>
                      {{prop.text}}
                    </v-chip>
                  </v-row>
                </draggable>

                <v-subheader class="grey--text text--darken-1" align-left>Accumulated Fields</v-subheader>
                <draggable
                  v-model="this.accumulateFields"
                  :clone="cloneAccumulateField"
                  :group="{ name: 'people', pull: 'clone', put: false }"
                  @start="drag=true"
                  @end="drag=false"
                >
                  <v-row v-for="prop in this.accumulateFields" :key="prop.value">
                    <v-chip class="ma-1" outlined>
                      <v-icon left>mdi-sigma</v-icon>
                      {{prop.text}}
                    </v-chip>
                  </v-row>
                </draggable>
              </v-list>
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" text @click="save()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss">
.dimension-line {
  stroke: darkcyan;
  stroke-width: 2px;
}

.dimension-shape {
  fill: darkcyan;
}

.point-shape {
  fill: darkmagenta;
}

.comment-line {
  stroke-dasharray: 5, 5;
  stroke: lightgray;
  stroke-width: 1px;
}

.pan-definition-container {
  position: relative;
  width: 800px;
  height: 600px;
}
.pan-definition-bg {
  position: absolute;
  left: 5px;
  top: 5px;
}

.pan-x0y0 {
  position: absolute;
  left: 20px;
  top: 50px;
  width: 160px;
  height: 100px;
  background-color: lightyellow;
}

.pan-x-dim {
  position: absolute;
  left: 520px;
  top: -15px;
  width: 180px;
  height: 40px;
}
.pan-x {
  position: absolute;
  left: 30px;
  top: 240px;
  width: 160px;
  height: 80px;
  background-color: lightyellow;
}
.pan-y-dim {
  position: absolute;
  left: -5px;
  top: 510px;
  width: 180px;
  height: 40px;
}
.pan-y {
  position: absolute;
  left: 260px;
  top: 80px;
  width: 160px;
  height: 80px;
  background-color: lightyellow;
}
.pan-w {
  position: absolute;
  left: 220px;
  top: 380px;
  width: 160px;
  height: 80px;
  background-color: lightyellow;
}
.pan-h {
  position: absolute;
  left: 440px;
  top: 240px;
  width: 160px;
  height: 80px;
  background-color: lightyellow;
}
.pan-element {
  position: absolute;
  left: 220px;
  top: 220px;
  width: 180px;
  height: 130px;
  background-color: lightyellow;
}
.pan-x1y1 {
  position: absolute;
  left: 300px;
  top: 460px;
  width: 160px;
  height: 100px;
  background-color: lightyellow;
}

.pan-static-field{
   
}
.drop-zone {
  width: 160px;
  height: 40px;
  background-color: yellow;
}

.curlyBrace {
  stroke: lightgray;
  stroke-width: 1px;
  fill: none;
}
</style>

<script>
import { mapState } from "vuex";
import cloneDeep from "clone-deep";
import draggable from "vuedraggable";
import * as d3 from "d3";
import PanCreateFieldSlot from "./PanCreateFieldSlot.vue";
import * as SVG from "../models/svg.js";

//var jmespath = require("jmespath");

export default {
  components: {
    draggable,
    PanCreateFieldSlot
  },
  data() {
    return {
      dialog: false,
      dimensions: ["number", "time"],
      staticFields: [{ text: "Static", value: "1", type: "static" }]
    };
  },
  props: ["pan"],
  computed: {
    ...mapState(["currentList", "newPan"]),
    accumulateFields: {
      get() {
        return this.currentList.definition
          .filter(t => t.dataType === "number")
          .map(t => {
            return { ...t, type: "accumulate" };
          });
      }
    }
  },
  updated() {
    let coords = [{ x1: 5, y1: 205, x2: 205, y2: 205 },
    { x1: 205, y1: 205, x2: 205, y2: 5 },
    { x1: 405, y1: 355, x2: 405, y2: 205 },
    { x1: 205, y1: 355, x2: 405, y2: 355 }];

    
    var svg = d3
      .select("#pansvg"); 
    var braces = svg.selectAll("path")
      .data(coords)
      .enter()
      .append("path")
      .attr("class", "curlyBrace")
      .attr("d", function(d) {
        return SVG.makeCurlyBrace(d.x1, d.y1, d.x2, d.y2, 30, 0.6);
      });
  },
  methods: {
    cloneStaticField(item) {
      return {
        ...item
      };
    },
    cloneAccumulateField(item) {
      return {
        ...item,
        type: "accumulate"
      };
    },
    cloneListField(item) {
      return {
        ...item
      };
    },
    save() {
      this.$store.dispatch("savePan", this.newPan);
      this.dialog = false;
    },
    xDimensionChanged() {
      if (this.newPan.definition.xDimension === "time") {
        this.newPan.definition.x0 = "2019-01-01";
        this.newPan.definition.x1 = "2020-01-01";
      } else {
        this.newPan.definition.x0 = "0";
        this.newPan.definition.x1 = "100";
      }
    },
    yDimensionChanged() {
      if (this.newPan.definition.yDimension === "time") {
        this.newPan.definition.y0 = "2019-01-01";
        this.newPan.definition.y1 = "2020-01-01";
      } else {
        this.newPan.definition.y0 = "0";
        this.newPan.definition.y1 = "100";
      }
    },
    initNewPan() {
      this.$store.dispatch("initializeNewPan");
    },
    editCurrentPan() {
      this.$store.dispatch("editPan", this.pan);
    }
  }
};
</script>

