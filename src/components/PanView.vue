<template>
  <v-row>
    <v-toolbar collapse dense class="toolbar" width="200">
      <v-btn icon color="blue-grey" class="white--text" @click="renderPan">
        <v-icon right dark>mdi-refresh</v-icon>
      </v-btn>
      <pan-create :pan="pan"></pan-create>
      <v-btn icon color="blue-grey" class="white--text" @click="deletePan">
        <v-icon right dark>mdi-delete</v-icon>
      </v-btn>
    </v-toolbar>
    <div :id="id" class="ma-3"></div>
  </v-row>
</template>

<style lang="scss">

.toolbar{
  width: 200px;
}
text {
  font-size: 12px;
  font-family: Roboto, sans-serif;
}
</style>

<script>
import { mapState } from "vuex";
import cloneDeep from "clone-deep";
import * as d3 from "d3";
import PanCreate from "./PanCreate.vue";
import * as List from "../models/list.js";

export default {
  components: { PanCreate },

  data() {
    return {
      id: "d3-" + Math.round(Math.random() * 1000000),
      dialog: false,
      colorDialog: false,
      ddd: {},
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
      items: []
    };
  },
  computed: {
    ...mapState(["listTypes", "currentList"])
  },
  props: ["pan"],
  mounted() {
    this.renderPan();
  },
  methods: {
    /// Transform list.items into this.items
    /// {x, y, w, h, color}
    prepareData() {
      this.items = this.currentList.items.map((data, i, array) => {
        let newI = {};
        newI.x = this.getValue( this.pan.definition.x[0], data, i, array, "x");
        newI.y = this.getValue(this.pan.definition.y[0], data, i, array, "y");
        newI.w = this.getValue(this.pan.definition.w[0], data, i, array, "w");
        newI.h = this.getValue(this.pan.definition.h[0], data, i, array, "h");
        newI.text = this.getValue(this.pan.definition.text[0], data, i, array);
        newI.color = this.getColorValue(
          this.pan.definition.color[0],
          this.currentList.definition,
          data,
          i,
          array
        );

        return newI;
      });
    },
    renderPan() {
      const CANVAS = { width: 1000, height: 800 };
      const MARGIN = { top: 30, right: 30, bottom: 30, left: 30 };

      // Setup data
      this.prepareData();

      d3.select(`#${this.id} svg`).remove();
      d3.select(`#${this.id}`)
        .append("svg")
        .attr("width", CANVAS.width)
        .attr("height", CANVAS.height);
      // .style('background', this.chart.background);
      this.ddd.svg = d3.select(`#${this.id} svg`);

      // Create scale
      let xScale, yScale;
      if (this.pan.definition.xDimension === "time")
        xScale = d3
          .scaleTime()
          .domain([
            new Date(this.pan.definition.x0),
            new Date(this.pan.definition.x1)
          ])
          .range([MARGIN.left, CANVAS.width - MARGIN.right]);
      else
        xScale = d3
          .scaleLinear()
          .domain([
            parseInt(this.pan.definition.x0),
            parseInt(this.pan.definition.x1)
          ])
          .range([MARGIN.left, CANVAS.width - MARGIN.right]);

      if (this.pan.definition.yDimension === "time")
        yScale = d3
          .scaleTime()
          .domain([
            new Date(this.pan.definition.y0),
            new Date(this.pan.definition.y1)
          ])
          .range([MARGIN.top, CANVAS.height - MARGIN.bottom]);
      else
        yScale = d3
          .scaleLinear()
          .domain([
            parseInt(this.pan.definition.y0),
            parseInt(this.pan.definition.y1)
          ])
          .range([MARGIN.top, CANVAS.height - MARGIN.bottom]);

      // draw the shape
      this.ddd.item = this.ddd.svg
        .append("g")
        .selectAll("rect")
        .data(this.items)
        .enter()
        .append("rect");
      this.ddd.item
        .attr("fill", data => data.color)
        .attr("x", data => xScale(data.x))
        .attr("y", data => yScale(data.y))
        .transition()
        .attr("width", (data, i, array) => {
          if (this.pan.definition.w[0].dataType === "time")
            return xScale(data.w) - xScale(data.x); 
          else return Scale(data.x + data.w) - xScale(data.x);
        })
        .attr("height", (data, i, array) => {
          if (this.pan.definition.h[0].dataType === "time")
            return yScale(data.h) - yScale(data.y); 
          else return yScale(data.y + data.h) - yScale(data.y);
        });

      //draw the text
      this.ddd.text = this.ddd.svg
        .append("g")
        .attr("transform", `translate(5, 15)`)
        .selectAll("text")
        .data(this.items)
        .enter()
        .append("text");
      this.ddd.text
        .attr("x", data => xScale(data.x))
        .attr("y", data => yScale(data.y))
        .transition()
        .attr("width", (data, i, array) => {
          if (this.pan.definition.w[0].dataType === "time")
            return xScale(data.w) - xScale(data.x);
          else  
            return xScale(data.x + data.w) - xScale(data.x);
        })
        .text(data => data.text);

      // Add scales to axis
      var x_axis = d3.axisBottom().scale(xScale);
      var y_axis = d3.axisLeft().scale(yScale);
      this.ddd.svg
        .append("g")
        .attr("transform", `translate(0, ${MARGIN.top})`)
        .call(x_axis);
      this.ddd.svg
        .append("g")
        .attr("transform", `translate(${MARGIN.left}, 0)`)
        .call(y_axis);
    },
    getValue(dim, item, index, items, dimEnum) {
      if (!dim) return null;
      if (dim.type === "static") 
      {
        if(dimEnum === 'x' || dimEnum == 'y' || dimEnum ==='w' || dimEnum ==='h')
          return parseFloat(dim.value);
        else
          return dim.value;
      }
      else if (dim.type === "accumulate" && dim.dataType === "number") {
        let initValue = 0;
        let result = items.reduce((accumulator, loopItem, loopI, array) => {
          if (loopI < index) return accumulator + List.getItemPropertyValue(loopItem, dim);
          else return accumulator;
        }, initValue);
        return result;
      } 
      else 
        return List.getItemPropertyValue(item, dim);
    },

    getColorValue(dim, listDefinition, item, index, items) {
      const DEFAULT_COLOR = "lightseagreen";
      if (!dim) return DEFAULT_COLOR;
      if (dim.type === "static") return dim.value;

      //if(dim.type === 'accumulate')
      //

      let tagName = item[dim.value];
      let tagDef = listDefinition.find(t => t.value === dim.value);
      if (!tagDef) return DEFAULT_COLOR;

      let tag = tagDef.tags.find(t => t.name === tagName);
      if (!tag) return DEFAULT_COLOR;
      return tag.color;
    },
    save() {
      this.$emit("save", this.items);
      this.dialog = false;
    },
    deletePan() {
      this.$store.dispatch("deletePan", this.pan);
    }
  }
};
</script>

