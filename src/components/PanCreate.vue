<template>
  <v-dialog v-model="dialog" persistent width="1024" height="800">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" color="blue-grey" class="white--text" @click="initNewPan()">
        Create Sha Pan
        <v-icon right dark>mdi-image-filter-hdr</v-icon>
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
                <svg width="800" height="600">
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
                    <v-col cols="3">x0:</v-col>
                    <v-col>
                      <v-text-field class="ma-0 pa-0" v-model="newPan.definition.x0" single-line></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="3">y0:</v-col>
                    <v-col>
                      <v-text-field class="ma-0 pa-0" v-model="newPan.definition.y0" single-line></v-text-field>
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
              <div class="pan-x">
                x :
                <div class="drop-zone">
                  <draggable
                    v-model="newPan.definition.x"
                    :group="{ name: 'people',   put: true }"
                    @change="xChanged"
                    @start="drag=true"
                    @end="drag=false"
                  >
                    <v-chip
                      v-for="prop in newPan.definition.x"
                      :key="prop.value"
                      class="ma-1"
                      close
                      outlined
                      @click:close="xRemoved"
                    >
                      <v-icon v-if="prop.type === 'static'" left>mdi-numeric</v-icon>
                      <v-icon v-else left>mdi-auto-fix</v-icon>
                      <v-text-field v-if="prop.type === 'static'" v-model="prop.value"/>
                      <span v-else>{{prop.text}}</span>
                    </v-chip>
                  </draggable>
                </div>
              </div>
              <div class="pan-y">
                y :
                <div class="drop-zone">
                  <draggable
                    v-model="newPan.definition.y"
                    :group="{ name: 'people',   put: true }"
                    @change="yChanged"
                    @start="drag=true"
                    @end="drag=false"
                  >
                    <v-chip
                      v-for="prop in newPan.definition.y"
                      :key="prop.value"
                      class="ma-1"
                      close
                      outlined
                      @click:close="yRemoved"
                    >
                      <v-icon v-if="prop.type === 'static'" left>mdi-numeric</v-icon>
                      <v-icon v-else left>mdi-auto-fix</v-icon>
                      <v-text-field v-if="prop.type === 'static'" v-model="prop.value"/>
                      <span v-else>{{prop.text}}</span>
                    </v-chip>
                  </draggable>
                </div>
              </div>
              <div class="pan-w">
                width :
                <div class="drop-zone">
                  <draggable
                    v-model="newPan.definition.w"
                    :group="{ name: 'people',   put: true }"
                    @change="wChanged"
                    @start="drag=true"
                    @end="drag=false"
                  >
                    <v-chip
                      v-for="prop in newPan.definition.w"
                      :key="prop.value"
                      class="ma-1"
                      close
                      outlined
                      @click:close="wRemoved"
                    >
                       <v-icon v-if="prop.type === 'static'" left>mdi-numeric</v-icon>
                      <v-icon v-else left>mdi-auto-fix</v-icon>
                      <v-text-field v-if="prop.type === 'static'" v-model="prop.value"/>
                      <span v-else>{{prop.text}}</span>
                    </v-chip>
                  </draggable>
                </div>
              </div>
              <div class="pan-h">
                height :
                <div class="drop-zone">
                  <draggable
                    v-model="newPan.definition.h"
                    :group="{ name: 'people',   put: true }"
                    @change="hChanged"
                    @start="drag=true"
                    @end="drag=false"
                  >
                    <v-chip
                      v-for="prop in newPan.definition.h"
                      :key="prop.value"
                      class="ma-1"
                      close
                      outlined
                      @click:close="hRemoved"
                    >
                      <v-icon v-if="prop.type === 'static'" left>mdi-numeric</v-icon>
                      <v-icon v-else left>mdi-auto-fix</v-icon>
                      <v-text-field v-if="prop.type === 'static'" v-model="prop.value"/>
                      <span v-else>{{prop.text}}</span>
                    </v-chip>
                  </draggable>
                </div>
              </div>
              <div class="pan-element">
                text :
                <div class="drop-zone">
                  <draggable
                    v-model="newPan.definition.text"
                    :group="{ name: 'people',   put: true }"
                    @change="textChanged"
                    @start="drag=true"
                    @end="drag=false"
                  >
                    <v-chip
                      v-for="prop in newPan.definition.text"
                      :key="prop.value"
                      class="ma-1"
                      close
                      outlined
                      @click:close="textRemoved"
                    >
                      <v-icon v-if="prop.type === 'static'" left>mdi-numeric</v-icon>
                      <v-icon v-else left>mdi-auto-fix</v-icon>
                      <v-text-field v-if="prop.type === 'static'" v-model="prop.value"/>
                      <span v-else>{{prop.text}}</span>
                    </v-chip>
                  </draggable>
                </div>color :
                <div class="drop-zone">
                  <draggable
                    v-model="newPan.definition.color"
                    :group="{ name: 'people',   put: true }"
                    @change="colorChanged"
                    @start="drag=true"
                    @end="drag=false"
                  >
                    <v-chip
                      v-for="prop in newPan.definition.color"
                      :key="prop.value"
                      class="ma-1"
                      close
                      outlined
                      @click:close="colorRemoved"
                    >
                      <v-icon v-if="prop.type === 'static'" left>mdi-numeric</v-icon>
                      <v-icon v-else left>mdi-auto-fix</v-icon>
                      <v-text-field v-if="prop.type === 'static'" v-model="prop.value"/>
                      <span v-else>{{prop.text}}</span>
                    </v-chip>
                  </draggable>
                </div>
              </div>
              <div class="pan-x1y1">
                <v-container>
                  <v-row dense>
                    <v-col cols="3">x1:</v-col>
                    <v-col>
                      <v-text-field class="ma-0 pa-0" v-model="newPan.definition.x1" single-line></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="3">y1:</v-col>
                    <v-col>
                      <v-text-field class="ma-0 pa-0" v-model="newPan.definition.y1" single-line></v-text-field>
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
                  v-model="currentList.definition"
                  :group="{ name: 'people', pull: 'clone', put: false }"
                  @start="drag=true"
                  @end="drag=false"
                >
                  <v-row
                    v-for="prop in currentList.definition.filter(t=>t.dataType ==='number')"
                    :key="prop.value"
                  >
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
  top: 260px;
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
  top: 360px;
  width: 160px;
  height: 80px;
  background-color: lightyellow;
}
.pan-h {
  position: absolute;
  left: 420px;
  top: 220px;
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
  top: 440px;
  width: 160px;
  height: 100px;
  background-color: lightyellow;
}
.drop-zone {
  width: 160px;
  height: 40px;
  background-color: yellow;
}
</style>

<script>
import { mapState } from "vuex";
import cloneDeep from "clone-deep";
import draggable from "vuedraggable";

//var jmespath = require("jmespath");

export default {
  components: {
    draggable
  },
  data() {
    return {
      dialog: false,
      dimensions: ["number", "time"],
      staticFields: [{ text: "Static", value: "", type: "static" }]
    };
  },
  props: ["tags"],
  computed: {
    ...mapState(["currentList", "newPan"])
  },
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
    save() {
      this.$emit("save", this.items);
      this.dialog = false;
    },
    xDimensionChanged() {},
    initNewPan() {
      this.$store.dispatch("initializeNewPan");
    },
    xChanged(event) {
      if (event.added && this.newPan.definition.x.length > 0) {
        this.newPan.definition.x = [];
        this.newPan.definition.x.push(event.added.element);
      }
    },
    xRemoved() {
      this.newPan.definition.x = [];
    },
    yChanged(event) {
      if (event.added && this.newPan.definition.y.length > 0) {
        this.newPan.definition.y = [];
        this.newPan.definition.y.push(event.added.element);
      }
    },
    yRemoved() {
      this.newPan.definition.y = [];
    },
    hChanged(event) {
      if (event.added && this.newPan.definition.h.length > 0) {
        this.newPan.definition.h = [];
        this.newPan.definition.h.push(event.added.element);
      }
    },
    hRemoved() {
      this.newPan.definition.h = [];
    },
    wChanged(event) {
      if (event.added && this.newPan.definition.w.length > 0) {
        this.newPan.definition.w = [];
        this.newPan.definition.w.push(event.added.element);
      }
    },
    wRemoved() {
      this.newPan.definition.w = [];
    },
    textChanged(event) {
      if (event.added && this.newPan.definition.text.length > 0) {
        this.newPan.definition.text = [];
        this.newPan.definition.text.push(event.added.element);
      }
    },
    textRemoved() {
      this.newPan.definition.text = [];
    },
    colorChanged(event) {
      if (event.added && this.newPan.definition.color.length > 0) {
        this.newPan.definition.color = [];
        this.newPan.definition.color.push(event.added.element);
      }
    },
    colorRemoved() {
      this.newPan.definition.color = [];
    }
  }
};
</script>

