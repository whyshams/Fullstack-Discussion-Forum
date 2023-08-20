import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 6,
    },
    username: {
      type: String,
      required: true,
      min: 5,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      min: 7,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    profileImage: {
      type: String,
      default: "",
    },

    role: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPass = async function (mainPassword) {
  return await bcrypt.compare(mainPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
