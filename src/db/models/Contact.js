import { Schema, model } from "mongoose";
import { handleSaveErrror, setUpdateOptions} from "./hooks.js";

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    isFavourite: {
        type: Boolean,
        default: false,
    },
    contactType: {
        type: String,
        enum: ["work", "home", "personal"],
        required: true,
        default: "personal",
    },

       userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
       photo: {
        type: String,
    },
},
    { versionKey: false, timestamps: true });

contactSchema.post("save", handleSaveErrror);

contactSchema.pre("findOneAndUpdate", setUpdateOptions);

contactSchema.post("findOneAndUpdate", handleSaveErrror);

const ContactCollection = model('contacts', contactSchema);

export default ContactCollection;
