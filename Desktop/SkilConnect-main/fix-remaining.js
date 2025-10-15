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
  const lines = csvContent.replace(/\r/g, '').split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',').map(v => v.trim());
    
    if (values.length >= headers.length) {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
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

async function uploadRemaining() {
  try {
    // Upload locations
    const locationsData = fs.readFileSync('./locations.csv', 'utf8');
    await clearCollection('locations');
    await uploadToFirebase(parseCSV(locationsData), 'locations');

    // Upload opportunities  
    const opportunitiesData = fs.readFileSync('./opportunities.csv', 'utf8');
    await clearCollection('opportunities');
    await uploadToFirebase(parseCSV(opportunitiesData), 'opportunities');

    console.log('🎉 Remaining collections uploaded!');

  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

uploadRemaining();