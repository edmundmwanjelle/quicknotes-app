const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const noteCategory = document.querySelector('#note-category');
const searchInput = document.querySelector('#search-input');
const notesList = document.querySelector('#notes-list');
const noteCount = document.querySelector('#note-count');
const errorMessage = document.querySelector('#error-message');

let notes = [];

function render() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchTerm)
  );

  notesList.replaceChildren();

  if (filteredNotes.length === 0 && searchTerm) {
    const emptyMessage = document.createElement('li');
    emptyMessage.className = 'empty-message';
    emptyMessage.textContent = 'No notes match your search.';
    notesList.appendChild(emptyMessage);
  } else {
    filteredNotes.forEach((note) => {
      const card = document.createElement('li');
      const categoryClass = `category-${note.category.toLowerCase()}`;
      card.className = `note-card ${categoryClass}`;

      const text = document.createElement('p');
      text.className = 'note-content';
      text.textContent = note.text;

      const meta = document.createElement('div');
      meta.className = 'note-meta';

      const category = document.createElement('span');
      category.className = 'note-category-label';
      category.textContent = note.category;

      const date = document.createElement('span');
      date.className = 'note-date';
      date.textContent = note.createdAt;

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'delete-button';
      deleteButton.textContent = 'Delete';
      deleteButton.dataset.id = note.id;
      deleteButton.addEventListener('click', () => deleteNote(note.id));

      meta.append(category, date, deleteButton);
      card.append(text, meta);
      notesList.appendChild(card);
    });
  }

  updateCount();
}

function updateCount() {
  if (notes.length === 0) {
    noteCount.textContent = 'You have no notes yet.';
  } else if (notes.length === 1) {
    noteCount.textContent = 'You have 1 note.';
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }
}

function addNote(event) {
  event.preventDefault();

  const text = noteInput.value.trim();

  if (!text) {
    errorMessage.textContent = 'Please type a note first.';
    noteInput.setAttribute('aria-invalid', 'true');
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = 'Notes must be 200 characters or fewer.';
    noteInput.setAttribute('aria-invalid', 'true');
    return;
  }

  const note = {
    id: Date.now().toString(),
    text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString()
  };

  notes.push(note);
  saveNotes();
  render();

  noteInput.value = '';
  noteInput.removeAttribute('aria-invalid');
  errorMessage.textContent = '';
  noteInput.focus();
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  render();
}

function saveNotes() {
  localStorage.setItem('quicknotes-notes', JSON.stringify(notes));
}

function loadNotes() {
  const savedNotes = localStorage.getItem('quicknotes-notes');

  if (savedNotes) {
    try {
      const parsedNotes = JSON.parse(savedNotes);
      if (Array.isArray(parsedNotes)) {
        notes = parsedNotes.filter((note) =>
          note && typeof note.id === 'string' && typeof note.text === 'string' &&
          typeof note.category === 'string' && typeof note.createdAt === 'string'
        );
      }
    } catch (error) {
      notes = [];
    }
  }
}

noteForm.addEventListener('submit', addNote);
searchInput.addEventListener('input', render);

loadNotes();
render();
