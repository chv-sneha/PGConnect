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

// Clear existing collection
async function clearCollection(collectionName) {
  const snapshot = await getDocs(collection(db, collectionName));
  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  console.log(`✅ Cleared ${collectionName} collection`);
}

// Parse CSV data
function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
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

// Upload data to Firebase
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
    console.log('🚀 Starting CSV upload to Firebase...');

    // 1. Upload professions
    const professionsCSV = `id,name,description,icon,category
1,Dancer,Performs dance routines,icon_dance.png,Arts
2,Web Developer,Builds websites,icon_web.png,Technology
3,Graphic Designer,Creates visual content,icon_graphic.png,Design
4,Photographer,Captures professional photos,icon_photo.png,Arts
5,Music Teacher,Teaches music skills,icon_music.png,Arts
6,Yoga Instructor,Leads yoga sessions,icon_yoga.png,Fitness
7,Chef,Prepares and cooks meals,icon_chef.png,Culinary
8,Content Writer,Writes articles/blogs,icon_writer.png,Media
9,Event Planner,Organizes events,icon_event.png,Management
10,Data Analyst,Analyzes data trends,icon_data.png,Technology
11,UX Designer,Designs user experiences,icon_ux.png,Design
12,Teacher,Educates students in schools,icon_teacher.png,Education
13,Software Engineer,Develops software apps,icon_software.png,Technology
14,Actor,Performs in theater or film,icon_actor.png,Arts
15,DJ,Performs music mixing,icon_dj.png,Arts
16,Fitness Trainer,Provides workout guidance,icon_fitness.png,Fitness
17,Translator,Translates documents,icon_translate.png,Language
18,Mechanic,Fixes vehicles,icon_mechanic.png,Technical
19,Illustrator,Draws illustrations,icon_illustrator.png,Design
20,SEO Specialist,Optimizes websites for search,icon_seo.png,Marketing`;

    await clearCollection('professions');
    await uploadToFirebase(parseCSV(professionsCSV), 'professions');

    // 2. Upload locations
    const locationsCSV = `id,city,state,country,latitude,longitude,map_url
1,Bangalore,Karnataka,India,12.9716,77.5946,https://www.google.com/maps?q=12.9716,77.5946
2,Mumbai,Maharashtra,India,19.0760,72.8777,https://www.google.com/maps?q=19.0760,72.8777
3,Delhi,Delhi,India,28.6139,77.2090,https://www.google.com/maps?q=28.6139,77.2090
4,Chennai,Tamil Nadu,India,13.0827,80.2707,https://www.google.com/maps?q=13.0827,80.2707
5,Kolkata,West Bengal,India,22.5726,88.3639,https://www.google.com/maps?q=22.5726,88.3639
6,Pune,Maharashtra,India,18.5204,73.8567,https://www.google.com/maps?q=18.5204,73.8567
7,Hyderabad,Telangana,India,17.3850,78.4867,https://www.google.com/maps?q=17.3850,78.4867
8,Ahmedabad,Gujarat,India,23.0225,72.5714,https://www.google.com/maps?q=23.0225,72.5714
9,Jaipur,Rajasthan,India,26.9124,75.7873,https://www.google.com/maps?q=26.9124,75.7873
10,Surat,Gujarat,India,21.1702,72.8311,https://www.google.com/maps?q=21.1702,72.8311`;

    await clearCollection('locations');
    await uploadToFirebase(parseCSV(locationsCSV), 'locations');

    // 3. Upload opportunities
    const opportunitiesCSV = `id,title,profession_id,organizer,description,address,latitude,longitude,date,time,salary,contact_email,contact_phone,type,required_skills,status,registration_url,fee
1,Dance Workshop - Bollywood Fusion,1,DanceHub Studio,3-day intensive workshop on Bollywood fusion choreography,Koramangala Bangalore,12.9352,77.6245,2025-02-28,10:00 AM,,workshop@dancehub.in,+91-9876543213,Workshop,Basic dance knowledge,Open,https://dancehub.in/register,3500
2,Wedding Dance Performance,1,Celebration Events,Choreograph and perform for wedding celebration,Palace Grounds Bangalore,13.0067,77.5845,2025-03-15,6:00 PM,25000,bookings@celebration.com,+91-9876543211,Job,Professional dance;Team coordination,Open,https://celebration.com/apply,
3,Web Development Bootcamp,2,CodeAcademy,Full stack web development training,Tech Park Bangalore,12.9720,77.5950,2025-03-15,09:00 AM,,contact@codeacademy.com,+91-9876543211,Workshop,HTML;CSS;JavaScript,Open,https://codeacademy.com/register,10000
4,Senior React Developer,2,TechCorp Solutions,Build scalable web applications using React,Electronic City Bangalore,12.8456,77.6603,2025-04-01,10:00 AM,1500000,hr@techcorp.com,+91-9876543210,Job,React;TypeScript;Node.js,Open,https://techcorp.com/careers,
5,Graphic Design Masterclass,3,DesignHub,Advanced design techniques and portfolio building,Creative Street Bangalore,12.9740,77.5970,2025-03-20,2:00 PM,,contact@designhub.com,+91-9876543213,Workshop,Photoshop;Illustrator,Open,https://designhub.com/register,8000
6,Photography Basics Workshop,4,PhotoWorld,Learn DSLR photography and composition,MG Road Bangalore,12.9730,77.5960,2025-03-12,11:00 AM,,info@photoworld.com,+91-9876543212,Workshop,Basic photography knowledge,Open,https://photoworld.com/register,3000
7,Guitar Lessons Workshop,5,MusicAcademy,Learn guitar basics and advanced techniques,Music Lane Bangalore,12.9750,77.5980,2025-03-08,5:00 PM,,music@academy.com,+91-9876543214,Workshop,Basic music knowledge,Open,https://musicacademy.com/register,2000`;

    await clearCollection('opportunities');
    await uploadToFirebase(parseCSV(opportunitiesCSV), 'opportunities');

    // 4. Upload skill requests
    const skillRequestsCSV = `id,user_id,skill_needed,title,description,budget_range,deadline,location,is_remote,urgency_level,status,created_at
1,5,Python,Need Python tutor,Looking for someone to teach Python basics,$50-$100,2025-11-01,Remote,Yes,Medium,Open,2025-10-01
2,12,Photoshop,Photo editing help,Need help editing product images,$30-$70,2025-10-25,New York,No,High,Open,2025-09-28
3,7,Guitar,Guitar lessons,Want beginner guitar lessons,$40-$80,2025-11-10,Los Angeles,No,Medium,Open,2025-10-02
4,9,Excel,Excel automation help,Help to automate Excel reports,$50-$120,2025-11-05,Remote,Yes,High,Open,2025-09-30
5,15,Spanish,Spanish conversation partner,Practice conversational Spanish,$20-$50,2025-10-28,Madrid,No,Medium,Open,2025-09-27`;

    await clearCollection('skill_requests');
    await uploadToFirebase(parseCSV(skillRequestsCSV), 'skill_requests');

    // 5. Upload users
    const usersCSV = `id,name,email,profession,location,rating,experience_years,skills,avatar
1,Rahul Singh,rahul@example.com,Web Developer,Bangalore,4.5,3,React;JavaScript;Node.js,RS
2,Harshit Kumar,harshit@example.com,Graphic Designer,Mumbai,4.2,2,Photoshop;Illustrator;Figma,H
3,Tushar Saini,tushar@example.com,Photographer,Delhi,4.7,5,Portrait;Wedding;Event Photography,T
4,Priya Sharma,priya@example.com,Dancer,Chennai,4.3,4,Classical;Bollywood;Contemporary,P
5,Amit Patel,amit@example.com,Music Teacher,Pune,4.6,6,Guitar;Piano;Music Theory,A`;

    await clearCollection('users');
    await uploadToFirebase(parseCSV(usersCSV), 'users');

    console.log('🎉 All CSV data uploaded successfully to Firebase!');
    console.log('📊 Collections created:');
    console.log('  - professions (20 records)');
    console.log('  - locations (10 records)');
    console.log('  - opportunities (7 records)');
    console.log('  - skill_requests (5 records)');
    console.log('  - users (5 records)');

  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

uploadAllCSV();