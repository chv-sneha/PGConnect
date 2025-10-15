const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
const fs = require('fs');
const csv = require('csv-parser');

// Your Firebase config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "skillconnect-4a980.firebaseapp.com",
  projectId: "skillconnect-4a980",
  storageBucket: "skillconnect-4a980.firebasestorage.app",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadCSV(csvFilePath, collectionName) {
  const results = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        console.log(`Uploading ${results.length} records to ${collectionName}...`);
        
        for (const record of results) {
          try {
            await addDoc(collection(db, collectionName), record);
            console.log(`✅ Uploaded record ${record.id || 'unknown'}`);
          } catch (error) {
            console.error(`❌ Error uploading record:`, error);
          }
        }
        
        console.log(`🎉 Finished uploading ${collectionName}`);
        resolve();
      })
      .on('error', reject);
  });
}

async function uploadAllCollections() {
  try {
    console.log('🚀 Starting CSV upload to Firebase...');
    
    await uploadCSV('./professions.csv', 'professions');
    await uploadCSV('./locations.csv', 'locations');
    await uploadCSV('./opportunities.csv', 'opportunities');
    await uploadCSV('./skill_requests.csv', 'skill_requests');
    await uploadCSV('./users.csv', 'users');
    
    console.log('✅ All collections uploaded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Upload failed:', error);
    process.exit(1);
  }
}

uploadAllCollections();