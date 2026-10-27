import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, immutable: true },
  title: { type: String, required: true, trim: true, minlength: 1, maxlength: 160 },
  description: { type: String, trim: true, maxlength: 4000, default: '' },
  subject: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
  dueDate: { type: Date, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }
}, { timestamps: true });

assignmentSchema.index({ user: 1, dueDate: 1 });
assignmentSchema.index({ user: 1, status: 1, priority: 1 });
export default mongoose.model('Assignment', assignmentSchema);
