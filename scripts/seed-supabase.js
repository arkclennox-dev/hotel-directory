require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Kredensial tidak lengkap! Pastikan NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY tersedia di .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function readData(filename) {
  const filePath = path.join(process.cwd(), 'database', filename);
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Gagal membaca ${filename}: `, error.message);
    return [];
  }
}

async function seedTable(tableName, data) {
  if (!data || data.length === 0) {
    console.log(`⚠️ Melewati tabel ${tableName} (Tidak ada data)`);
    return;
  }
  
  console.log(`Mengunggah ke tabel ${tableName}... (${data.length} baris)`);
  // Supabase automatically handles upserting array payloads
  const { error } = await supabase.from(tableName).upsert(data, { onConflict: 'id' });
  
  if (error) {
    console.error(`❌ Gagal mengunggah tabel ${tableName}:`, error.message);
  } else {
    console.log(`✅ Berhasil mengunggah ${tableName}!`);
  }
}

async function runSeed() {
  console.log("Memulai Migrasi Data Mock ke Supabase...");
  
  // Baca Data
  const cities = readData('cities.json');
  const categories = readData('categories.json');
  const landmarks = readData('landmarks.json');
  const facilities = readData('facilities.json');
  
  // Hotel dan relasinya
  const hotelsData = readData('hotels.json');
  // Ekstrak nested struktur untuk memastikan insert mulus
  const hotels = hotelsData.map(h => {
    const { categories, facilities, images, affiliate_links, ...safeHotel } = h;
    return safeHotel;
  });
  
  const blogPosts = readData('blog-posts.json');

  // Push berdasarkan hierarki relasi (Master -> Detail)
  await seedTable('cities', cities);
  await seedTable('categories', categories);
  await seedTable('landmarks', landmarks);
  await seedTable('facilities', facilities);
  await seedTable('hotels', hotels);
  await seedTable('blog_posts', blogPosts);
  
  // Opsional: Untuk affiliate_links Anda mungkin perlu relasi foreign key
  // Saat ini tidak kita push relasi nested milik hotel karena butuh skema junction
  
  console.log("🎉 Migrasi selesai!");
}

runSeed();
