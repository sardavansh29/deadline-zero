import { ArrowRight, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DueBadge, PriorityBadge, StatusBadge } from './Badges';
import { formatDate, relativeDue } from '../utils/date';

export default function AssignmentList({ assignments, onDelete, compact = false }) {
  return <div className="assignment-list">{assignments.map((assignment, index) => <article className="assignment-row" key={assignment.id}><span className="row-number">{String(index + 1).padStart(2, '0')}</span><div className="assignment-main"><div className="assignment-title"><Link to={`/assignments/${assignment.id}`}>{assignment.title}</Link><DueBadge assignment={assignment}/></div><p>{assignment.subject} <span>·</span> {formatDate(assignment.dueDate)}</p></div><div className="assignment-meta"><PriorityBadge priority={assignment.priority}/><StatusBadge status={assignment.status}/><span className={`relative-due ${assignment.isOverdue ? 'late' : assignment.isDueSoon ? 'soon' : ''}`}>{relativeDue(assignment.dueDate)}</span></div>{!compact && <div className="row-actions"><Link className="icon-button" to={`/assignments/${assignment.id}/edit`} aria-label={`Edit ${assignment.title}`}><Pencil/></Link><button className="icon-button danger" onClick={() => onDelete(assignment)} aria-label={`Delete ${assignment.title}`}><Trash2/></button></div>} {compact && <Link className="icon-button arrow" to={`/assignments/${assignment.id}`} aria-label={`View ${assignment.title}`}><ArrowRight/></Link>}</article>)}</div>;
}
