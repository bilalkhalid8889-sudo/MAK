// server/index.js  — MAK Hotel Management API
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
const { Reservations, Rooms, Guests, Billing, Menu, HkTasks, MaintTasks, Staff } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// ── Static files (hotel1.html) ────────────────────────────────
app.use(express.static(path.join(__dirname, '../public')));

// ── DB connection ─────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✓ MongoDB connected'))
    .catch(err => { console.error('✗ MongoDB error:', err.message); process.exit(1); });

// ── Generic helpers ───────────────────────────────────────────
// Each "collection" is stored as a single document { _id: name, items: [...] }
// This matches exactly how the frontend's `data` object is structured.

async function getItems(Model, id) {
    const doc = await Model.findById(id);
    return doc ? doc.items.map(i => i.toObject ? i.toObject() : i) : [];
}

async function saveItems(Model, id, items) {
    await Model.findByIdAndUpdate(id, { items }, { upsert: true, new: true });
}

// ── Build CRUD router for each resource ──────────────────────
function crudRouter(Model, docId) {
    const router = express.Router();

    // GET all
    router.get('/', async (req, res) => {
        try {
            res.json(await getItems(Model, docId));
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // POST — create new item (item must have numeric `id` field)
    router.post('/', async (req, res) => {
        try {
            const items = await getItems(Model, docId);
            const newItem = req.body;
            items.push(newItem);
            await saveItems(Model, docId, items);
            res.status(201).json(newItem);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // PUT — update item by numeric id
    router.put('/:id', async (req, res) => {
        try {
            const items = await getItems(Model, docId);
            const idx   = items.findIndex(i => String(i.id) === String(req.params.id) || String(i.num) === String(req.params.id));
            if (idx === -1) return res.status(404).json({ error: 'Not found' });
            items[idx] = { ...items[idx], ...req.body };
            await saveItems(Model, docId, items);
            res.json(items[idx]);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // DELETE — remove item by numeric id (or room num)
    router.delete('/:id', async (req, res) => {
        try {
            let items = await getItems(Model, docId);
            const before = items.length;
            items = items.filter(i => String(i.id) !== String(req.params.id) && String(i.num) !== String(req.params.id));
            if (items.length === before) return res.status(404).json({ error: 'Not found' });
            await saveItems(Model, docId, items);
            res.json({ deleted: true });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // PATCH /:id/done — toggle done flag (housekeeping / maintenance)
    router.patch('/:id/done', async (req, res) => {
        try {
            const items = await getItems(Model, docId);
            const item  = items.find(i => String(i.id) === String(req.params.id));
            if (!item) return res.status(404).json({ error: 'Not found' });
            item.done = req.body.done !== undefined ? req.body.done : !item.done;
            await saveItems(Model, docId, items);
            res.json(item);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    return router;
}

// ── BULK UPDATE endpoint — replaces entire array ──────────────
// POST /api/:resource/bulk   { items: [...] }
function bulkRouter(Model, docId) {
    const router = express.Router();
    router.post('/bulk', async (req, res) => {
        try {
            const { items } = req.body;
            if (!Array.isArray(items)) return res.status(400).json({ error: 'items array required' });
            await saveItems(Model, docId, items);
            res.json({ saved: items.length });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
    return router;
}

// ── Mount routes ──────────────────────────────────────────────
const resources = [
    { path: 'reservations', Model: Reservations, docId: 'reservations' },
    { path: 'rooms',        Model: Rooms,         docId: 'rooms'        },
    { path: 'guests',       Model: Guests,        docId: 'guests'       },
    { path: 'billing',      Model: Billing,       docId: 'billing'      },
    { path: 'menu',         Model: Menu,          docId: 'menu'         },
    { path: 'hkTasks',      Model: HkTasks,       docId: 'hkTasks'      },
    { path: 'maintTasks',   Model: MaintTasks,    docId: 'maintTasks'   },
    { path: 'staff',        Model: Staff,         docId: 'staff'        },
];

resources.forEach(({ path: p, Model, docId }) => {
    app.use(`/api/${p}`, bulkRouter(Model, docId));
    app.use(`/api/${p}`, crudRouter(Model, docId));
});

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// ── Fallback → serve hotel1.html ─────────────────────────────
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/hotel1.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✓ MAK Hotel API running → http://localhost:${PORT}`));
