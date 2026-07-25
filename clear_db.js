import { Client, Databases, Query } from 'appwrite';

const client = new Client()
  .setEndpoint('https://sfo.cloud.appwrite.io/v1')
  .setProject('6a64224b00085089e781');

const databases = new Databases(client);
const DATABASE_ID = 'businessia_db';
const collections = ['products', 'clients', 'sales'];

async function clearCollection(collectionId) {
  let hasMore = true;
  let deletedCount = 0;
  
  while (hasMore) {
    const response = await databases.listDocuments(DATABASE_ID, collectionId, [
      Query.limit(100)
    ]);
    
    if (response.documents.length === 0) {
      hasMore = false;
      break;
    }
    
    const deletePromises = response.documents.map(doc => 
      databases.deleteDocument(DATABASE_ID, collectionId, doc.$id)
    );
    
    await Promise.all(deletePromises);
    deletedCount += response.documents.length;
    console.log(`Deleted ${response.documents.length} from ${collectionId}`);
  }
  
  console.log(`Finished clearing ${collectionId}. Total deleted: ${deletedCount}`);
}

async function run() {
  console.log('Starting database cleanup...');
  for (const collection of collections) {
    await clearCollection(collection);
  }
  console.log('Database cleanup completed!');
}

run().catch(console.error);
