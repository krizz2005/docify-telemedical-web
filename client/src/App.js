import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import 'react-datepicker/dist/react-datepicker.css';
import './index.css'; // Or './App.css' if you renamed it

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
