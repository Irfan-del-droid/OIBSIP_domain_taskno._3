import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { ATMDashboard } from './components/ATMDashboard';

function AppContent() {
  const { account } = useAuth();

  if (!account) {
    return <Login />;
  }

  return <ATMDashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
