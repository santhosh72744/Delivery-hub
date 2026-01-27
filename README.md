🚚 Delivery Hub

Delivery Hub is a modern web platform designed to make international document and parcel delivery from the USA to India simple, transparent, and stress-free.

Sending important documents or shipments internationally is often expensive, confusing, and time-consuming. Delivery Hub solves this by providing a guided, step-by-step shipping experience with clear pricing, validated addresses, and secure payments.

🌍 Why Delivery Hub?

Delivery Hub is built for users who want:

A simple and easy-to-understand shipping flow

Transparent pricing with no hidden steps

Reliable delivery timelines

A platform tailored specifically for USA → India shipping

The entire shipment process can be completed in just a few minutes.

📦 Application Flow
1️⃣ Shipping Estimate

Delivery Hub removes the complexity of international shipping estimates.

User inputs:

ZIP Code (5 digits – USA)

PIN Code (6 digits – India)

Both inputs are validated using a supported PIN code database.

System automatically handles:

Shipping route

Service type (Fast / Normal / Air / Sea)

Courier selection (FedEx)

Instantly displays:

Estimated delivery cost

Expected delivery time

This step is intentionally minimal and beginner-friendly.

🏠 2️⃣ Shipment Details

Delivery Hub simplifies address entry with smart parsing.

Users can:

Paste their entire address into a single input field

The system automatically extracts and fills:

Street

City

State

Country

ZIP / PIN Code

Manual entry is also supported, with built-in validation to reduce errors.

💳 3️⃣ Payment (Zelle QR Scanner)

Delivery Hub uses a Zelle-based QR payment system for secure and hassle-free payments.

Payment flow:

A Zelle QR code is generated inside the app

The user scans the QR code using their Zelle-enabled banking app

Payment is completed outside the application

The user enters or confirms the payment reference ID

Backend responsibilities:

Validate the payment reference

Record payment details securely

Link the payment to the shipment tracking number

Once verified:

Payment confirmed → Shipment approved

This approach avoids storing card details and improves security.

🏷 4️⃣ Shipping Label Generation

After successful payment confirmation, Delivery Hub generates a professional PDF shipping label that includes:

Sender and receiver details

Courier information

Barcode

Unique tracking number

Users can download the label instantly, completing the shipping process.

🛠 Technical Architecture
🖥 Backend

Node.js

Express.js

Strict server-side validation

JSON-based storage

Data files:

shipments.json

payments.json

addresses.json

Core APIs:

Estimate API – calculates cost and delivery time

Address Parser API – converts raw address into structured fields

Payment API – validates Zelle payment reference

Label Generator API – generates PDF shipping labels

🎨 Frontend

React

Multi-step guided UI

Service-based categories

Modal-driven service selection

Step navigator with Home navigation

Input-level validation (ZIP & PIN)

Zelle QR scanner payment UI

🚀 Getting Started
1️⃣ Clone the repository
git clone https://github.com/santhosh72744/Delivery-hub.git

2️⃣ Move into the project directory
cd Delivery-hub

🖥 Backend Setup
cd backend
npm install
npm start


Backend URL

http://localhost:5000

🎨 Frontend Setup
cd frontend
npm install
npm start


Frontend URL

http://localhost:3000

✅ Current Status

Core shipping flow implemented

Zelle QR payment integrated

Address parsing enabled

UI actively improving

Production hardening in progress
