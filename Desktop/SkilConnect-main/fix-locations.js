import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

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

const locations = [
  {id: "1", city: "Bangalore", state: "Karnataka", country: "India", latitude: "12.9716", longitude: "77.5946", map_url: "https://www.google.com/maps?q=12.9716,77.5946"},
  {id: "2", city: "Mumbai", state: "Maharashtra", country: "India", latitude: "19.0760", longitude: "72.8777", map_url: "https://www.google.com/maps?q=19.0760,72.8777"},
  {id: "3", city: "Delhi", state: "Delhi", country: "India", latitude: "28.6139", longitude: "77.2090", map_url: "https://www.google.com/maps?q=28.6139,77.2090"},
  {id: "4", city: "Chennai", state: "Tamil Nadu", country: "India", latitude: "13.0827", longitude: "80.2707", map_url: "https://www.google.com/maps?q=13.0827,80.2707"},
  {id: "5", city: "Kolkata", state: "West Bengal", country: "India", latitude: "22.5726", longitude: "88.3639", map_url: "https://www.google.com/maps?q=22.5726,88.3639"},
  {id: "6", city: "Pune", state: "Maharashtra", country: "India", latitude: "18.5204", longitude: "73.8567", map_url: "https://www.google.com/maps?q=18.5204,73.8567"},
  {id: "7", city: "Hyderabad", state: "Telangana", country: "India", latitude: "17.3850", longitude: "78.4867", map_url: "https://www.google.com/maps?q=17.3850,78.4867"},
  {id: "8", city: "Ahmedabad", state: "Gujarat", country: "India", latitude: "23.0225", longitude: "72.5714", map_url: "https://www.google.com/maps?q=23.0225,72.5714"},
  {id: "9", city: "Jaipur", state: "Rajasthan", country: "India", latitude: "26.9124", longitude: "75.7873", map_url: "https://www.google.com/maps?q=26.9124,75.7873"},
  {id: "10", city: "Surat", state: "Gujarat", country: "India", latitude: "21.1702", longitude: "72.8311", map_url: "https://www.google.com/maps?q=21.1702,72.8311"}
];

async function uploadLocations() {
  console.log('📍 Uploading locations...');
  for (const location of locations) {
    await addDoc(collection(db, 'locations'), location);
  }
  console.log('✅ Uploaded 10 locations successfully!');
}

uploadLocations();