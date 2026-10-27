import Assignment from '../models/Assignment.js';
import asyncHandler from '../utils/asyncHandler.js';

const sortDue = (a, b) => new Date(a.dueDate) - new Date(b.dueDate);
export const stats = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({ user: req.userId }).sort({ dueDate: 1 }).lean();
  const now = new Date();
  const incomplete = assignments.filter(a => a.status !== 'Completed');
  const overdue = incomplete.filter(a => new Date(a.dueDate) < now);
  const upcoming = incomplete.filter(a => new Date(a.dueDate) >= now).sort(sortDue);
  const dueSoon = upcoming.filter(a => new Date(a.dueDate) - now <= 86400000);
  const completed = assignments.filter(a => a.status === 'Completed');
  const serialize = (a) => ({ ...a, id: a._id, isOverdue: overdue.some(x => x._id.equals(a._id)), isDueSoon: dueSoon.some(x => x._id.equals(a._id)) });
  res.json({ success: true, stats: {
    total: assignments.length, pending: assignments.filter(a => a.status === 'Pending').length,
    inProgress: assignments.filter(a => a.status === 'In Progress').length, completed: completed.length,
    overdue: overdue.length, completionPercentage: assignments.length ? Math.round((completed.length / assignments.length) * 100) : 0,
    nearestUpcoming: upcoming[0] ? serialize(upcoming[0]) : null,
    upcoming: upcoming.slice(0, 5).map(serialize), highPriority: incomplete.filter(a => a.priority === 'High').sort(sortDue).slice(0, 5).map(serialize)
  }});
});
