<template>
  <v-flex class="timeline-view">
      <v-btn 
      class="ma-3"
      @click="loadTasks()"
    >Refresh
      <v-icon right dark>mdi-table-row-plus-after</v-icon>
    </v-btn>
     <gantt-elastic
      :options="options"
      :tasks="tasks"
      @tasks-changed="tasksUpdate"
      @options-changed="optionsUpdate"
      @dynamic-style-changed="styleUpdate"
    >
      <gantt-header slot="header"></gantt-header>
    </gantt-elastic>
  </v-flex>
</template>

<style lang="scss">
</style>

<script>
import { mapState } from "vuex";
import GanttElastic from "gantt-elastic";
import GanttHeader from "gantt-elastic-header";
import dayjs from "dayjs";

import * as List from "../models/list.js"


// just helper to get current dates
function getDate(hours) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const timeStamp = new Date(
    currentYear,
    currentMonth,
    currentDay,
    0,
    0,
    0
  ).getTime();
  return new Date(timeStamp + hours * 60 * 60 * 1000).getTime();
}


let options = {
  taskMapping: { 
    progress: "percent"
  },
  maxRows: 100,
  maxHeight: 500,
  title: {
    label: "Your project title as html (link or whatever...)",
    html: false
  },
  row: {
    height: 24
  },
  calendar: {
    hour: {
      display: false
    }
  },
  chart: {
    progress: {
      bar: false
    },
    expander: {
      display: true
    }
  },
  taskList: {
    expander: {
      straight: false
    },
    columns: [
      {
        id: 1,
        label: "ID",
        value: "id",
        width: 40
      },
      {
        id: 2,
        label: "Description",
        value: "label",
        width: 200,
        expander: true,
        html: true,
        events: {
          click({ data, column }) {
            alert("description clicked!\n" + data.label);
          }
        }
      },
      {
        id: 3,
        label: "Assigned to",
        value: "t__owner",
        width: 130,
        html: true
      },
      {
        id: 3,
        label: "Start",
        value: task => dayjs(task.start).format("YYYY-MM-DD"),
        width: 78
      },
      {
        id: 4,
        label: "Status",
        value: "t__status",
        width: 68
      },
      {
        id: 5,
        label: "%",
        value: "progress",
        width: 35,
        style: {
          "task-list-header-label": {
            "text-align": "center",
            width: "100%"
          },
          "task-list-item-value-container": {
            "text-align": "center",
            width: "100%"
          }
        }
      }
    ]
  },
  locale: {
    name: "en",
    Now: "Now",
    "X-Scale": "Zoom-X",
    "Y-Scale": "Zoom-Y",
    "Task list width": "Task list",
    "Before/After": "Expand",
    "Display task list": "Task list"
  }
};

export default {
  components: {
     GanttElastic,
    GanttHeader
  },
  data() {
    return {
       tasks:[],
      options,
      dynamicStyle: {},
      lastId: 16
    };
  },
  computed: mapState(["currentList"]),
  mounted() {
      this.loadTasks();
  },
  methods: {
      loadTasks(){

      this.tasks = List.convertToTimelineTasks(this.currentList);
      },
       getDate(hours) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();
        const timeStamp = new Date(currentYear, currentMonth, currentDay, 0, 0, 0).getTime();
        return new Date(timeStamp + hours * 60 * 60 * 1000).getTime();
      },
    async newListItem(index) {
      await this.$store.dispatch("createListItem", index);
      this.$refs.listItems[index + 1].focus();
      await this.$store.dispatch("saveCurrentList");
    },
    generatePadding(listItem, field) {
      if (field.value === "__name")
        return "0 0 0 " + listItem.level * 20 + "px";
      else return null;
    },
    setData() {
      if (this.$store.state.currentList != null)
        this.listItems = this.$store.state.currentList.items;
    }
  }
};




</script>

