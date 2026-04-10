import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs"; 
import { z } from "zod";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("[AUTH DEBUG] AUTHORIZE CALLED AT", new Date().toISOString());
        console.log("[AUTH DEBUG] CREDENTIALS RECEIVED:", credentials);
        
        const parsedCredentials = z
          .object({ phone: z.string().min(10), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { phone: rawPhone, password } = parsedCredentials.data;
          let phone = rawPhone.replace(/\D/g, ""); // NORMALIZE to numbers only
          
          // HANDLE Russian prefix 8 -> 7
          if (phone.length === 11 && phone.startsWith("8")) {
            phone = "7" + phone.substring(1);
          }


          console.log("[AUTH DEBUG] TRYING PHONE:", phone);
          
          const user = await db.user.findFirst({ 
            where: { phone } 
          });
          
          if (!user) {
            console.error("[AUTH DEBUG] USER NOT FOUND:", phone);
            return null;
          }
          
          const passwordsMatch = await bcrypt.compare(password, user.password || "");

          if (passwordsMatch) {
            console.log("[AUTH DEBUG] LOGIN SUCCESS:", user.fullName);
            return { id: user.id, name: user.fullName, role: user.role, branchId: user.branchId };
          } else {
            console.error("[AUTH DEBUG] PASSWORD MISMATCH FOR:", phone);
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).branchId = token.branchId;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      
      if (!token.sub) return token;
      
      try {
        const dbUser = await db.user.findUnique({ 
          where: { id: token.sub as string },
          select: { role: true, branchId: true }
        });
        
        if (dbUser) {
          token.role = dbUser.role;
          token.branchId = dbUser.branchId;
        }
      } catch (error) {
        console.error("JWT sync error:", error);
      }
      
      return token;
    },
  },
  cookies: {
    sessionToken: {
      name: `authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false, // FORCE FALSE FOR LOCAL IP DEV
      },
    },
  },
});

