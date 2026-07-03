/**
 * Generates mock JSON data for the Amrutam Ayurvedic Super App.
 * Run: node scripts/generate-data.js
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/data');
const CHUNK_SIZE = 500;

const SPECIALIZATIONS = [
  'Ayurveda General', 'Panchakarma', 'Dermatology', 'Digestive Health',
  'Women\'s Health', 'Joint & Bone', 'Mental Wellness', 'Pediatric Ayurveda',
  'Diabetes Care', 'Respiratory Health',
];

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Jaipur', 'Kolkata', 'Ahmedabad', 'Lucknow'];

const PRODUCT_CATEGORIES = ['Herbs', 'Oils', 'Supplements', 'Teas', 'Skincare', 'Haircare', 'Immunity', 'Digestion'];
const BRANDS = ['Amrutam', 'Dabur', 'Patanjali', 'Himalaya', 'Baidyanath', 'Zandu', 'Kerala Ayurveda'];

const RECORD_TYPES = ['lab_report', 'prescription', 'consultation', 'vaccination', 'allergy'];
const TAGS = ['urgent', 'follow-up', 'chronic', 'acute', 'preventive', 'reviewed', 'pending'];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeChunks(name, items) {
  const dir = path.join(DATA_DIR, name);
  ensureDir(dir);
  const chunks = Math.ceil(items.length / CHUNK_SIZE);
  const manifest = { total: items.length, chunkSize: CHUNK_SIZE, chunks };

  for (let i = 0; i < chunks; i++) {
    const chunk = items.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    fs.writeFileSync(path.join(dir, `chunk-${i}.json`), JSON.stringify(chunk));
  }
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`Generated ${items.length} ${name} in ${chunks} chunks`);
}

function generateDoctors(count) {
  const doctors = [];
  for (let i = 0; i < count; i++) {
    const spec = SPECIALIZATIONS[i % SPECIALIZATIONS.length];
    const city = CITIES[i % CITIES.length];
    doctors.push({
      id: `doc-${i + 1}`,
      name: `Dr. ${['Aarav', 'Priya', 'Rohan', 'Ananya', 'Vikram', 'Meera', 'Arjun', 'Kavya'][i % 8]} ${['Sharma', 'Patel', 'Reddy', 'Iyer', 'Gupta', 'Singh', 'Nair', 'Joshi'][Math.floor(i / 8) % 8]}`,
      specialization: spec,
      experience: 3 + (i % 25),
      rating: +(3.5 + (i % 15) * 0.1).toFixed(1),
      consultationFee: 300 + (i % 20) * 50,
      city,
      languages: ['Hindi', 'English', i % 2 === 0 ? 'Sanskrit' : 'Marathi'],
      about: `Experienced ${spec} practitioner with ${3 + (i % 25)} years of clinical experience in Ayurvedic medicine.`,
      imageUrl: `https://picsum.photos/seed/doc${i}/200/200`,
      availableToday: i % 3 !== 0,
    });
  }
  return doctors;
}

function generateSlots(doctorId, doctorIndex) {
  const slots = [];
  const now = new Date();
  for (let day = 0; day < 7; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);
    const dateStr = date.toISOString().split('T')[0];
    for (let hour = 9; hour <= 17; hour += 2) {
      const slotId = `${doctorId}-slot-${day}-${hour}`;
      const startTime = `${String(hour).padStart(2, '0')}:00`;
      const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
      const isExpired = day === 0 && hour < now.getHours();
      slots.push({
        id: slotId,
        doctorId,
        date: dateStr,
        startTime,
        endTime,
        isAvailable: !isExpired && (doctorIndex + hour + day) % 5 !== 0,
        isExpired,
      });
    }
  }
  return slots;
}

function generateProducts(count) {
  const products = [];
  for (let i = 0; i < count; i++) {
    const category = PRODUCT_CATEGORIES[i % PRODUCT_CATEGORIES.length];
    const brand = BRANDS[i % BRANDS.length];
    products.push({
      id: `prod-${i + 1}`,
      name: `${brand} ${category} Formula ${(i % 50) + 1}`,
      description: `Premium Ayurvedic ${category.toLowerCase()} product crafted with natural ingredients for holistic wellness.`,
      price: 99 + (i % 50) * 20,
      originalPrice: i % 4 === 0 ? 99 + (i % 50) * 20 + 100 : undefined,
      category,
      brand,
      rating: +(3 + (i % 20) * 0.1).toFixed(1),
      reviewCount: 10 + (i % 500),
      inStock: i % 17 !== 0,
      imageUrl: `https://picsum.photos/seed/prod${i}/300/300`,
      tags: [category.toLowerCase(), brand.toLowerCase()],
    });
  }
  return products;
}

function generateHealthRecords(count) {
  const records = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const type = RECORD_TYPES[i % RECORD_TYPES.length];
    const daysAgo = i % 730;
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toISOString();

    const base = {
      id: `rec-${i + 1}`,
      type,
      title: getRecordTitle(type, i),
      date: dateStr,
      doctorName: `Dr. ${['Sharma', 'Patel', 'Reddy'][i % 3]}`,
      facility: ['Amrutam Clinic', 'City Hospital', 'Ayurveda Center'][i % 3],
      tags: [TAGS[i % TAGS.length], TAGS[(i + 2) % TAGS.length]].filter((v, idx, arr) => arr.indexOf(v) === idx),
      notes: `Health record notes for ${type.replace('_', ' ')} visit.`,
    };

    if (type === 'lab_report' || type === 'prescription') {
      base.attachments = [{
        id: `att-${i}`,
        type: i % 2 === 0 ? 'image' : 'pdf',
        url: i % 2 === 0 ? `https://picsum.photos/seed/rec${i}/400/600` : `https://example.com/reports/rec-${i}.pdf`,
        thumbnailUrl: `https://picsum.photos/seed/thumb${i}/100/140`,
        name: `${type}_${i + 1}.${i % 2 === 0 ? 'jpg' : 'pdf'}`,
      }];
    }

    if (type === 'allergy') {
      base.allergen = ['Peanuts', 'Dust', 'Pollen', 'Dairy', 'Gluten'][i % 5];
      base.severity = ['mild', 'moderate', 'severe'][i % 3];
    }

    if (type === 'vaccination') {
      base.vaccineName = ['Hepatitis B', 'Tetanus', 'COVID-19 Booster', 'Flu Shot'][i % 4];
      base.doseNumber = (i % 3) + 1;
    }

    records.push(base);
  }
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function getRecordTitle(type, i) {
  const titles = {
    lab_report: ['Complete Blood Count', 'Lipid Profile', 'Thyroid Panel', 'Liver Function Test'],
    prescription: ['Ayurvedic Medicine Prescription', 'Follow-up Prescription', 'Chronic Care Rx'],
    consultation: ['General Consultation', 'Follow-up Visit', 'Specialist Consultation'],
    vaccination: ['Routine Vaccination', 'Booster Dose', 'Travel Vaccination'],
    allergy: ['Allergy Assessment', 'Allergy Follow-up', 'Skin Prick Test Results'],
  };
  return titles[type][i % titles[type].length];
}

ensureDir(DATA_DIR);

const doctors = generateDoctors(5000);
writeChunks('doctors', doctors);

// Generate slots for first 200 doctors (full slots for all 5000 would be huge)
const slotsDir = path.join(DATA_DIR, 'slots');
ensureDir(slotsDir);
const slotManifest = { doctors: [] };
for (let i = 0; i < 200; i++) {
  const doctor = doctors[i];
  const slots = generateSlots(doctor.id, i);
  fs.writeFileSync(path.join(slotsDir, `${doctor.id}.json`), JSON.stringify(slots));
  slotManifest.doctors.push(doctor.id);
}
fs.writeFileSync(path.join(slotsDir, 'manifest.json'), JSON.stringify(slotManifest, null, 2));
console.log('Generated slots for 200 doctors');

const products = generateProducts(20000);
writeChunks('products', products);

const healthRecords = generateHealthRecords(10000);
writeChunks('health-records', healthRecords);

const registryDir = path.join(__dirname, '../src/core/api/registries');
ensureDir(registryDir);

const doctorChunks = Math.ceil(5000 / CHUNK_SIZE);
const productChunks = Math.ceil(20000 / CHUNK_SIZE);
const recordChunks = Math.ceil(10000 / CHUNK_SIZE);

function writeRegistry(name, typeName, modulePath, chunks) {
  const varName = name === 'health-records' ? 'healthRecords' : name;
  const lines = Array.from({ length: chunks }, (_, i) =>
    `  ${i}: require('../../../data/${name}/chunk-${i}.json') as ${typeName}[],`
  );
  const content = `import type { ${typeName} } from '../../../modules/${modulePath}/types';\n\nexport const ${varName}Chunks: Record<number, ${typeName}[]> = {\n${lines.join('\n')}\n};\n\nexport const ${varName}Manifest = require('../../../data/${name}/manifest.json') as { total: number; chunkSize: number; chunks: number };\n`;
  fs.writeFileSync(path.join(registryDir, `${varName}Registry.ts`), content);
}

writeRegistry('doctors', 'Doctor', 'consultation', doctorChunks);
writeRegistry('products', 'Product', 'shop', productChunks);
writeRegistry('health-records', 'HealthRecord', 'health-records', recordChunks);

// Generate slots registry
const slotsRegistryDir = path.join(__dirname, '../src/core/api/registries');
ensureDir(slotsRegistryDir);
const slotDoctorIds = JSON.parse(fs.readFileSync(path.join(slotsDir, 'manifest.json'), 'utf8')).doctors;
const slotLines = slotDoctorIds.map(
  (id) => `  '${id}': require('../../../data/slots/${id}.json') as TimeSlot[],`,
);
const slotsRegistryContent = `import type { TimeSlot } from '../../../modules/consultation/types';

export const slotsByDoctor: Record<string, TimeSlot[]> = {
${slotLines.join('\n')}
};

export const slotsDoctorIds: string[] = ${JSON.stringify(slotDoctorIds)};
`;
fs.writeFileSync(path.join(slotsRegistryDir, 'slotsRegistry.ts'), slotsRegistryContent);

console.log('Data generation complete!');
