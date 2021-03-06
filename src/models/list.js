import uuidv4 from "uuid/v4";
import moment from "moment"
import shortid from "shortid";

import cloneDeep from "clone-deep";

function newList(baseTypes) {
  let list = {
    uuid: uuidv4(),
    name: "New List",
    baseTypes: [],
    definition: [],
    items: [],
    pans:[]
  };
  if (baseTypes && baseTypes.length && baseTypes.length > 0)
    baseTypes.forEach(baseType => {
      list.baseTypes.push(baseType.key);
      list.definition = list.definition.concat(baseType.definition);
    });
  return list;
}

function copyFrom(fromList){
let newList = cloneDeep(fromList);
newList.uuid = uuidv4();
return newList;  
}

function getListMeta(list) {
  if (list) {
    return {
      uuid: list.uuid,
      name: list.name
    };
  }
}

function newListItem(list, index) {
  let newItem = {};
  if (list.definition) {
    list.definition.forEach(prop => {
      let v = null;
      switch (prop.defaultValue) {
        case "uuid":
          v = uuidv4();
          break;
        case "currentTime":
          v = new Date();
          break;
        default:
          break;
      }
      newItem[prop.value] = v;
    });
  }

  if(list.items[index])
    newItem["__level"] = list.items[index]["__level"];

  return newItem;
}

function adjustListItemLevel(listItem, levelAdjustment) {
  let existingLevel = 0;
  if (listItem.__level) existingLevel = listItem.__level;

  let newLevel = existingLevel + levelAdjustment;

  if (newLevel < 0) newLevel = 0;

  listItem.__level = newLevel;
}

function cleanUp(list){
  list.items.forEach((t, index) => t.__index = index);
}

function convertToTimelineTasks(list) {
  let tasks = list.items.map((item, i) => {
    let task = {
      id: item.__rid,
      label: item.__name,
      type: item.t__type,
      start: item.t__startDateTime,
      end: item.t__endDateTime,
      percentage: item.t__percentage,
      parent: null
    };
    if (!item.t__type) item.t__type = "task";

    // build parent relationship
    if (item.__level && item.__level > 0) {
      //find the first level less than current item, and mark as parent
      let itemsAhead = list.items.slice(0, i);
      itemsAhead.reverse();
      let parent = itemsAhead.find(p => p.__level < item.__level);
      if (parent) {
        task.parent = parent;
        task.parentId = parent.__rid;
      }
    }

    // build dependent relationship

    // format color based on percentage
    if (item.t__percentage == 100) {
      task.style = {
        base: {
          fill: "green",
          stroke: "#7E349D"
        }
      };
    } else if (item.t__percentage > 0) {
      task.style = {
        base: {
          fill: "yellow",
          stroke: "#7E349D"
        }
      };
    } else {
      task.style = {
        base: {
          fill: "gray",
          stroke: "#7E349D"
        }
      };
    }

    return task;
  });

  return tasks;
}



function newPan() {
  let newPan ={
    uuid: uuidv4(),
    title: "Pan 1",
    type: "auto",
    definition: {
      xDimension: "number",
      yDimension: "number",
      x0: "0",
      y0: "0",
      x1: "100",
      y1: "100",
      x: [],
      y: [],
      w: [],
      h: [],
      text:[{'text' : 'Name', 'value' : '__name'}],
      color:[]
    }
  };
  return newPan;
}

function getItemPropertyValue(item, propDefinition){
  let result = item[propDefinition.value];
  if(propDefinition.dataType === "time")
    result = moment(result).toDate();
  else if(propDefinition.dataType === "number")
    result = parseFloat(result);
   
  return result;
}

export {
  newList,
  newListItem,
  cleanUp,
  getListMeta,
  convertToTimelineTasks,
  adjustListItemLevel,
  copyFrom,
  newPan,
  getItemPropertyValue
};
