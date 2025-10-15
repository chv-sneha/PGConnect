import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, deleteDoc, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = {
  apiKey: "AIzaSyDGpAHia_wEWWgWWWkNfG8dTzM8Xzv0t1g",
  authDomain: "skillconnect-4a980.firebaseapp.com",
  projectId: "skillconnect-4a980",
  storageBucket: "skillconnect-4a980.firebasestorage.app",
  messagingSenderId: "581632635532",
  appId: "1:581632635532:web:1234567890abcdef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearCollection(collectionName) {
  const snapshot = await getDocs(collection(db, collectionName));
  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  console.log(`✅ Cleared ${collectionName} collection`);
}

function parseCSVAdvanced(csvContent) {
  const lines = csvContent.replace(/\r/g, '').split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];
  
  console.log(`📊 Headers: ${headers.join(', ')}`);
  console.log(`📊 Total lines: ${lines.length}`);
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Handle CSV with commas in quoted fields
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    // Accept records with at least basic fields
    if (values.length >= 5) {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      data.push(obj);
    }
  }
  
  console.log(`📊 Parsed ${data.length} valid records`);
  return data;
}

async function uploadToFirebase(data, collectionName) {
  console.log(`📤 Uploading ${data.length} records to ${collectionName}...`);
  
  for (const record of data) {
    try {
      await addDoc(collection(db, collectionName), record);
    } catch (error) {
      console.error(`❌ Error uploading:`, error);
    }
  }
  console.log(`✅ Uploaded ${data.length} records to ${collectionName}`);
}

async function fixOpportunities() {
  try {
    console.log('🔧 Fixing opportunities upload...');
    
    const opportunitiesData = fs.readFileSync('./opportunities.csv', 'utf8');
    console.log(`📄 File size: ${opportunitiesData.length} characters`);
    
    await clearCollection('opportunities');
    const parsedData = parseCSVAdvanced(opportunitiesData);
    await uploadToFirebase(parsedData, 'opportunities');

    console.log('🎉 opportunities fixed and uploaded!');

  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

fixOpportunities();