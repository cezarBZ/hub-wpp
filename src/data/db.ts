import mongoose from "mongoose";

export async function connectMongo() {
  await mongoose.connect("mongodb://localhost:27017/whatsappbot");
  console.log("✅ Mongo conectado!");
}
