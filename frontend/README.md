# Doc Ship

## Aim
Allows user to  send documents from USA to India.

## Workflow
1. Home → New shipment  
2. Select type of shipping: Document  
3. Select source country: USA  
   - After selecting USA → Show ZIP code field  
4. Select destination country: India  
   - After selecting India → Show PIN code field  
5. Choose courier (FedEx, UPS)
6. click on submit
7.  Show price, currency, and number of days required  
8.click on  Confirm



---

## How to run locally 

# 1️⃣ Clone the repository
git clone https://github.com/santhosh72744/docship

 2️⃣ Move into the project directory
cd docship

# 3️⃣ Install dependencies
npm install

# 4️⃣ Start the development server

npm start       

Open http://localhost:3000 to view it in your browser.

---



##  Testing & Validations

This project includes test cases to verify all input validations (ZIP, PIN, and form fields).

## Validations
  
-  ZIP code must be 5 digits 
-   PIN code must be 6 digits
-   Every field must be filled

###  Run Tests

npm test

---

flowchart TD

  A([Start]) --> B[Enter ZIP code]
  B --> C[Enter PIN code]
  C --> D[Select courier service]
  D --> E[Get shipping estimate\n(price, delivery days)]
  E --> F[Paste full address or enter manually]
  F --> G[Address parsed into structured fields]
  G --> H[Review shipment details]
  H --> I[Enter payment details\n(Card No, Expiry, CVV)]
  I --> J[Payment validation]
  J -->|Valid| K[Payment successful]
  J -->|Invalid| JErr[Show error message]

  K --> L[Generate shipping label\n(PDF + tracking number)]
  L --> M([End])






