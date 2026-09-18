import mongoose from 'mongoose';

const appDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const AppData = mongoose.model('AppData', appDataSchema);
export default AppData;
