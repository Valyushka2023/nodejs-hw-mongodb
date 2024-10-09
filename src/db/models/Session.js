import { Schema, model } from "mongoose";
import { handleSaveErrror, setUpdateOptions} from "./hooks.js";


const sessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  accessTokenValidUntil: {
    type: Date,
    required: true,
  },
  refreshTokenValidUntil: {
    type: Date,
    required: true,
  },
},
{ versionKey: false, timestamps: true });

sessionSchema .post("save", handleSaveErrror);

sessionSchema .pre("findOneAndUpdate", setUpdateOptions);

sessionSchema .post("findOneAndUpdate", handleSaveErrror);

const SessionCollection = model('session', sessionSchema);

export default SessionCollection;
