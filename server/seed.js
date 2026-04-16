// server/seed.js  — run once to populate MongoDB with default hotel data
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const { Reservations, Rooms, Guests, Billing, Menu, HkTasks, MaintTasks, Staff } = require('./models');

const SEED = {
    reservations: [
        { id:1, name:'Sarah Johnson',  email:'sarah@example.com',  phone:'+1 555 100 1001', room:'204', roomType:'Deluxe King',    checkin:'2026-04-07', checkinTime:'10:00 AM', checkout:'2026-04-10', nights:3, amount:450,  status:'check-in' },
        { id:2, name:'Robert Liang',   email:'robert@example.com', phone:'+1 555 100 1002', room:'512', roomType:'Suite',           checkin:'2026-04-07', checkinTime:'12:30 PM', checkout:'2026-04-12', nights:5, amount:1250, status:'staying'  },
        { id:3, name:'Mia Andersson',  email:'mia@example.com',    phone:'+46 70 123 4567', room:'118', roomType:'Standard King',   checkin:'2026-04-07', checkinTime:'2:00 PM',  checkout:'2026-04-09', nights:2, amount:220,  status:'pending'  },
        { id:4, name:'Ahmad Farooq',   email:'ahmad@example.com',  phone:'+92 300 1234567', room:'306', roomType:'Deluxe King',    checkin:'2026-04-07', checkinTime:'3:45 PM',  checkout:'2026-04-14', nights:7, amount:980,  status:'pending'  },
        { id:5, name:'Emily Carter',   email:'emily@example.com',  phone:'+1 555 100 1005', room:'401', roomType:'Junior Suite',    checkin:'2026-04-03', checkinTime:'5:00 PM',  checkout:'2026-04-07', nights:4, amount:680,  status:'check-out'},
        { id:6, name:'James Patel',    email:'james@example.com',  phone:'+44 77 1234 5678',room:'302', roomType:'Standard Twin',   checkin:'2026-04-05', checkinTime:'2:00 PM',  checkout:'2026-04-08', nights:3, amount:270,  status:'staying'  },
        { id:7, name:'Yuki Tanaka',    email:'yuki@example.com',   phone:'+81 90 1234 5678',room:'220', roomType:'Deluxe Twin',    checkin:'2026-04-08', checkinTime:'3:00 PM',  checkout:'2026-04-11', nights:3, amount:390,  status:'pending'  },
    ],
    rooms: [
        { num:'101', type:'Deluxe King',   floor:1, rate:150, status:'occupied'    },
        { num:'102', type:'Standard Twin', floor:1, rate:90,  status:'vacant'      },
        { num:'103', type:'Standard King', floor:1, rate:100, status:'cleaning'    },
        { num:'104', type:'Junior Suite',  floor:1, rate:200, status:'occupied'    },
        { num:'105', type:'Standard Twin', floor:1, rate:90,  status:'vacant'      },
        { num:'106', type:'Deluxe Twin',   floor:1, rate:130, status:'maintenance' },
        { num:'118', type:'Standard King', floor:1, rate:100, status:'occupied'    },
        { num:'204', type:'Deluxe King',   floor:2, rate:150, status:'occupied'    },
        { num:'220', type:'Deluxe Twin',   floor:2, rate:130, status:'vacant'      },
        { num:'302', type:'Standard Twin', floor:3, rate:90,  status:'occupied'    },
        { num:'306', type:'Deluxe King',   floor:3, rate:140, status:'vacant'      },
        { num:'401', type:'Junior Suite',  floor:4, rate:170, status:'cleaning'    },
        { num:'512', type:'Suite',         floor:5, rate:250, status:'occupied'    },
    ],
    guests: [
        { id:1, name:'Sarah Johnson', email:'sarah@example.com',  phone:'+1 555 100 1001',  nat:'American',  idnum:'P123456', stays:3 },
        { id:2, name:'Robert Liang',  email:'robert@example.com', phone:'+1 555 100 1002',  nat:'American',  idnum:'P234567', stays:7 },
        { id:3, name:'Mia Andersson', email:'mia@example.com',    phone:'+46 70 123 4567',  nat:'Swedish',   idnum:'P345678', stays:1 },
        { id:4, name:'Ahmad Farooq',  email:'ahmad@example.com',  phone:'+92 300 1234567',  nat:'Pakistani', idnum:'P456789', stays:2 },
        { id:5, name:'Emily Carter',  email:'emily@example.com',  phone:'+1 555 100 1005',  nat:'American',  idnum:'P567890', stays:5 },
        { id:6, name:'James Patel',   email:'james@example.com',  phone:'+44 77 1234 5678', nat:'British',   idnum:'P678901', stays:4 },
    ],
    billing: [
        { id:1, guest:'Sarah Johnson', room:'204', amount:450,  desc:'3 nights — Deluxe King',   status:'unpaid',  date:'2026-04-07' },
        { id:2, guest:'Robert Liang',  room:'512', amount:1250, desc:'5 nights — Suite',          status:'partial', date:'2026-04-07' },
        { id:3, guest:'Emily Carter',  room:'401', amount:680,  desc:'4 nights — Junior Suite',   status:'paid',    date:'2026-04-07' },
        { id:4, guest:'James Patel',   room:'302', amount:270,  desc:'3 nights — Standard Twin',  status:'paid',    date:'2026-04-05' },
        { id:5, guest:'Ahmad Farooq',  room:'306', amount:980,  desc:'7 nights — Deluxe King',    status:'unpaid',  date:'2026-04-07' },
    ],
    menu: [
        { id:1,  name:'Continental Breakfast', cat:'Breakfast', price:18, avail:true  },
        { id:2,  name:'Full English',           cat:'Breakfast', price:24, avail:true  },
        { id:3,  name:'Eggs Benedict',          cat:'Breakfast', price:20, avail:true  },
        { id:4,  name:'Club Sandwich',          cat:'Lunch',     price:16, avail:true  },
        { id:5,  name:'Caesar Salad',           cat:'Lunch',     price:14, avail:true  },
        { id:6,  name:'Grilled Salmon',         cat:'Dinner',    price:38, avail:true  },
        { id:7,  name:'Beef Tenderloin',        cat:'Dinner',    price:52, avail:true  },
        { id:8,  name:'Mushroom Risotto',       cat:'Dinner',    price:28, avail:false },
        { id:9,  name:'Sparkling Water',        cat:'Drinks',    price:5,  avail:true  },
        { id:10, name:'House Wine',             cat:'Drinks',    price:12, avail:true  },
    ],
    hkTasks: [
        { id:1, room:'101', desc:'Full deep clean after checkout',   priority:'high',   staff:'Maria Santos', due:'10:00', done:false },
        { id:2, room:'103', desc:'Regular room clean + towels',      priority:'medium', staff:'Linda Chen',   due:'11:30', done:false },
        { id:3, room:'401', desc:'Turndown service + amenities',     priority:'low',    staff:'Linda Chen',   due:'17:00', done:false },
        { id:4, room:'105', desc:'Pre-arrival preparation',          priority:'medium', staff:'Maria Santos', due:'13:00', done:true  },
    ],
    maintTasks: [
        { id:1, room:'307', desc:'AC unit reported faulty by guest',  priority:'high',   staff:'John Reed', done:false, date:'2026-04-07' },
        { id:2, room:'106', desc:'Plumbing — slow drain in bathroom', priority:'medium', staff:'John Reed', done:false, date:'2026-04-06' },
        { id:3, room:'212', desc:'TV remote not working',             priority:'low',    staff:'Tom Wu',    done:true,  date:'2026-04-06' },
    ],
    staff: [
        { id:1, name:'Maria Santos',  role:'Housekeeping',  phone:'+1 555 200 0001', status:'active' },
        { id:2, name:'Linda Chen',    role:'Housekeeping',  phone:'+1 555 200 0002', status:'active' },
        { id:3, name:'John Reed',     role:'Maintenance',   phone:'+1 555 200 0003', status:'break'  },
        { id:4, name:'Tom Wu',        role:'Maintenance',   phone:'+1 555 200 0004', status:'active' },
        { id:5, name:'Claire Dupont', role:'Receptionist',  phone:'+1 555 200 0005', status:'active' },
        { id:6, name:'Michael Park',  role:'Security',      phone:'+1 555 200 0006', status:'active' },
        { id:7, name:'Chef Ramos',    role:'Chef',           phone:'+1 555 200 0007', status:'active' },
    ],
};

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const models = { Reservations, Rooms, Guests, Billing, Menu, HkTasks, MaintTasks, Staff };
    const keys    = { Reservations:'reservations', Rooms:'rooms', Guests:'guests',
                      Billing:'billing', Menu:'menu', HkTasks:'hkTasks',
                      MaintTasks:'maintTasks', Staff:'staff' };

    for (const [modelName, Model] of Object.entries(models)) {
        const key = keys[modelName];
        const existing = await Model.findById(key);
        if (!existing) {
            await Model.create({ _id: key, items: SEED[key] });
            console.log(`  ✓ Seeded ${key} (${SEED[key].length} records)`);
        } else {
            console.log(`  ⏭  ${key} already seeded — skipped`);
        }
    }

    console.log('\nSeed complete.');
    process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
