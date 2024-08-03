import mongoose, { Document } from "mongoose";

interface IUser extends Document {
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userPassword: string;
}

const userSchema = new mongoose.Schema<IUser>({
  userFirstName: {
    type: String,
    required: true
  },
  userLastName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    unique: true,
    required: true
  },
  userPassword: {
    type: String,
    required: true
  }
}, { collection: "user" });

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;