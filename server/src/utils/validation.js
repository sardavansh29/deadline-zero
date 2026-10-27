import AppError from './AppError.js';

const statuses = ['Pending', 'In Progress', 'Completed'];
const priorities = ['Low', 'Medium', 'High'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(input) {
  const name = String(input.name || '').trim();
  const email = String(input.email || '').trim().toLowerCase();
  const password = String(input.password || '');
  const errors = {};
  if (name.length < 2 || name.length > 80) errors.name = 'Name must be between 2 and 80 characters.';
  if (!emailPattern.test(email)) errors.email = 'Enter a valid email address.';
  if (password.length < 8 || password.length > 128) errors.password = 'Password must be 8–128 characters.';
  if (Object.keys(errors).length) throw new AppError('Please correct the highlighted fields.', 400, errors);
  return { name, email, password };
}

export function validateLogin(input) {
  const email = String(input.email || '').trim().toLowerCase();
  const password = String(input.password || '');
  if (!emailPattern.test(email) || !password) throw new AppError('Enter your email and password.', 400);
  return { email, password };
}

export function validateAssignment(input, partial = false) {
  const errors = {};
  const value = {};
  for (const field of ['title', 'subject']) {
    if (!partial || field in input) {
      const cleaned = String(input[field] || '').trim();
      if (!cleaned || cleaned.length > (field === 'title' ? 160 : 100)) errors[field] = `${field === 'title' ? 'Title' : 'Subject'} is required and is too long if over the limit.`;
      else value[field] = cleaned;
    }
  }
  if (!partial || 'description' in input) {
    value.description = String(input.description || '').trim();
    if (value.description.length > 4000) errors.description = 'Description must be 4,000 characters or fewer.';
  }
  if (!partial || 'dueDate' in input) {
    const dueDate = new Date(input.dueDate);
    if (!input.dueDate || Number.isNaN(dueDate.getTime())) errors.dueDate = 'Choose a valid due date and time.';
    else value.dueDate = dueDate;
  }
  for (const [field, allowed] of [['priority', priorities], ['status', statuses]]) {
    if (!partial || field in input) {
      if (!allowed.includes(input[field])) errors[field] = `Choose a valid ${field}.`;
      else value[field] = input[field];
    }
  }
  if (Object.keys(errors).length) throw new AppError('Please correct the highlighted fields.', 400, errors);
  return value;
}

export { statuses, priorities };
