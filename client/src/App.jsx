import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import { LoadingState } from './components/Feedback';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AssignmentsPage from './pages/AssignmentsPage';
import AssignmentEditorPage from './pages/AssignmentEditorPage';
import AssignmentDetailsPage from './pages/AssignmentDetailsPage';

function Protected({ children }) { const { user, loading } = useAuth(); const location = useLocation(); if (loading) return <LoadingState/>; return user ? <AppLayout>{children}</AppLayout> : <Navigate to="/login" state={{ from: location }} replace/>; }
export default function App() { return <Routes><Route path="/login" element={<AuthPage mode="login"/>}/><Route path="/register" element={<AuthPage mode="register"/>}/><Route path="/dashboard" element={<Protected><DashboardPage/></Protected>}/><Route path="/assignments" element={<Protected><AssignmentsPage/></Protected>}/><Route path="/assignments/new" element={<Protected><AssignmentEditorPage/></Protected>}/><Route path="/assignments/:id" element={<Protected><AssignmentDetailsPage/></Protected>}/><Route path="/assignments/:id/edit" element={<Protected><AssignmentEditorPage editing/></Protected>}/><Route path="*" element={<Navigate to="/dashboard" replace/>}/></Routes>; }
