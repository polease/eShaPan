import uuidv4 from "uuid/v4";

function newList(baseTypes) {
  let list = {
    uuid: uuidv4(),
    name: "",
    baseTypes: [],
    definition: [],
    items: [{ name: "" }]
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

export { newList,getListMeta };
