import uuidv4 from "uuid/v4";
import shortid from "shortid";

function newList(baseTypes) {
  let list = {
    uuid: uuidv4(),
    name: "",
    baseTypes: [],
    definition: [],
    items: []
  };
  if (baseTypes && baseTypes.length && baseTypes.length > 0)
    baseTypes.forEach(baseType => {
      list.baseTypes.concat(baseType.name);
      list.definition.concat(baseType.definition);
    });
  return list;
}

function getListMeta(list) {
  if (list) {
    return {
      uuid: list.uuid,
      name: list.name
    };
  }
}

function newListItem(list) {
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
  return newItem;
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
      parent : null
    };
    if (!item.t__type) item.t__type = "task";

    // build parent relationship
    if(item.__level && item.__level > 0){
      //find the first level less than current item, and mark as parent
      let itemsAhead = list.items.slice(0,i);
      itemsAhead.reverse();
      let parent = itemsAhead.find(p => p.__level < item.__level);
      if(parent){
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

export { newList, newListItem, getListMeta, convertToTimelineTasks };
