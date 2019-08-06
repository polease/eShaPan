import Books from "../data/books.json";
import Lists from "../data/lists.json";
import ListTypes from "../data/list-types.json";
import Dexie from "dexie";

var db = new Dexie("HardBrainDB");
db.version(1).stores({ books: "++id,name" });
db.version(1).stores({ lists: "++id,name,baseTypes" });
db.version(1).stores({ listTypes: "++id,name,value,prefix" });

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

// ==============
async function getBooks() {
  if (await db.books.count() == 0) {
    await initSampleBooks();
  }

  let books = await db.books.toArray();
  return books;
}

async function getBook(id) {
  if (await db.books.count() == 0) {
    await initSampleBooks();
  }

  let book = db.books.get(id);
  return book;
}

async function getList(id) {
  if (await db.lists.count() == 0) {
    await initSampleLists();
  }

  let list = db.lists.get(id);
  return list;
}

async function getListTypes() {
  if (await db.listTypes.count() == 0) {
    await initSampleListTypes();
  }

  let types = await db.listTypes.toArray();
  return types;
}

export { getBook, getList, getListTypes, getBooks };
