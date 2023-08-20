import mongoose from "mongoose";

const userIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

export const users = [
  {
    _id: userIds[1],
    name: "Arekta naam",
    email: "aaaaa@gmail.com",
    username: "arektanaam",
    password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    picturePath: "p11.jpeg",

    createdAt: 1115211422,
    updatedAt: 1115211422,
    __v: 0,
  },
];

export const posts = [
  {
    _id: new mongoose.Types.ObjectId(),
    userId: "64ce9824f7e3c46c70d0a27a",
    name: "Arekta Naam",

    description: "Arekta postssssssssss",
    picturePath: "p11.jpeg",
    userPicturePath: "p11.jpeg",
    likes: new Map([["64ce9824f7e3c46c70d0a27a", true]]),
    comments: [
      "random comment",
      "another random comment",
      "yet another random comment",
    ],
  },
];
