import mongoose, { Schema } from "mongoose";



const userSchema = new Schema(
  {
    google_id: {
      type: String,
      index: true, // faster lookup
      sparse: true, // allows multiple null values
    },

    phone: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, "Invalid phone number"], // optional but good
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email format",
      ],
    },

    user_photo: {
      type: String,
      trim: true,
    },

    // Good for tracking user status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Good for role-based access in future
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    
     // STORE ONLY HASHED REFRESH TOKENS
    refreshTokens: [
      {
        token: { type: String },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

// Prevent duplicate key errors from crashing the app
userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]; // which field caused the error

    let message = "";

    if (field === "email") {
      message = "Email already exists. Try logging in.";
    } else if (field === "phone") {
      message = "Phone number already exists.";
    } else {
      message = `${field} already exists.`;
    }
    next(new Error(message));
  } else {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
