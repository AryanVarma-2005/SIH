# 🏛️ CivicConnect - Civic Complaint Management Platform

A comprehensive web application for managing civic complaints, connecting citizens with their local government through an intuitive digital platform.

![CivicConnect Platform](https://img.shields.io/badge/Status-Active-green)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-blue)

## 🌟 Features

### For Citizens
- **Department-Based Reporting**: Submit complaints across 6 key departments (Transportation, Education, Health, Environment, Infrastructure, Utilities)
- **Photo Capture**: Real-time camera integration for documenting issues
- **Location Services**: GPS-based location capture and nearby complaint viewing
- **Credit System**: Earn credits for quality complaints, lose credits for fake reports
- **Real-Time Tracking**: Monitor complaint status from submission to resolution
- **Community Awareness**: View nearby complaints and local civic activity

### For Administrators
- **Comprehensive Dashboard**: Manage all complaints with advanced filtering
- **Quality Rating System**: Rate complaint quality and award/deduct credits
- **Department Analytics**: Track performance across all city departments
- **Status Management**: Update complaint status and assign to staff
- **Statistical Overview**: Monitor resolution rates and citizen engagement

### Technical Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Role-Based Authentication**: Separate portals for citizens and administrators
- **Real-Time Updates**: Live status tracking and notifications
- **File Upload Support**: Photo, voice, and document attachments
- **Location Integration**: GPS coordinates and address mapping
- **Progressive Web App**: Installable on mobile devices

## 🚀 Live Demo

Visit the live application: [https://civicconnect-civic-c-o4ga.bolt.host](https://civicconnect-civic-c-o4ga.bolt.host)

### Demo Credentials
- **Citizen Portal**: Use any email/password combination
- **Admin Portal**: Use any email/password combination

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Build Tool**: Vite
- **Deployment**: Bolt Hosting

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/civicconnect-platform.git
cd civicconnect-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx
│   ├── LoadingSpinner.tsx
│   ├── PhotoCapture.tsx
│   ├── NearbyComplaints.tsx
│   └── CreditSystem.tsx
├── contexts/           # React Context providers
│   ├── AuthContext.tsx
│   └── ComplaintContext.tsx
├── data/              # Static data and configurations
│   └── departments.ts
├── pages/             # Main application pages
│   ├── LandingPage.tsx
│   ├── CitizenLogin.tsx
│   ├── AdminLogin.tsx
│   ├── UserDashboard.tsx
│   ├── ComplaintForm.tsx
│   └── AdminDashboard.tsx
├── types/             # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## 🎯 Key Components

### Authentication System
- Dual authentication portals for citizens and administrators
- Role-based access control and route protection
- Mock authentication for demo purposes

### Complaint Management
- Comprehensive complaint form with media upload
- Real-time status tracking and updates
- Department categorization and priority levels

### Credit System
- Quality-based credit awards (+50 excellent, +25 good, -100 fake)
- Citizen level progression (New → Bronze → Silver → Gold)
- Admin quality rating interface

### Location Services
- GPS-based location capture
- Nearby complaints within configurable radius
- Address geocoding and mapping

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_APP_NAME=CivicConnect
VITE_API_URL=your_api_endpoint
VITE_MAPS_API_KEY=your_maps_api_key
```

### Customization
- **Departments**: Modify `src/data/departments.ts` to add/remove departments
- **Colors**: Update Tailwind configuration in `tailwind.config.js`
- **Branding**: Replace logos and update brand colors in components

## 📱 Mobile Features

- **Camera Integration**: Native camera access for photo capture
- **GPS Location**: Automatic location detection and manual entry
- **Responsive Design**: Optimized layouts for all screen sizes
- **Touch Interactions**: Mobile-friendly buttons and gestures

## 🔒 Security Features

- **Role-Based Access**: Separate authentication for citizens and admins
- **Input Validation**: Form validation and sanitization
- **File Upload Security**: Type and size restrictions on uploads
- **Route Protection**: Authenticated routes with role verification

## 🚀 Deployment

The application is configured for deployment on various platforms:

- **Bolt Hosting**: Direct deployment from development environment
- **Netlify**: Static site deployment with form handling
- **Vercel**: Serverless deployment with API routes
- **GitHub Pages**: Static hosting for demo purposes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Lucide React** for beautiful icons
- **Tailwind CSS** for utility-first styling
- **React Router** for seamless navigation
- **Vite** for fast development experience

## 📞 Support

For support, email support@civicconnect.com or create an issue in this repository.

---

**Built with ❤️ for better civic engagement**