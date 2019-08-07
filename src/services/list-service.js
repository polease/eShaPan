import Users from "../data/users.json";
import Books from "../data/books.json";
import Lists from "../data/lists.json";
import ListTypes from "../data/list-types.json";

import Dexie from "dexie";

var db = new Dexie("HardBrainDB");
db.version(1).stores({ users: "uuid,name" });
db.version(1).stores({ books: "uuid,name" });
db.version(1).stores({ lists: "uuid,name" });
db.version(1).stores({ listTypes: "key,name,prefix" });

// ========= Sample data =====

async function initSampleBooks() {
  await db.books.bulkAdd(Books);
}

async function initSampleLists() {
  await db.lists.bulkAdd(Lists);
}

async function initSampleListTypes() {
  await db.listTypes.bulkAdd(ListTypes);
}

async function initSampleUsers() {
  await db.users.bulkAdd(Users);
}

async function initSampleData() {
  if ((await db.users.count()) == 0) {
    await initSampleUsers();
  }
  if ((await db.books.count()) == 0) {
    await initSampleBooks();
  }
  if ((await db.books.count()) == 0) {
    await initSampleBooks();
  }
  if ((await db.lists.count()) == 0) {
    await initSampleLists();
  }
}


// ==============
async function getUser() {
  let users = await db.users.toArray();
  return users[0];
} 

async function getBook(uuid) {
  let book = await db.books.get(uuid);
  return book;
}

async function saveBook(book) {
  await db.books.put(book);
}

async function getList(uuid) {
  let list = await db.lists.get(uuid);
  return list;
}

// should have some method to lists.update instead of put
async function updateList(uuid, changes) {
  await db.lists.update(uuid, changes);
}

async function saveList(list) {
  await db.lists.put(list);
}

async function getListTypes() {
  if ((await db.listTypes.count()) == 0) {
    await initSampleListTypes();
  }

  let types = await db.listTypes.toArray();
  return types;
}

export { initSampleData, getUser, getBook, saveBook, getList, updateList, saveList, getListTypes };
