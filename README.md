 # DocShip

DocShip is a platform designed with one clear mission:
to make international document delivery simple, affordable, and stress-free.

Every day, thousands of people struggle to send important documents from the USA to India — passports, certificates, legal papers, financial documents, and more. They face long queues, confusing processes, high prices, and uncertainty about delivery timelines.

DocShip solves these problems by providing a guided, reliable, and modern end-to-end shipping experience.

 ## 🌍 Why DocShip?

People sending documents internationally want a platform that is:

Easy to understand

Trustworthy

Fast

Designed for their exact needs

DocShip is built specifically for USA → India document shipping, offering a streamlined process that users can complete in just a few minutes.

 ## 📦 1. Shipping Estimate

DocShip removes the confusion normally associated with international shipping.

Shipping type and route are pre-selected

User enters:

ZIP code (5 digits)

PIN code (6 digits)

Both are validated using a supported PIN code database

User selects a courier (FedEx, UPS, etc.)

DocShip instantly shows:

Estimated price

Delivery time

This step is minimal, clean, and extremely easy to complete.

 ## 🏠 2. Shipment Details

This is one of DocShip’s strongest features.

Users can paste their entire address, and our smart Address Parser automatically converts it into structured fields:

Street

City

State

Country

ZIP/PIN

This saves time, reduces errors, and avoids typing long details.

Manual entry is also supported, and ZIP/PIN fields are auto-filled.

 ## 💳 3. Payment

The payment process is simple and secure.

The user enters:

16-digit card number

Cardholder name

Expiry month & year

3-digit CVV

The backend performs instant validation to ensure accuracy and safety.
After a successful check, DocShip confirms that:

Payment processed → Shipment confirmed

 ## 🏷 4. Shipping Label Generation

Immediately after confirmation, DocShip generates a professional PDF shipping label containing:

Sender & receiver details

Courier information

Barcode

Unique tracking number

Users can download the label instantly. This final step completes the flow and gives customers a fast, effortless shipping experience.

## 🛠 Technical Architecture

DocShip is built on a clean and lightweight architecture.

Backend

Node.js / Express

Strict server-side validation

JSON-based storage

shipments.json

payments.json

addresses.json

Core APIs

Estimate API — calculates shipping cost + delivery time

Address Parser API — extracts structured fields from raw address input

Payment API — validates and records card details

Label Generator API — produces PDF label with tracking ID


## 1️⃣ Clone the repository
git clone https://github.com/santhosh72744/DocShip

## 2️⃣ Move into the project directory
cd DocShip

## 🖥 Backend Setup
Install dependencies
cd backend
 ### npm install

Run backend
### npm start


### Default backend URL:

http://localhost:5000

##  🎨 Frontend Setup
Install dependencies
cd frontend
### npm install

Run development server
 ### npm start


### Default frontend URL:

http://localhost:3000
-----------------------------------------------------------------------
# Click on image to watch
[![Watch on YouTube](thumbnail.png)](https://youtu.be/teEF_QlBv_g)





