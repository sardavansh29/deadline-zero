import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function PageHeader({ label, title, description, action = true }) { return <header className="page-header"><div><p className="eyebrow">{label}</p><h1>{title}</h1><p className="subtitle">{description}</p></div>{action && <Link className="button primary" to="/assignments/new"><Plus/> New assignment</Link>}</header>; }
