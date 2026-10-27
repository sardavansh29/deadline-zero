import { useState } from 'react';
import { inputDate } from '../utils/date';
import { ErrorMessage } from './Feedback';

const initial = { title: '', subject: '', description: '', dueDate: '', dueTime: '', priority: 'Medium', status: 'Pending' };
export default function AssignmentForm({ assignment, onSubmit, saving, apiError }) {
  const [values, setValues] = useState(() => {
    if (!assignment) return initial;
    const [dueDate, dueTime] = inputDate(assignment.dueDate).split('T');
    return { ...assignment, dueDate, dueTime };
  }); const [errors, setErrors] = useState({});
  const change = event => { const { name, value } = event.target; setValues(current => ({ ...current, [name]: value })); setErrors(current => ({ ...current, [name]: undefined })); };
  const submit = async event => { event.preventDefault(); const next = {}; if (!values.title.trim()) next.title = 'A title is required.'; if (!values.subject.trim()) next.subject = 'A subject is required.'; if (!values.dueDate) next.dueDate = 'A due date is required.'; if (!values.dueTime) next.dueTime = 'A due time is required.'; setErrors(next); if (!Object.keys(next).length) { const { dueTime, ...payload } = values; await onSubmit({ ...payload, dueDate: `${values.dueDate}T${dueTime}` }, setErrors); } };
  const field = (name, label, element) => <label className={errors[name] ? 'invalid' : ''}><span>{label}</span>{element}{errors[name] && <small className="field-error">{errors[name]}</small>}</label>;
  return <form className="assignment-form paper" onSubmit={submit} noValidate>{apiError && <ErrorMessage>{apiError}</ErrorMessage>}<div className="form-grid">{field('title', 'Title', <input name="title" value={values.title} onChange={change} maxLength="160" autoFocus placeholder="e.g. Database systems report"/>)}{field('subject', 'Subject', <input name="subject" value={values.subject} onChange={change} maxLength="100" placeholder="e.g. Computer Science"/>)}{field('dueDate', 'Due date', <input type="date" name="dueDate" value={values.dueDate} onChange={change}/>)}{field('dueTime', 'Due time', <input type="time" name="dueTime" value={values.dueTime} onChange={change}/>)}{field('priority', 'Priority', <select name="priority" value={values.priority} onChange={change}><option>Low</option><option>Medium</option><option>High</option></select>)}{field('status', 'Status', <select name="status" value={values.status} onChange={change}><option>Pending</option><option>In Progress</option><option>Completed</option></select>)}</div>{field('description', 'Notes (optional)', <textarea name="description" value={values.description} onChange={change} maxLength="4000" rows="6" placeholder="Brief, useful context for your future self…"/>)}<div className="form-actions"><button className="button primary" disabled={saving}>{saving ? 'Saving…' : assignment ? 'Save changes' : 'Add to ledger'}</button></div></form>;
}
