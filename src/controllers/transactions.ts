import { Invoice, InvoiceResponse, Transaction, TransactionResponse, } from '@/schema/transactions';
import { MongoClient, MongoClientOptions, Db, Collection, Document } from 'mongodb';

const dbName = 'Payments';

const uri = process.env.DB_URL || '';

async function connectMongo(): Promise<MongoClient> {
  const clientOptions: MongoClientOptions = {
  };
  
  const client = new MongoClient(uri, clientOptions);
  await client.connect();
  console.log('Connected to MongoDB');
  return client;
}

export async function handleGetTransactions(page: number, limit: number, search?: string): Promise<TransactionResponse> {
  let client: MongoClient | undefined;
  
  client = await connectMongo();
  const collectionName = 'transactions';
  try {

    const db: Db = client.db(dbName);
    const collection: Collection<Document> = db.collection(collectionName);

    const skip: number = (page - 1) * limit;
    const query: Document = {};
    console.log(' search ', search)
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } },
        { paymentMethod: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
      ];
    }

    const documents: Document[] = await collection.find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

      const totalDocuments: number = await collection.countDocuments();

    const transactions: Transaction[] = documents.map((doc: Document) => ({
      _id: doc._id.toString(),
      transaction_id: doc.transactionId,
      user_name: doc.username,
      amount: doc.amount,
      currency: doc.currency,
      status: doc.status,
      payment: doc.paymentMethod,
    }));

    return { records: transactions, total: totalDocuments }; 
  } catch (err) {
    console.error('Error retrieving transactions:', err);
    throw err;
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
};

export async function handleGetInvoices(page: number, limit: number, search?: string): Promise<InvoiceResponse> {
  let client: MongoClient | undefined;
  const collectionName = 'invoices';

  try {
    client = await connectMongo();

    const db: Db = client.db(dbName);
    const collection: Collection<Document> = db.collection(collectionName);

    const skip: number = (page - 1) * limit;
    const query: Document = {};

    if (search) {
      query.$or = [
        { customerEmail: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
        { currency: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
        { dueDate: { $regex: search, $options: 'i' } },

      ];
    }

    const documents: Document[] = await collection.find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalDocuments = await collection.countDocuments();

    const invoices: Invoice[] = documents.map((doc: Document) => ({
      _id: doc._id.toString(),
      customer_email: doc.customerEmail,
      customer_name: doc.customerName,
      customer_phone: doc.customerPhone,
      currency: doc.currency,
      due_date: doc.dueDate,
      amount: doc.amount,
      invoice_id: doc.invoiceId,
      status: doc.status,
    }))

    return { total: totalDocuments, records: invoices }
  } catch (err) {
    console.error('Error retrieving transactions:', err);
    throw err;
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}
