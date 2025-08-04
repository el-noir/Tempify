import mongoose, {Schema, Document} from 'mongoose'

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    resetPasswordToken?: string | null;
    resetPasswordExpiry?: Date | null;
    role: 'user' | 'admin';
    isActive: boolean;
}

const UserSchema : Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[\w.-]+@[\w.-]+\.\w{2,}$/, 'please use a valid email']
    },
    password: {
     type: String,
    required: [true, "Password is required"],
    },

           verifyCode: {
        type: String,
        required: [true, "Verify code is required"]
    },
      verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code Expiry is required"]
    },
        isVerified: {
        type: Boolean,
        default: false 
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpiry: {
        type: Date
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    isActive: {
        type: Boolean,
        default: true
    },

}, {
    timestamps: true,
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) ||
mongoose.model<User>("User", UserSchema)

export default UserModel