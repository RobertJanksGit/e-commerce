# Modern E-Commerce Platform

A sleek and modern e-commerce platform built with React, TypeScript, and Firebase, featuring real-time product updates and a seamless shopping experience.

## 🌟 Features

### User Experience

- **Smart Search**: Real-time product search with auto-suggestions
- **Dynamic Filtering**: Filter products by category, price range, and more
- **Responsive Design**: Seamless experience across all devices
- **Intuitive Cart**: Easy-to-use shopping cart with quantity management

### Authentication & Security

- Secure user authentication with Firebase
- Protected routes for authenticated users
- Password reset functionality
- Secure checkout process

### Product Management

- Real-time product updates from Fake Store API
- Detailed product views with images, descriptions, and ratings
- Price filtering and sorting options
- Category-based browsing

### Shopping Cart

- Real-time cart updates
- Quantity adjustment
- Total price calculation
- Persistent cart data

## 🛠️ Technical Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Material-UI (MUI)
- **State Management**: React Context
- **Backend & Auth**: Firebase
- **Database**: Firestore
- **API Integration**: Fake Store API
- **Routing**: React Router
- **Build Tool**: Vite

## 🚀 Performance

- Optimized bundle size
- Lazy loading of components
- Efficient state management
- Debounced search functionality
- Responsive image loading

## 💡 Smart Features

- **Intelligent Search**: Search by product name, category, or description
- **Price Range Slider**: Dynamic price filtering with real-time updates
- **Sort Options**:
  - Price (Low to High)
  - Price (High to Low)
  - Best Rating
- **Category Navigation**: Easy browsing by product categories

## 🔒 Security Features

- Secure authentication flow
- Protected API endpoints
- Firestore security rules
- Environment variable protection

## 🎯 Future Enhancements

- Payment gateway integration
- User profiles and order history
- Wishlist functionality
- Product reviews and ratings
- Advanced search filters
- Order tracking
- Admin dashboard

## 🌐 Live Demo

Visit the live site: [https://e-commerce-766ef.web.app](https://e-commerce-766ef.web.app)

## 📱 Mobile Responsive

The application is fully responsive and provides an optimal experience across:

- Desktop computers
- Tablets
- Mobile phones

## 🔒 Security Setup

1. **Environment Variables**:

   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration values
   - Never commit the `.env` file
   - Keep your Firebase API keys private

2. **Firebase Security**:

   - Enable Email/Password authentication in Firebase Console
   - Deploy Firestore security rules using `firebase deploy --only firestore:rules`
   - Set up appropriate Firebase project settings and restrictions

3. **Data Protection**:
   - User profiles are protected by Firebase Authentication
   - Each user can only access their own data
   - Orders are immutable once created
   - Addresses are encrypted in transit

## ⚡ Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your Firebase configuration
4. Set up Firebase:
   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Deploy Firestore rules
5. Run development server: `npm run dev`
6. Build for production: `npm run build`
7. Deploy: `firebase deploy`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
