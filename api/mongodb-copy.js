/**
 * MongoDB Data Copy Script
 * Copies data from source MongoDB (192.168.203.25) to target MongoDB (192.168.203.175)
 * 
 * Usage: node api/mongodb-copy.js
 */

const { MongoClient } = require('mongodb');

const SOURCE_URI = 'mongodb://admin:admin@192.168.203.25:27017';
const TARGET_URI = 'mongodb://admin:admin@192.168.203.175:27017';

async function copyMongoDB() {
  let sourceClient, targetClient;

  try {
    console.log('Connecting to source MongoDB (192.168.203.25)...');
    sourceClient = new MongoClient(SOURCE_URI);
    await sourceClient.connect();
    console.log('Connected to source MongoDB');

    console.log('Connecting to target MongoDB (192.168.203.175)...');
    targetClient = new MongoClient(TARGET_URI);
    await targetClient.connect();
    console.log('Connected to target MongoDB');

    const sourceDb = sourceClient.db();
    const targetDb = targetClient.db();

    // Get all collection names
    const collections = await sourceDb.listCollections().toArray();
    console.log(`Found ${collections.length} collections to copy`);

    for (const coll of collections) {
      const collName = coll.name;
      console.log(`\nCopying collection: ${collName}`);

      // Get all documents from source collection
      const sourceCollection = sourceDb.collection(collName);
      const documents = await sourceCollection.find({}).toArray();

      if (documents.length === 0) {
        console.log(`  - No documents in ${collName}, skipping`);
        continue;
      }

      console.log(`  - Found ${documents.length} documents`);

      // Get target collection
      const targetCollection = targetDb.collection(collName);

      // Drop existing collection data (optional - remove if you want to keep existing data)
      await targetCollection.deleteMany({});
      console.log(`  - Cleared existing data in target`);

      // Insert documents into target
      if (documents.length > 0) {
        await targetCollection.insertMany(documents);
        console.log(`  - Inserted ${documents.length} documents`);
      }
    }

    console.log('\n========================================');
    console.log('MongoDB data copy completed successfully!');
    console.log('Source: 192.168.203.25 -> Target: 192.168.203.175');
    console.log('========================================\n');

  } catch (error) {
    console.error('Error copying MongoDB data:', error.message);
    process.exit(1);
  } finally {
    if (sourceClient) await sourceClient.close();
    if (targetClient) await targetClient.close();
  }
}

// Run the copy script
copyMongoDB();
