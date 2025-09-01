import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from 'bcrypt';
import prisma from "@/db";

export  async function POST(req: NextRequest){


    const data  = await req.json();

    if(!data.email || !data.password || !data.firstName || !data.lastName){
        return NextResponse.json({
            message: "Please fill all the fields before signing up.."
        }, {status:400})
    }
    const schema = z.object({
        email: z.email(),
        password: z.string().min(3).max(20),
        firstName: z.string(),
        lastName: z.string()
    });

    const SafeData = schema.safeParse(data);

     if (!SafeData.success) {
       return NextResponse.json(
         {
           message: SafeData.error.issues[0].message,
         },
         { status: 500 }
       );
     }


    const hashedPassword = await bcrypt.hash(data.password,10)

    try {
        await prisma.user.create({
            data:{
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName

            }
        });

        return NextResponse.json({
            message: "User created successfully!"
        }, {status:201});

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error: "Internal Server Error"
        }, {status:500})
    }

    
}