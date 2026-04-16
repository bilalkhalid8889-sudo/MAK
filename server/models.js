// server/models.js
const mongoose = require('mongoose');

// ── RESERVATION ──────────────────────────────────────
const reservationSchema = new mongoose.Schema({
    id:          { type: Number, required: true, unique: true },
    name:        { type: String, required: true },
    email:       { type: String, default: '' },
    phone:       { type: String, default: '' },
    room:        { type: String, required: true },
    roomType:    { type: String, default: '' },
    checkin:     { type: String, default: '' },
    checkinTime: { type: String, default: '' },
    checkout:    { type: String, default: '' },
    nights:      { type: Number, default: 1 },
    amount:      { type: Number, default: 0 },
    status:      { type: String, enum: ['pending','check-in','staying','check-out'], default: 'pending' },
}, { _id: false });

// ── ROOM ─────────────────────────────────────────────
const roomSchema = new mongoose.Schema({
    num:    { type: String, required: true, unique: true },
    type:   { type: String, default: '' },
    floor:  { type: Number, default: 1 },
    rate:   { type: Number, default: 100 },
    status: { type: String, enum: ['vacant','occupied','cleaning','maintenance'], default: 'vacant' },
}, { _id: false });

// ── GUEST ─────────────────────────────────────────────
const guestSchema = new mongoose.Schema({
    id:    { type: Number, required: true, unique: true },
    name:  { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    nat:   { type: String, default: '' },
    idnum: { type: String, default: '' },
    stays: { type: Number, default: 0 },
}, { _id: false });

// ── BILLING ──────────────────────────────────────────
const billingSchema = new mongoose.Schema({
    id:     { type: Number, required: true, unique: true },
    guest:  { type: String, default: '' },
    room:   { type: String, default: '' },
    amount: { type: Number, default: 0 },
    desc:   { type: String, default: '' },
    status: { type: String, enum: ['unpaid','partial','paid'], default: 'unpaid' },
    date:   { type: String, default: '' },
}, { _id: false });

// ── MENU ─────────────────────────────────────────────
const menuSchema = new mongoose.Schema({
    id:    { type: Number, required: true, unique: true },
    name:  { type: String, required: true },
    cat:   { type: String, default: '' },
    price: { type: Number, default: 0 },
    avail: { type: Boolean, default: true },
}, { _id: false });

// ── HOUSEKEEPING TASK ────────────────────────────────
const hkTaskSchema = new mongoose.Schema({
    id:       { type: Number, required: true, unique: true },
    room:     { type: String, default: '' },
    desc:     { type: String, default: '' },
    priority: { type: String, enum: ['high','medium','low'], default: 'medium' },
    staff:    { type: String, default: '' },
    due:      { type: String, default: '' },
    done:     { type: Boolean, default: false },
}, { _id: false });

// ── MAINTENANCE TASK ─────────────────────────────────
const maintTaskSchema = new mongoose.Schema({
    id:       { type: Number, required: true, unique: true },
    room:     { type: String, default: '' },
    desc:     { type: String, default: '' },
    priority: { type: String, enum: ['high','medium','low'], default: 'medium' },
    staff:    { type: String, default: '' },
    done:     { type: Boolean, default: false },
    date:     { type: String, default: '' },
}, { _id: false });

// ── STAFF ─────────────────────────────────────────────
const staffSchema = new mongoose.Schema({
    id:     { type: Number, required: true, unique: true },
    name:   { type: String, required: true },
    role:   { type: String, default: '' },
    phone:  { type: String, default: '' },
    status: { type: String, enum: ['active','break','off'], default: 'active' },
}, { _id: false });

// Use "store" collections — one document per collection that holds the whole array
// This matches the frontend's single data object pattern perfectly.
const StoreSchema = (name, itemSchema) => new mongoose.Schema({
    _id:   { type: String, default: name },
    items: { type: [itemSchema], default: [] },
}, { collection: name });

const Reservations = mongoose.model('reservations', StoreSchema('reservations', reservationSchema));
const Rooms        = mongoose.model('rooms',         StoreSchema('rooms',        roomSchema));
const Guests       = mongoose.model('guests',        StoreSchema('guests',       guestSchema));
const Billing      = mongoose.model('billing',       StoreSchema('billing',      billingSchema));
const Menu         = mongoose.model('menu',           StoreSchema('menu',         menuSchema));
const HkTasks      = mongoose.model('hkTasks',       StoreSchema('hkTasks',      hkTaskSchema));
const MaintTasks   = mongoose.model('maintTasks',    StoreSchema('maintTasks',   maintTaskSchema));
const Staff        = mongoose.model('staff',          StoreSchema('staff',        staffSchema));

module.exports = { Reservations, Rooms, Guests, Billing, Menu, HkTasks, MaintTasks, Staff };
