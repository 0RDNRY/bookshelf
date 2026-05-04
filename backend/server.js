const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/bookshelf')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// ─── MODELS ──────────────────────────────────────────────

// Author (One side of One-to-Many)
const AuthorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: String,
  createdAt: { type: Date, default: Date.now }
});
const Author = mongoose.model('Author', AuthorSchema);

// Tag (Many side of Many-to-Many)
const TagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});
const Tag = mongoose.model('Tag', TagSchema);

// Book — Many side of One-to-Many (author ref) + Many-to-Many (tags refs)
const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: Number,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  createdAt: { type: Date, default: Date.now }
});
const Book = mongoose.model('Book', BookSchema);

// ─── AUTHOR ROUTES ────────────────────────────────────────

app.get('/api/authors', async (req, res) => {
  const authors = await Author.find().sort('-createdAt');
  res.json(authors);
});

app.post('/api/authors', async (req, res) => {
  try {
    const author = await Author.create(req.body);
    res.status(201).json(author);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.put('/api/authors/:id', async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(author);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.delete('/api/authors/:id', async (req, res) => {
  await Author.findByIdAndDelete(req.params.id);
  await Book.deleteMany({ author: req.params.id });
  res.json({ message: 'Author and their books deleted' });
});

// ─── TAG ROUTES ───────────────────────────────────────────

app.get('/api/tags', async (req, res) => {
  const tags = await Tag.find().sort('name');
  res.json(tags);
});

app.post('/api/tags', async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json(tag);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.delete('/api/tags/:id', async (req, res) => {
  await Tag.findByIdAndDelete(req.params.id);
  await Book.updateMany({ tags: req.params.id }, { $pull: { tags: req.params.id } });
  res.json({ message: 'Tag removed from all books' });
});

// ─── BOOK ROUTES ──────────────────────────────────────────

app.get('/api/books', async (req, res) => {
  const books = await Book.find()
    .populate('author', 'name')
    .populate('tags', 'name')
    .sort('-createdAt');
  res.json(books);
});

app.post('/api/books', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    const populated = await book.populate(['author', 'tags']);
    res.status(201).json(populated);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.put('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('author', 'name').populate('tags', 'name');
    res.json(book);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.delete('/api/books/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: 'Book deleted' });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(5000, () => console.log('API running on port 5000'));
