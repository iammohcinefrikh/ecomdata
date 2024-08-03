import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/userModel";
import hashPassword from "@/lib/utils/hashPasswordUtil";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { userFirstName, userLastName, userEmail, userPassword } = await request.json();

    const existingUser = await User.findOne({ userEmail });
    
    if (existingUser) {
      return NextResponse.json({
        statusCode: 400,
        error: "Bad Request",
        message: "Il existe déjà un compte avec cet email"
      }, { status: 400 });
    }

    const hashedPassword = hashPassword(userPassword);

    const newUser = new User({
      userFirstName,
      userLastName,
      userEmail,
      userPassword: hashedPassword
    });

    await newUser.save();

    return NextResponse.json({
      statusCode: 201,
      success: "Created",
      message: "Utilisateur enregistré avec succès"
    }, { status: 201 });
  } 
  
  catch (error) {
    return NextResponse.json({
      statusCode: 500,
      error: "Internal Server Error",
      message: "Erreur d'enregistrement de l'utilisateur"
    }, { status: 500 });
  }
}