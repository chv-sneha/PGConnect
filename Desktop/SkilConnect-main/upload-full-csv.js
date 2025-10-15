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

function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
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
    
    if (values.length === headers.length) {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      data.push(obj);
    }
  }
  return data;
}

async function uploadToFirebase(data, collectionName) {
  console.log(`📤 Uploading ${data.length} records to ${collectionName}...`);
  
  for (const record of data) {
    try {
      await addDoc(collection(db, collectionName), record);
    } catch (error) {
      console.error(`❌ Error uploading to ${collectionName}:`, error);
    }
  }
  console.log(`✅ Uploaded ${data.length} records to ${collectionName}`);
}

async function uploadAllCSV() {
  try {
    console.log('🚀 Reading and uploading full CSV files...');

    // Read and upload professions.csv
    const professionsData = fs.readFileSync('./professions.csv', 'utf8');
    await clearCollection('professions');
    await uploadToFirebase(parseCSV(professionsData), 'professions');

    // Read and upload locations.csv
    const locationsData = fs.readFileSync('./locations.csv', 'utf8');
    await clearCollection('locations');
    await uploadToFirebase(parseCSV(locationsData), 'locations');

    // Read and upload opportunities.csv
    const opportunitiesData = fs.readFileSync('./opportunities.csv', 'utf8');
    await clearCollection('opportunities');
    await uploadToFirebase(parseCSV(opportunitiesData), 'opportunities');

    // Read and upload skill_requests.csv
    const skillRequestsData = fs.readFileSync('./skill_requests.csv', 'utf8');
    await clearCollection('skill_requests');
    await uploadToFirebase(parseCSV(skillRequestsData), 'skill_requests');

    // Read and upload users.csv
    const usersData = fs.readFileSync('./users.csv', 'utf8');
    await clearCollection('users');
    await uploadToFirebase(parseCSV(usersData), 'users');

    console.log('🎉 All full CSV data uploaded successfully to Firebase!');

  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

uploadAllCSV();