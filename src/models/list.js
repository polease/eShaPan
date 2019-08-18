import uuidv4 from "uuid/v4";

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

function getListMeta(list){
  if(list){
    return {
      uuid: list.uuid,
      name: list.name

    }
  }
}

function newListItem(list){
  let newItem = {};
  if(list.definition){
    list.definition.forEach(prop => {
      let v = null;
      switch(prop.defaultValue){
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

export { newList,newListItem, getListMeta };
