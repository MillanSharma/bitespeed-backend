import type { Contact, ResponseBody } from '@/schema/schema';
import app from '@/server';
import request from 'supertest'; 

describe('Identity Reconciliation Endpoint Tests', () => {

    let primaryContactId;
    beforeEach(async () => {
        // Set up initial state for each test case
        
        const testData = {
          email: 'lorraine@hillvalley.edu',
          phoneNumber: '123456'
        };
    
        // Make a request to /identify to set up initial state
        const response = await request(app)
          .post('/identify')
          .send(testData)
          .expect(200);
    
        const responseBody = response.body.contact;
        primaryContactId = responseBody.primaryContatctId;
      });
    
    // Test Case 1: New customer with both email and phone number
    it('creates a new primary contact when none exists', async () => {
      const testData = {
        email: 'newcustomer@example.com',
        phoneNumber: '9876543210'
      };
  
      const response = await request(app)
        .post('/identify')
        .send(testData)
        .expect(200);
  
      const responseBody = response.body.contact;
      const primaryContactId = responseBody.primaryContatctId;
  
      expect(responseBody.emails).toContain(testData.email);
      expect(responseBody.phoneNumbers).toContain(testData.phoneNumber);
      expect(responseBody.secondaryContactIds).toEqual([]);
    });
  
    // Test Case 2: Existing customer with email
    it('retrieves existing contact information by email', async () => {
      const testData = {
        email: 'lorraine@hillvalley.edu'
      };
  
      const response = await request(app)
        .post('/identify')
        .send(testData)
        .expect(200);
  
      const responseBody = response.body.contact;
      console.log(' response ', responseBody);
  
      expect(responseBody.emails).toContain('lorraine@hillvalley.edu');
      expect(responseBody.phoneNumbers).toContain('123456');
    });
  
    // Test Case 3: Existing customer with phone number
    it('retrieves existing contact information by phone number', async () => {
      const testData = {
        phoneNumber: '123456'
      };
  
      const response = await request(app)
        .post('/identify')
        .send(testData)
        .expect(200);
  
      const responseBody = response.body.contact;
  
      expect(responseBody.emails).toContain('lorraine@hillvalley.edu');
      expect(responseBody.phoneNumbers).toContain('123456');
    });
  
    // Test Case 4: Request with new email, existing phone number
    it('adds new email to existing contact with shared phone number', async () => {
      const testData = {
        email: 'newcustomer@example.com',
        phoneNumber: '123456'
      };
  
      const response = await request(app)
        .post('/identify')
        .send(testData)
        .expect(200);
  
      const responseBody = response.body.contact;
  
      expect(responseBody.emails).toContain('newcustomer@example.com');
      expect(responseBody.phoneNumbers).toContain('123456');
    });
  
    // Test Case 5: Request with new phone number, existing email
    it('adds new phone number to existing contact with shared email', async () => {
      const testData = {
        email: 'lorraine@hillvalley.edu',
        phoneNumber: '9876543210'
      };
  
      const response = await request(app)
        .post('/identify')
        .send(testData)
        .expect(200);
  
      const responseBody = response.body.contact;
  
      expect(responseBody.emails).toContain('lorraine@hillvalley.edu');
      expect(responseBody.phoneNumbers).toContain('9876543210');
    });
  
    // Test Case 6: Request with no existing contact
    it('handles request with no existing contact', async () => {
      const testData = {
        email: 'nonexistent@example.com'
      };
  
      const response = await request(app)
        .post('/identify')
        .send(testData)
        .expect(200);
  
      const responseBody = response.body.contact;
  
      expect(responseBody.emails).toContain('nonexistent@example.com');
      expect(responseBody.phoneNumbers).toEqual([null]);
    });
  
    // Test Case 7: Missing both email and phone number
    it('returns error for request with missing both email and phone number', async () => {
      const testData = {};
  
      const response = await request(app)
        .post('/identify')
        .send(testData)
        .expect(500);
  
    });
  
    // Test Case 8: Invalid email format
    it('returns error for request with invalid email format', async () => {
      const testData = {
        email: 'invalid-email'
      };
      const response = await request(app)
      .post('/identify')
      .send(testData)
      .expect(500);
    });

    // Test Case 9: Invalid phone number format
    it('returns error for request with invalid phone number format', async () => {
      const testData = {
        email: 'invalid-phone-number'
      };
      const response = await request(app)
      .post('/identify')
      .send(testData)
      .expect(500);
    });
  
  });
  