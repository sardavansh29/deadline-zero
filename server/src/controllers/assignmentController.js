import Assignment from '../models/Assignment.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { priorities, statuses, validateAssignment } from '../utils/validation.js';

const allowedSorts = { dueDate: { dueDate: 1, createdAt: -1 }, newest: { createdAt: -1 }, oldest: { createdAt: 1 }, title: { title: 1 } };
function serialize(a) {
  const item = a.toObject ? a.toObject() : a;
  const now = new Date(); const due = new Date(item.dueDate);
  return { ...item, id: item._id, isOverdue: item.status !== 'Completed' && due < now, isDueSoon: item.status !== 'Completed' && due >= now && due.getTime() - now.getTime() <= 86400000 };
}

export const list = asyncHandler(async (req, res) => {
  const { search = '', status, priority, subject, sort = 'dueDate' } = req.query;
  const query = { user: req.userId };
  const searchTerm = typeof search === 'string' ? search.trim().slice(0, 160) : '';
  const subjectTerm = typeof subject === 'string' ? subject.trim().slice(0, 100) : '';
  if (status && statuses.includes(status)) query.status = status;
  if (priority && priorities.includes(priority)) query.priority = priority;
  if (subjectTerm) query.subject = subjectTerm;
  if (searchTerm) query.$or = [{ title: { $regex: searchTerm, $options: 'i' } }, { subject: { $regex: searchTerm, $options: 'i' } }, { description: { $regex: searchTerm, $options: 'i' } }];
  const [assignments, subjects] = await Promise.all([
    Assignment.find(query).sort(allowedSorts[sort] || allowedSorts.dueDate).lean(),
    Assignment.distinct('subject', { user: req.userId })
  ]);
  const now = new Date();
  // Surface unfinished overdue work before chronological upcoming deadlines.
  assignments.sort((a, b) => {
    const aLate = a.status !== 'Completed' && new Date(a.dueDate) < now;
    const bLate = b.status !== 'Completed' && new Date(b.dueDate) < now;
    if (sort === 'dueDate' && aLate !== bLate) return aLate ? -1 : 1;
    return 0;
  });
  res.json({ success: true, assignments: assignments.map(serialize), subjects: subjects.sort() });
});

export const getOne = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findOne({ _id: req.params.id, user: req.userId });
  if (!assignment) throw new AppError('Assignment not found.', 404);
  res.json({ success: true, assignment: serialize(assignment) });
});

export const create = asyncHandler(async (req, res) => {
  const assignment = await Assignment.create({ ...validateAssignment(req.body), user: req.userId });
  res.status(201).json({ success: true, assignment: serialize(assignment) });
});

export const update = asyncHandler(async (req, res) => {
  const values = validateAssignment(req.body, true);
  if (!Object.keys(values).length) throw new AppError('Include at least one field to update.', 400);
  const assignment = await Assignment.findOneAndUpdate({ _id: req.params.id, user: req.userId }, values, { new: true, runValidators: true });
  if (!assignment) throw new AppError('Assignment not found.', 404);
  res.json({ success: true, assignment: serialize(assignment) });
});

export const remove = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!assignment) throw new AppError('Assignment not found.', 404);
  res.json({ success: true, message: 'Assignment removed.' });
});
