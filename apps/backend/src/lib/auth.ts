import prisma from "@/db";
import CredentialsProvider  from "next-auth/providers/credentials"
import bcrypt from 'bcrypt';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const userDb = await prisma.user.findFirst({
            where:{
                email: credentials?.email
            },
         
        })

        if (
          userDb &&
          userDb.password &&
          credentials?.password &&
          await bcrypt.compare(credentials.password, userDb.password)
        ){
            return {
                ...userDb,
                id: userDb.id.toString()
            }
        }else{
            return null
        }
      },
    }),
  ],
};