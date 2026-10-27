export function StatusBadge({ status }) { return <span className={`badge status-${status.toLowerCase().replace(' ', '-')}`}>{status}</span>; }
export function PriorityBadge({ priority }) { return <span className={`badge priority-${priority.toLowerCase()}`}>{priority} priority</span>; }
export function DueBadge({ assignment }) { if (assignment.isOverdue) return <span className="badge due-overdue">Overdue</span>; if (assignment.isDueSoon) return <span className="badge due-soon">Due soon</span>; return null; }
