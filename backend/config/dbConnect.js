import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URI);
    //User.insertMany(users);
    //Post.insertMany(posts);

    console.log(`MongoDB Connected to ${conn.connection.host} ,biatch!`);
  } catch (error) {
    console.log(`${error.message}`);
    process.exit(1);
  }
};

export default dbConnect;
