const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, deleteDoc, getDocs } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Firebase config
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

// Parse CSV function
function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
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
        let value = values[index].replace(/"/g, '');
        
        // Convert numeric fields
        if (['career_id', 'skill_id', 'type_id', 'path_id', 'question_id', 'min_salary', 'max_salary', 'learning_months', 'salary_boost_percent', 'weight', 'tech_points', 'creative_points', 'social_points', 'practical_points', 'order', 'duration_weeks'].includes(header)) {
          value = parseFloat(value) || 0;
        }
        
        // Convert boolean fields
        if (['remote_work'].includes(header)) {
          value = value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
        }
        
        obj[header] = value;
      });
      data.push(obj);
    }
  }
  return data;
}

// Clear collection function
async function clearCollection(collectionName) {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log(`Cleared ${collectionName} collection`);
  } catch (error) {
    console.log(`Collection ${collectionName} doesn't exist or is empty`);
  }
}

// Upload data function
async function uploadData(collectionName, data) {
  console.log(`Uploading ${data.length} documents to ${collectionName}...`);
  
  for (const item of data) {
    try {
      await addDoc(collection(db, collectionName), item);
    } catch (error) {
      console.error(`Error uploading to ${collectionName}:`, error);
    }
  }
  console.log(`✅ Uploaded ${data.length} documents to ${collectionName}`);
}

// Main upload function
async function uploadAllCSVs() {
  try {
    // Upload careers
    if (fs.existsSync('careers.csv')) {
      const careersCSV = fs.readFileSync('careers.csv', 'utf8');
      const careersData = parseCSV(careersCSV);
      await clearCollection('careers');
      await uploadData('careers', careersData);
    }
    
    // Upload skills
    if (fs.existsSync('skills.csv')) {
      const skillsCSV = fs.readFileSync('skills.csv', 'utf8');
      const skillsData = parseCSV(skillsCSV);
      await clearCollection('skills');
      await uploadData('skills', skillsData);
    }
    
    // Upload personality types
    if (fs.existsSync('personality_types.csv')) {
      const personalityCSV = fs.readFileSync('personality_types.csv', 'utf8');
      const personalityData = parseCSV(personalityCSV);
      await clearCollection('personality_types');
      await uploadData('personality_types', personalityData);
    }
    
    // Upload learning paths
    if (fs.existsSync('learning_paths.csv')) {
      const learningCSV = fs.readFileSync('learning_paths.csv', 'utf8');
      const learningData = parseCSV(learningCSV);
      await clearCollection('learning_paths');
      await uploadData('learning_paths', learningData);
    }
    
    // Upload question weights
    if (fs.existsSync('question_weights.csv')) {
      const weightsCSV = fs.readFileSync('question_weights.csv', 'utf8');
      const weightsData = parseCSV(weightsCSV);
      await clearCollection('question_weights');
      await uploadData('question_weights', weightsData);
    }
    
    console.log('🎉 All CSV files uploaded successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error uploading CSV files:', error);
    process.exit(1);
  }
}

uploadAllCSVs();