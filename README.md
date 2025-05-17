## Welcome to HopeConnect 🌍
HopeConnect is a backend API developed to support a humanitarian platform focused on aiding orphaned children in Gaza after the war. This system connects donors, sponsors, and volunteers with verified orphanages and children in need. The project ensures transparency, security, and efficient resource management to make sure help reaches those who need it most.


## ✨ Core Features

### 🧒 Orphan Profiles & Sponsorships
- Each orphan has a detailed profile: personal info, education, and health status.
- Donors can choose from flexible sponsorship models.
- Real-time updates: photos, progress reports, health records.

### 💝 Donation Management
- Supports monetary, clothing, food, and educational donations.
- Donation categories:
  - **General Fund**: Daily operations.
  - **Education Support**: Tuition, books, school supplies.
  - **Medical Aid**: Healthcare and medical treatments.
- Integrated payment system for **secure and seamless donations**.
- Donors receive updates on fund usage.

### 🤝 Volunteer & Service Matching
- Volunteers can register to provide services: mentoring, teaching, medical aid.
- Orphanages post support requests.
- A matching algorithm pairs volunteers with suitable tasks.

### 🔍 Trust & Transparency
- Donor dashboard to track donation impact.
- Verified NGOs/orphanages ensure **legitimacy**.
- Donor reviews and ratings promote **accountability**.

### 🚨 Emergency Relief
- Support urgent campaigns (e.g., medical emergencies, food shortages).
- Automated **email alerts** notify users about critical needs.

### 🚚 Logistics & Resource Distribution
- Real-time mapping system tracks **donations and deliveries**.
- Coordinates pickup and delivery of physical goods.

### Revenue Model & Sustainability 
- Small transaction fees on donations to cover operational costs. 
- Partnerships with NGOs, charities, and humanitarian organizations.

  
## Additional Features ⭐
### 🔐 User Privacy & Data Security
- Passwords encrypted with `bcrypt`.
- JWT-based authentication.
- Strict privacy protocols for sensitive data.

### ✉️ Email Verification
- Users are required to verify their email addresses upon registration, improving security, ensuring legitimate sign-ups, and enhancing communication for notifications, donation updates, and important alerts.
- Improves platform security and communication.

### 🧑‍💼 Role-Based Access Control
- **Admin**: Manage platform and user activity.
- **Sponsor**: Support orphans and manage sponsorships.
- **Donor**: Make and track donations.
- **Volunteer**: Offers services and tracks opportunities available through orphanages.

### 📄 PDF Report Generation (Admin Only)
Auto-generates downloadable reports with charts:
- **User Summary**: Role-based statistics (with pie charts).
- **Orphanage Report**: Verified vs. unverified stats.
- **Orphan Stats**: Age, health, education breakdown (bar/pie charts).
- **Sponsorship Report**: Count, status, totals, averages.

Chart images are embedded using **Chart.js (via QuickChart API)** for clear data visualization.

### 🧠 Error Handling
- Try-catch blocks throughout services/controllers.
- Ensures **graceful failure** and meaningful HTTP responses.

## External APIs📍🗺️📩:
   📊 **QuickChart API**:   To create and fetch chart images based on data, which are then included in the PDF reports generated for users.

   📦 **Axios**:   We use Axios to send HTTP requests to various APIs including:
   - QuickChart API: for chart generation
   - MapQuest API: for geolocation and routing
   - Axios ensures efficient and reliable communication with external services.

   📧 **Nodemailer**:   SMTP Email Sending API
   - To handle automated email communication within the HopeConnect platform.
   - Nodemailer is used to send verification emails upon user registration, notify donors and sponsors of donation confirmations, and alert users to emergency relief campaigns or orphanage updates. This ensures reliable and timely communication between the system and its users, enhancing trust and engagement.

   🗺️ **MapQuest API**:   Provides geocoding (convert addresses to coordinates) and routing (get directions and travel time) services.
   - getCoordinates(address): Converts a physical address into latitude and longitude.
   - getRoute(from, to): Calculates distance, travel time, and step-by-step directions between two locations.
   - Used in the donation pickup and delivery coordination features of the HopeConnect platform.   

   💬 **Hugging Face Sentiment Analysis API**:
    Analyzes the emotional tone of user-submitted messages (e.g., from children, volunteers, or sponsors).
     Used to:
- Detect positive, neutral, or negative sentiments
- Highlight urgent or emotionally sensitive messages
- Generate emotional insight charts using QuickChart

This helps the platform monitor well-being and respond empathetically, strengthening community support and trust.

## Tools And Libraries 🛠️
- Node.js 
- Express.js
- PostgreSQL
- bcrypt 
- JWT 
- Express Validator
- Chart.js 
- PDFKit, Axios 
- VsCode
- Github 


## Why Node.js? 🤷‍♀️
   Node.js was chosen as the backend technology for the HopeConnect platform because of its ability to efficiently handle multiple simultaneous requests—essential for managing real-time updates, donations, volunteer coordination, and sponsorships. Built on the high-performance V8 JavaScript engine, Node.js executes code quickly, which helps keep the platform responsive as users interact with features like real-time orphan updates or delivery tracking. Using JavaScript on both the frontend and backend improves collaboration among developers and encourages code reuse. Additionally, Node’s vast ecosystem of packages via npm speeds up development and integration with services like Coordinates, email notifications. Its scalability ensures HopeConnect can grow to support more users, orphanages, and real-time features without performance loss. Lastly, the strong Node.js community provides robust support, tools, and best practices—critical for delivering a reliable and secure platform dedicated to supporting vulnerable children.

## Project Structure 🗂️
![Screenshot 2025-05-12 124250](https://github.com/user-attachments/assets/27a6ec20-b5d6-461d-8443-6ecbdad8a6d2)

   This file structure is well-organized for a Node.js application using the MVC architecture, promoting separation of concerns and maintainability. Each folder and file plays a crucial role in the application's functionality, making it easier for developers to work collaboratively and efficiently.

   📁 **config/**
        
  Contains the setup for connecting to the PostgreSQL database using the pg library and environment-based configuration for development, testing, and production stages.

   📁 **controllers/**
  
  Contains all controller files responsible for handling the core business logic of the application. Each controller focuses on a specific domain—such as user management, donations, sponsorships, volunteer coordination, and emergency campaigns.

   📁 **middleware/**
  
  Includes middleware functions for authentication and authorization. These ensure secure and consistent request processing across all routes.

   📁 **routers/**
  
  This directory contains all the Express route definitions, mapping HTTP endpoints to their corresponding controller functions. It ensures a well-structured and easily maintainable API routing system.

   📁 **services/**
  
  Contains utility functions and services used across the application, including sentiment analysis, PDF generation, and authentication-related functions like password hashing and token verification. These services are modular to support various features of the HopeConnect platform.


   📄 **.env**
       
  An environment configuration file storing sensitive credentials and API keys (e.g., database URL, SMTP settings, MapQuest key). It is excluded from version control for security.

   📄 **.gitignore**
  
  Specifies files and folders to be excluded from Git tracking, such as node_modules/, .env, and logs.

   📄 **index.js**
  
  The main entry point of the HopeConnect backend application. It initializes the Express server, loads environment variables, connects to the database, and registers all API routes to set up the application's core HTTP infrastructure.

   📄 **package.json & package-lock.json**
  
  Define the project’s dependencies, scripts, and metadata, ensuring consistency across development and deployment environments.


## API Documentation🚀🪐🌌⭐
   The API is fully documented using Postman. You can access the API documentation by navigating to  once the backend is running. This documentation includes details about all available endpoints, request parameters, response formats, and example requests and responses.


## UML Diagram
![Untitled](https://github.com/user-attachments/assets/5082c507-5b97-49fc-9edd-a3ff4033b00b)

