# OIBSIP_Web_Development_3 - ATM Interface Application

A modern, full-featured ATM interface application built with React, TypeScript, and Supabase. This project demonstrates a complete banking system with user authentication, balance management, and transaction processing capabilities.

## Objective

Develop a web-based ATM interface that replicates traditional ATM functionalities, allowing users to:
- Authenticate with User ID and PIN
- View transaction history
- Withdraw cash from their account
- Deposit cash to their account
- Transfer funds to other accounts
- Monitor real-time balance updates

## Technologies Used

### Frontend
- **React 18.3** - UI framework with hooks
- **TypeScript 5.5** - Type-safe development
- **Tailwind CSS 3.4** - Utility-first styling
- **Lucide React** - Icon library
- **Vite 5.4** - Modern build tool

### Backend & Database
- **Supabase** - PostgreSQL database with RLS
- **@supabase/supabase-js** - Database client library

### Development Tools
- **ESLint** - Code quality
- **PostCSS** - CSS processing
- **Autoprefixer** - Browser compatibility

## Project Structure

```
src/
├── components/
│   ├── ATMDashboard.tsx      # Main dashboard with menu
│   ├── Login.tsx              # Authentication component
│   ├── TransactionHistory.tsx # View past transactions
│   ├── Withdraw.tsx           # Withdrawal operations
│   ├── Deposit.tsx            # Deposit operations
│   └── Transfer.tsx           # Fund transfer operations
├── contexts/
│   └── AuthContext.tsx        # Global authentication state
├── lib/
│   └── supabase.ts            # Database client & types
├── App.tsx                    # Root component
├── main.tsx                   # Application entry point
└── index.css                  # Global styles

supabase/
└── migrations/
    └── create_atm_schema.sql  # Database schema
```

## Database Schema

### Accounts Table
- **id** (uuid) - Primary key
- **user_id** (text) - Unique user identifier
- **pin** (text) - User PIN (encrypted in production)
- **account_holder_name** (text) - Account owner name
- **balance** (numeric) - Current account balance
- **created_at** (timestamptz) - Account creation timestamp
- **updated_at** (timestamptz) - Last update timestamp

### Transactions Table
- **id** (uuid) - Primary key
- **account_id** (uuid) - Foreign key to accounts
- **transaction_type** (text) - Type: withdraw, deposit, transfer_out, transfer_in
- **amount** (numeric) - Transaction amount
- **recipient_id** (text) - For transfers (optional)
- **balance_after** (numeric) - Balance after transaction
- **description** (text) - Transaction description
- **created_at** (timestamptz) - Transaction timestamp

## Key Features

### 1. Authentication
- User ID and PIN-based login
- Secure session management using React Context
- Demo accounts pre-loaded for testing

### 2. Dashboard Menu
- Central hub for all banking operations
- Real-time balance display
- Quick access to all features

### 3. Transaction History
- Complete audit trail of all transactions
- Sorted by most recent first
- Shows transaction type, amount, and balance after each transaction

### 4. Cash Withdrawal
- Flexible amount entry
- Quick amount buttons ($20, $50, $100, $200)
- Balance validation before processing
- Automatic balance update with transaction logging

### 5. Cash Deposit
- Flexible amount entry
- Quick amount buttons ($50, $100, $500, $1000)
- Instant credit to account
- Complete transaction record

### 6. Fund Transfer
- Transfer between accounts using recipient User ID
- Recipient validation
- Dual transaction logging (sender and recipient)
- Error handling for invalid recipients or insufficient balance

## Security Features

- Row Level Security (RLS) enabled on all tables
- PIN-based authentication
- Transaction validation and balance checks
- Insufficient balance prevention
- Self-transfer prevention in fund transfers
- Complete audit trail for all transactions

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Supabase account with PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

## Demo Accounts

Three test accounts are pre-loaded in the database:

| User ID | PIN | Initial Balance |
|---------|-----|-----------------|
| user001 | 1234 | $5,000.00 |
| user002 | 5678 | $3,000.00 |
| user003 | 9999 | $10,000.00 |

## Workflow

### User Authentication
1. User enters User ID and PIN on login screen
2. System validates credentials against database
3. On successful authentication, user is logged in and dashboard appears

### Main Dashboard
1. User sees their account holder name and current balance
2. Menu displays five options: Transaction History, Withdraw, Deposit, Transfer
3. User can also logout from the dashboard

### Transaction Operations
All transaction operations follow this pattern:
1. User enters transaction details
2. System validates input and account balance
3. Balance is updated in database
4. Transaction record is created for audit trail
5. Success/error feedback is displayed to user

## Steps Performed

### 1. Database Design & Migration
- Created PostgreSQL schema with `accounts` and `transactions` tables
- Set up foreign key relationships and constraints
- Implemented Row Level Security policies
- Created database indexes for performance
- Pre-loaded demo data for testing

### 2. Frontend Architecture
- Established component-based architecture with single responsibility principle
- Created authentication context for global state management
- Built responsive UI components with Tailwind CSS
- Implemented proper TypeScript typing throughout

### 3. Feature Implementation
- Developed login component with validation and error handling
- Built main dashboard with menu navigation
- Implemented transaction history viewer with sorting
- Created withdrawal feature with quick amount buttons
- Created deposit feature with flexible amounts
- Built transfer feature with recipient validation
- Added real-time balance updates

### 4. Testing & Quality Assurance
- Validated all CRUD operations on database
- Tested authentication flow with demo accounts
- Verified balance calculations and constraints
- Tested transfer operations between accounts
- Confirmed transaction history accuracy
- Project builds successfully with no TypeScript errors

## Outcome

A fully functional, production-ready ATM interface that:
- Successfully authenticates users with credentials
- Manages account balances with precision
- Processes all transaction types (withdraw, deposit, transfer)
- Maintains complete transaction audit trails
- Provides intuitive user interface with real-time feedback
- Implements security best practices with RLS policies
- Scales efficiently with database indexing

The application is deployment-ready and includes comprehensive error handling, validation, and user feedback for all operations.

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run typecheck    # Type check with TypeScript
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Email notifications for transactions
- Multi-factor authentication
- PIN reset/recovery flow
- Account statement exports
- Transaction filtering and search
- Dark mode theme
- Mobile app version
