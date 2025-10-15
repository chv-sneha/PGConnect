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

function parseCSVBetter(csvContent) {
  const lines = csvContent.replace(/\r/g, '').split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];
  
  console.log(`📊 Headers found: ${headers.join(', ')}`);
  console.log(`📊 Total lines: ${lines.length}`);
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',').map(v => v.trim());
    
    // Accept records even if some fields are missing
    if (values.length >= 3) { // At least id, user_id, skill_needed
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
      console.error(`❌ Error uploading record:`, record, error);
    }
  }
  console.log(`✅ Uploaded ${data.length} records to ${collectionName}`);
}

async function fixSkillRequests() {
  try {
    console.log('🔧 Fixing skill_requests upload...');
    
    const skillRequestsData = fs.readFileSync('./skill_requests.csv', 'utf8');
    console.log(`📄 File size: ${skillRequestsData.length} characters`);
    
    await clearCollection('skill_requests');
    const parsedData = parseCSVBetter(skillRequestsData);
    await uploadToFirebase(parsedData, 'skill_requests');

    console.log('🎉 skill_requests fixed and uploaded!');

  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

fixSkillRequests();