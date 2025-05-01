import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  createBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const ProjectDb = mongoose.model('Project', projectSchema);
export default ProjectDb;
