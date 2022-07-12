const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

const body = document.querySelector('body');
const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
const completeBookshelfList = document.getElementById('completeBookshelfList');
const titleInput = document.getElementById('inputBookTitle');
const authorInput = document.getElementById('inputBookAuthor');
const yearInput = document.getElementById('inputBookYear');
const isCompleteInput = document.getElementById('inputBookIsComplete');

const generateId = () => +new Date();
const generateBookObject = (id, title, author, year, isComplete) => ({ id, title, author, year, isComplete });
const getBook = (id) => books.find(book => book.id === id);
const getBookIndex = (id) => todos.indexOf(getBook(id));
const storageExists = () => !(typeof(Storage) === undefined);

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadData() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (data) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook() {
  const book = generateBookObject(generateId(), titleInput.value, authorInput.value, yearInput.value, isCompleteInput.checked);
  books.push(book);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function completeBook(id) {
  const book = getBook(id);

  if (!book) return;

  book.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoCompletedBook(id) {
  const book = getBook(id);

  if (!book) return;

  book.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBook(id) {
  const bookIndex = getBook(id);

  if (!bookIndex) return;

  books.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function makeBook(book) {
  const bookItem = document.createElement('article');
  bookItem.classList.add('book_item');

  const bookTitle = document.createElement('h3');
  bookTitle.innerText = book.title;
  bookItem.append(bookTitle);

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = book.author;
  bookItem.append(bookAuthor);

  const bookYear = document.createElement('p');
  bookYear.innerText = `Tahun: ${book.year}`;
  bookItem.append(bookYear);

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('action');

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('red');
  deleteButton.innerText = 'Hapus buku';
  deleteButton.addEventListener('click', function () {
    deleteBook(book.id);
  });

  if (book.isComplete) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('green');
    undoButton.innerText = 'Belum selesai di Baca';
    undoButton.addEventListener('click', function () {
      undoCompletedBook(book.id);
    });
    actionContainer.append(undoButton);
  } else {
    const completeButton = document.createElement('button');
    completeButton.classList.add('green');
    completeButton.innerText = 'Selesai dibaca';
    completeButton.addEventListener('click', function () {
      completeBook(book.id);
    });
    actionContainer.append(completeButton);
  }

  actionContainer.append(deleteButton);
  bookItem.append(actionContainer);  

  return bookItem;
}

document.addEventListener('DOMContentLoaded', function () {
  const inputForm = document.getElementById('inputBook');
  inputForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (storageExists()) loadData();

  document.querySelector('#bookSubmit span').innerText = isCompleteInput.checked ? 'Selesai dibaca' : 'Belum selesai di Baca';
  isCompleteInput.addEventListener('change', function (event) {
    document.querySelector('#bookSubmit span').innerText = event.target.checked ? 'Selesai dibaca' : 'Belum selesai di Baca';
  });
});

document.addEventListener(RENDER_EVENT, function () {
  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';
 
  for (const book of books) {
    const bookElement = makeBook(book);
    if (!book.isComplete) incompleteBookshelfList.append(bookElement);
    else completeBookshelfList.append(bookElement);
  }
});