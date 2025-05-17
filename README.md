## Welcome to HopeConnect 🌍
HopeConnect is a backend API developed to support a humanitarian platform focused on aiding orphaned children in Gaza after the war. This system connects donors, sponsors, and volunteers with verified orphanages and children in need. The project ensures transparency, security, and efficient resource management to make sure help reaches those who need it most.


## Core Features ✨
🧒 Orphan Profiles & Sponsorships
    Each orphan has a dedicated profile with personal details, education status, and health condition.
    Donors can sponsor children via different donation models.
    Real-time updates include photos, progress reports, and health updates.

💝 Donation Management
    Accepts various donation types: money, clothes, food, educational materials.
    Donation categories:
        General Fund: For daily orphanage operations.
        Education Support: Tuition, books, school fees.
        Medical Aid: Covers healthcare costs.
        Integrated payment system for secure, seamless donations.
    Users get updates on how their donations are used.

🤝 Volunteer & Service Matching
    Volunteers can register to offer services like mentoring, teaching, or medical assistance.
    Orphanages can post requests for specific support.
    A matching algorithm pairs volunteers with suitable opportunities.

🔍 Trust & Transparency
    Donor dashboard to track fund usage and impact.
    Verified orphanages and NGOs to ensure legitimacy.
    Donor reviews and ratings to promote accountability.

🚨 Emergency Relief
    Support urgent relief campaigns (e.g., medical crises, food shortages).
    Email alerts notify donors about critical needs.

🚚 Logistics & Resource Distribution
    Real-time mapping system to track donations and deliveries.
    Coordination for pickup and delivery of physical goods.

Revenue Model & Sustainability 
    Small transaction fees on donations to cover operational costs. 
    Partnerships with NGOs, charities, and humanitarian organizations.


## Additional Features ⭐
    User Privacy and Data Security:
        Strong privacy measures are in place to protect user data. Passwords are encrypted using bcrypt to ensure secure authentication and data protection throughout the platform.
    Email Verification:
        Users are required to verify their email addresses upon registration, improving security, ensuring legitimate sign-ups, and enhancing communication for notifications, donation updates, and important alerts.

    Role-Based Access: Supports multiple user roles:
        Admin: Manages the platform and user activity.
        Sponsor: Can sponsor orphans and make contributions.
        Donor: Can donate, sponsor orphans, and track donations.
        Volunteer: Offers services and tracks opportunities available through orphanages.

    PDF Report Generation
        Automatically generates downloadable PDF reports for admins, summarizing key platform data allowing administrators to monitor financial contributions and resource allocation.
        Reports include:
            User Summary Report: Role-based user statistics with a pie chart.
            Orphanage Report: Verified vs. unverified orphanages with chart visualization.
            Orphan Statistics Report: Age, education, and health distributions of orphans with multiple chart types (bar + pie).
            Sponsorship Report: Number of sponsorships, their statuses, total and average amounts.
        Chart Integration
            Uses chart images (likely via Chart.js or similar through getChartImage) embedded directly into reports.
            Improves data readability and enables data-driven decisions through visualization.
        Admin Access Control for Reports
            Only admins can generate and access reports, ensuring secure and appropriate usage of sensitive platform data.  

    Error Handling
        The application uses basic error handling with try-catch blocks in key service and controller functions. This ensures that unexpected issues—such as database query failures or PDF generation errors—are caught gracefully and meaningful HTTP error responses are returned to the client.

## External APIs📍🗺️📩:
    📊 QuickChart API
        Purpose: To create and fetch chart images based on data, which are then included in the PDF reports generated for users.

    📦 Axios
        Purpose: We use Axios to send HTTP requests to various APIs including:
            QuickChart API: for chart generation
            MapQuest API: for geolocation and routing
        Usage: Axios ensures efficient and reliable communication with external services.

    📧 Nodemailer
        SMTP Email Sending API
        Purpose: To handle automated email communication within the HopeConnect platform.
        Usage: Nodemailer is used to send verification emails upon user registration, notify donors and sponsors of donation confirmations, and alert users to emergency relief campaigns or orphanage updates. This ensures reliable and timely communication between the system and its users, enhancing trust and engagement.

     🗺️ MapQuest API
        Purpose: Provides geocoding (convert addresses to coordinates) and routing (get directions and travel time) services.
        Usage:
        getCoordinates(address): Converts a physical address into latitude and longitude.
        getRoute(from, to): Calculates distance, travel time, and step-by-step directions between two locations.
        Integration: Used in the donation pickup and delivery coordination features of the HopeConnect platform.   


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
    This file structure is well-organized for a Node.js application using the MVC architecture, promoting separation of concerns and maintainability. Each folder and file plays a crucial role in the application's functionality, making it easier for developers to work collaboratively and efficiently.

    📁 config/
        Contains the setup for connecting to the PostgreSQL database using the pg library and environment-based configuration for development, testing, and production stages.

    📁 controllers/
        Contains all controller files responsible for handling the core business logic of the application. Each controller focuses on a specific domain—such as user management, donations, sponsorships, volunteer coordination, and emergency campaigns.

    📁 middleware/
        Includes middleware functions for authentication and authorization. These ensure secure and consistent request processing across all routes.

    📁 routers/
        This directory contains all the Express route definitions, mapping HTTP endpoints to their corresponding controller functions. It ensures a well-structured and easily maintainable API routing system.

    📁 services/
        Contains utility functions and services used across the application, including sentiment analysis, PDF generation, and authentication-related functions like password hashing and token verification. These services are modular to support various features of the HopeConnect platform.


    📄 .env
        An environment configuration file storing sensitive credentials and API keys (e.g., database URL, SMTP settings, MapQuest key). It is excluded from version control for security.

    📄 .gitignore
        Specifies files and folders to be excluded from Git tracking, such as node_modules/, .env, and logs.

    📄 index.js
        The main entry point of the HopeConnect backend application. It initializes the Express server, loads environment variables, connects to the database, and registers all API routes to set up the application's core HTTP infrastructure.

    📄 package.json & package-lock.json
        Define the project’s dependencies, scripts, and metadata, ensuring consistency across development and deployment environments.


## API Documentation🚀🪐🌌⭐
    The API is fully documented using Postman. You can access the API documentation by navigating to API documentation once the backend is running. This documentation includes details about all available endpoints, request parameters, response formats, and example requests and responses.

