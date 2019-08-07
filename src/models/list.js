import uuidv4 from "uuid/v4";

function newList(baseTypes) {
  let list = {
    id: uuidv4(),
    name: "",
    baseTypes: [],
    definition: [],
    items: [{ name: "" }]
  };
  for (baseType in baseTypes) {
    list.baseTypes.concat(baseType.name);
    list.definition.concat(baseType.definition);
  }
  return list;
}

export {newList};
