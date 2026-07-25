import { Client, Databases, ID, Query } from 'appwrite'

const client = new Client()
  .setEndpoint('https://sfo.cloud.appwrite.io/v1')
  .setProject('6a64224b00085089e781')

const databases = new Databases(client)

// IDs
export const DATABASE_ID = 'businessia_db'
export const PRODUCTS_COLLECTION = 'products'
export const CLIENTS_COLLECTION = 'clients'
export const SALES_COLLECTION = 'sales'

// ============================================================
// PRODUCTS
// ============================================================
export async function listProducts() {
  const response = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION, [
    Query.limit(100),
    Query.orderAsc('name'),
  ])
  return response.documents.map((doc) => ({
    id: doc.$id,
    name: doc.name,
    category: doc.category,
    price: doc.price,
    stock: doc.stock,
    sku: doc.sku,
  }))
}

export async function createProduct(product) {
  const response = await databases.createDocument(
    DATABASE_ID,
    PRODUCTS_COLLECTION,
    ID.unique(),
    {
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      sku: product.sku,
    }
  )
  return {
    id: response.$id,
    name: response.name,
    category: response.category,
    price: response.price,
    stock: response.stock,
    sku: response.sku,
  }
}

export async function updateProduct(productId, data) {
  const response = await databases.updateDocument(
    DATABASE_ID,
    PRODUCTS_COLLECTION,
    productId,
    data
  )
  return {
    id: response.$id,
    name: response.name,
    category: response.category,
    price: response.price,
    stock: response.stock,
    sku: response.sku,
  }
}

export async function deleteProduct(productId) {
  await databases.deleteDocument(DATABASE_ID, PRODUCTS_COLLECTION, productId)
}

// ============================================================
// CLIENTS
// ============================================================
export async function listClients() {
  const response = await databases.listDocuments(DATABASE_ID, CLIENTS_COLLECTION, [
    Query.limit(100),
    Query.orderAsc('name'),
  ])
  return response.documents.map((doc) => ({
    id: doc.$id,
    name: doc.name,
    cedula: doc.cedula,
    phone: doc.phone,
    purchases: doc.purchases,
  }))
}

export async function createClient(client) {
  const response = await databases.createDocument(
    DATABASE_ID,
    CLIENTS_COLLECTION,
    ID.unique(),
    {
      name: client.name,
      cedula: client.cedula,
      phone: client.phone,
      purchases: client.purchases || 0,
    }
  )
  return {
    id: response.$id,
    name: response.name,
    cedula: response.cedula,
    phone: response.phone,
    purchases: response.purchases,
  }
}

export async function updateClient(clientId, data) {
  const response = await databases.updateDocument(
    DATABASE_ID,
    CLIENTS_COLLECTION,
    clientId,
    data
  )
  return {
    id: response.$id,
    name: response.name,
    cedula: response.cedula,
    phone: response.phone,
    purchases: response.purchases,
  }
}

// ============================================================
// SALES
// ============================================================
export async function listSales() {
  const response = await databases.listDocuments(DATABASE_ID, SALES_COLLECTION, [
    Query.limit(50),
    Query.orderDesc('createdDate'),
  ])
  return response.documents.map((doc) => ({
    id: doc.$id,
    clientName: doc.clientName,
    items: JSON.parse(doc.items),
    subtotal: doc.subtotal,
    iva: doc.iva,
    total: doc.total,
    itemCount: doc.itemCount,
    createdDate: doc.createdDate,
  }))
}

export async function createSale(sale) {
  const response = await databases.createDocument(
    DATABASE_ID,
    SALES_COLLECTION,
    ID.unique(),
    {
      clientName: sale.clientName,
      items: JSON.stringify(sale.items),
      subtotal: sale.subtotal,
      iva: sale.iva,
      total: sale.total,
      itemCount: sale.itemCount,
      createdDate: new Date().toISOString(),
    }
  )
  return {
    id: response.$id,
    clientName: response.clientName,
    items: JSON.parse(response.items),
    subtotal: response.subtotal,
    iva: response.iva,
    total: response.total,
    itemCount: response.itemCount,
    createdDate: response.createdDate,
  }
}

// ============================================================
// COMPOUND OPERATIONS
// ============================================================

/**
 * Process a full sale:
 * 1. Create the sale document
 * 2. Decrement stock for each product
 * 3. Return updated products list
 */
export async function processSale(cart, clientName) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const iva = subtotal * 0.15
  const total = subtotal + iva

  // Create sale record
  const sale = await createSale({
    clientName,
    items: cart.map((item) => ({
      productId: item.id,
      name: item.name,
      qty: item.qty,
      price: item.price,
    })),
    subtotal,
    iva,
    total,
    itemCount: cart.reduce((sum, item) => sum + item.qty, 0),
  })

  // Update stock for each product
  const stockUpdates = cart.map((item) =>
    databases.updateDocument(DATABASE_ID, PRODUCTS_COLLECTION, item.id, {
      stock: Math.max(0, item.originalStock - item.qty),
    })
  )

  await Promise.all(stockUpdates)

  return sale
}

export { ID, Query }
