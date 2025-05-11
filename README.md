<!-- Welcome to HopeConnect 🌍
HopeConnect is a backend API developed to support a humanitarian platform focused on aiding orphaned children in Gaza after the war. This system connects donors, sponsors, and volunteers with verified orphanages and children in need. The project ensures transparency, security, and efficient resource management to make sure help reaches those who need it most.

Features
Core Features ✨
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


Additional Features ⭐
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
      QuickChart API: This API is used to create and fetch chart images based on data, which are then included in the PDF reports generated for users.

      Axios: We use Axios to send HTTP requests to the QuickChart API to retrieve the chart images efficiently.
      
      📧 Nodemailer
      SMTP Email Sending API
        Purpose: To handle automated email communication within the HopeConnect platform.
        Usage: Nodemailer is used to send verification emails upon user registration, notify donors and sponsors of donation confirmations, and alert users to emergency relief campaigns or orphanage updates. This ensures reliable and timely communication between the system and its users, enhancing trust and engagement.

Geocoding API: This API turns addresses into coordinates (latitude and longitude). It helps find where items are located so users can easily see where to pick them up.
Routing API: This API provides directions between two locations. It helps optimize delivery routes, making it quicker and easier for items to be delivered.
Google Maps API: This API provides mapping services. A link is created using delivery coordinates, allowing customers to view delivery locations on Google Maps for easy navigation.
    
Since the Geocoding and Routing APIs are paid services, we simulated them using the Here platform, allowing us to test location and routing features without extra costs.


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
- Github -->
