import { BookOpen, CalendarDays, LayoutDashboard, LogOut, Menu, Plus, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AppLayout({ children }) {
  const { user, signOut } = useAuth(); const [open, setOpen] = useState(false); const navigate = useNavigate();
  const close = () => setOpen(false);
  const logout = async () => { try { await signOut(); navigate('/login'); } catch { navigate('/login'); } };
  return <div className="app-shell"><header className="mobile-bar"><button className="icon-button" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu/></button><span className="brand small"><BookOpen/> Deadline Zero</span><button className="icon-button" onClick={() => navigate('/assignments/new')} aria-label="New assignment"><Plus/></button></header>
    {open && <button className="scrim" onClick={close} aria-label="Close navigation"/>}
    <aside className={`sidebar ${open ? 'open' : ''}`}><div className="sidebar-top"><span className="brand"><BookOpen/> <span>Deadline <i>Zero</i></span></span><button className="icon-button close" onClick={close} aria-label="Close navigation"><X/></button></div><p className="sidebar-kicker">Academic ledger</p><nav><NavLink to="/dashboard" onClick={close}><LayoutDashboard/> Overview</NavLink><NavLink to="/assignments" onClick={close}><CalendarDays/> Assignments</NavLink></nav><button className="new-assignment" onClick={() => { close(); navigate('/assignments/new'); }}><Plus/> New assignment</button><div className="user-panel"><span className="monogram">{user?.name?.slice(0, 1).toUpperCase()}</span><div><strong>{user?.name}</strong><small>{user?.email}</small></div><button className="icon-button" onClick={logout} aria-label="Sign out"><LogOut/></button></div></aside><main>{children}</main></div>;
}
