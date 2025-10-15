const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
const fs = require('fs');
const csv = require('csv-parser');

const firebaseConfig = {
  apiKey: "AIzaSyCFh4S5Ixrc8eNc07jIRzL9hjeORb1JW70",
  authDomain: "skillconnect-4a980.firebaseapp.com",
  projectId: "skillconnect-4a980",
  storageBucket: "skillconnect-4a980.firebasestorage.app",
  messagingSenderId: "348105182565",
  appId: "1:348105182565:web:fbcb1d870a273bf630258c",
  measurementId: "G-VNVWP3Q71W"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const csvFiles = [
  { file: 'skill_posts.csv', collection: 'skill_posts' },
  { file: 'skill_categories.csv', collection: 'skill_categories' },
  { file: 'skill_requests.csv', collection: 'skill_requests' },
  { file: 'skill_matches.csv', collection: 'skill_matches' },
  { file: 'skill_reviews.csv', collection: 'skill_reviews' },
  { file: 'skill_sessions.csv', collection: 'skill_sessions' },
  { file: 'user_skills.csv', collection: 'user_skills' },
  { file: 'skill_messages.csv', collection: 'skill_messages' }
];

async function uploadCSV(fileName, collectionName) {
  return new Promise((resolve, reject) => {
    const results = [];
    
    if (!fs.existsSync(fileName)) {
      console.log(`File ${fileName} not found, skipping...`);
      resolve(0);
      return;
    }

    fs.createReadStream(fileName)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          let count = 0;
          for (const row of results) {
            // Convert string booleans to actual booleans
            Object.keys(row).forEach(key => {
              if (row[key] === 'true') row[key] = true;
              if (row[key] === 'false') row[key] = false;
              if (row[key] === '') row[key] = null;
              // Convert numeric strings to numbers
              if (!isNaN(row[key]) && row[key] !== '' && row[key] !== null) {
                row[key] = Number(row[key]);
              }
            });

            await addDoc(collection(db, collectionName), row);
            count++;
          }
          console.log(`Uploaded ${count} documents to ${collectionName}`);
          resolve(count);
        } catch (error) {
          console.error(`Error uploading to ${collectionName}:`, error);
          reject(error);
        }
      });
  });
}

async function uploadAllCSVs() {
  let totalUploaded = 0;
  
  for (const { file, collection: collectionName } of csvFiles) {
    try {
      const count = await uploadCSV(file, collectionName);
      totalUploaded += count;
    } catch (error) {
      console.error(`Failed to upload ${file}:`, error);
    }
  }
  
  console.log(`\nTotal documents uploaded: ${totalUploaded}`);
  process.exit(0);
}

uploadAllCSVs();