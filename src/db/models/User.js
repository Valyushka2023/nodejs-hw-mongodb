import { Schema, model } from "mongoose";
import { emailRegexp } from "../../constants/users.js";


const usersSchema = new Schema(
  {
    name: {
        type: String,
        required: true
    },
     email: {
        type: String,
        unique: true,
        match: emailRegexp,
        required: true
    },
     password: {
        type: String,
        required: true
    },
  },
  { versionKey: false, timestamps: true },
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model("users", usersSchema);
