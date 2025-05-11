<!-- # 🌍 Welcome to HopeConnect

**HopeConnect** is a backend API designed to power a humanitarian platform focused on supporting orphaned children in Gaza after the war. It connects donors, sponsors, and volunteers with verified orphanages and children in need. The platform emphasizes transparency, data security, and efficient resource distribution to ensure that support reaches those who need it most.

---

## ✨ Core Features

### 🧒 Orphan Profiles & Sponsorships
- Each orphan has a profile with personal details, education status, and health conditions.
- Donors and sponsors can support children through various donation models.
- Real-time updates include photos, health updates, and progress reports.

### 💝 Donation Management
- Accepts diverse donation types: money, clothes, food, and educational materials.
- Categories include:
  - **General Fund:** For daily operations of orphanages.
  - **Education Support:** Covers tuition, books, and school fees.
  - **Medical Aid:** Supports healthcare and treatment.
- Integrated payment system for secure, seamless transactions.
- Donors receive updates on the impact of their contributions.

### 🤝 Volunteer & Service Matching
- Volunteers can register to offer skills like teaching, mentoring, or medical care.
- Orphanages post requests for specific volunteer roles.
- A matching algorithm pairs volunteers with suitable opportunities.

### 🔍 Trust & Transparency
- Donor dashboard to monitor fund usage and impact.
- Orphanages and NGOs undergo verification to ensure legitimacy.
- Donors can leave reviews and ratings to build platform accountability.

### 🚨 Emergency Relief
- Supports urgent campaigns (e.g., food, medical crises).
- Email alerts notify donors of high-priority needs.

### 🚚 Logistics & Resource Distribution
- Real-time mapping system tracks donations and deliveries.
- Manages pickup and drop-off coordination for physical goods.

---

## ⭐ Additional Features

### 🔐 User Privacy & Data Security
- Passwords are securely hashed using bcrypt.
- Ensures strong authentication and protection of user data.

### 📧 Email Verification
- Users must verify their email addresses during registration.
- Enhances security and ensures valid communications.

### 🧑‍💼 Role-Based Access
- **Admin:** Manages users, orphanages, and reports.
- **Sponsor:** Supports specific orphans via financial contributions.
- **Donor:** Contributes to causes and tracks impact.
- **Volunteer:** Offers services and responds to orphanage requests.

### 📄 PDF Report Generation
- Admins can generate downloadable PDF reports summarizing key metrics.
- Includes:
  - **User Summary Report:** Role-based user stats with a pie chart.
  - **Orphanage Report:** Breakdown of verified vs. unverified orphanages.
  - **Orphan Statistics Report:** Age, education, and health distributions.
  - **Sponsorship Report:** Status overview, totals, and averages.
- **Chart Integration:** Visualized data using embedded charts.
- **Access Control:** Only admins can generate or view reports.

## ⚠️ Error Handling

The application uses structured `try-catch` blocks in controller logic to catch errors such as database issues or PDF generation failures. While middleware-based centralized error handling is not implemented, meaningful HTTP responses ensure clarity and prevent crashes.

2. External APIs📍🗺️📩:
      QuickChart API: This API is used to create and fetch chart images based on data, which are then included in the PDF reports generated for users.

      Axios: We use Axios to send HTTP requests to the QuickChart API to retrieve the chart images efficiently.

      SMTP Email Sending API: This API is used to send emails from the platform. It enables communication with users, such as sending notifications, email confirmations, and email alerts notify donors of high-priority needs.
Geocoding API: This API turns addresses into coordinates (latitude and longitude). It helps find where items are located so users can easily see where to pick them up.
Routing API: This API provides directions between two locations. It helps optimize delivery routes, making it quicker and easier for items to be delivered.
Google Maps API: This API provides mapping services. A link is created using delivery coordinates, allowing customers to view delivery locations on Google Maps for easy navigation.
    
Since the Geocoding and Routing APIs are paid services, we simulated them using the Here platform, allowing us to test location and routing features without extra costs.

---
External APIs 📝
📧 Nodemailer
Purpose: To handle automated email communication within the HopeConnect platform.
Usage: Nodemailer is used to send verification emails upon user registration, notify donors and sponsors of donation confirmations, and alert users to emergency relief campaigns or orphanage updates. This ensures reliable and timely communication between the system and its users, enhancing trust and engagement.



## 🔧 Tech Stack
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

--- -->
