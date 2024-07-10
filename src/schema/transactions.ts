import { ObjectId } from 'mongodb'; // Assuming ObjectId might be used for _id fields

interface Item {
  itemId: ObjectId;
  description: string;
  quantity: number;
  price: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Transaction {
  _id: string,
  transaction_id: string,
  user_name: string,
  amount: string,
  currency: string,
  status: string,
  payment: string,
}

interface Invoice {
  invoice_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  amount: string;
  currency: string;
  due_date: Date;
}

interface TransactionResponse {
  records: Transaction[],
  total: number,
}

interface InvoiceResponse {
  records: Invoice[],
  total: number,
}

export { 
  Transaction, 
  Item, 
  Address, 
  Invoice, 
  TransactionResponse, 
  InvoiceResponse 
};
