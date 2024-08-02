import {z} from "zod";
import bcrypt from "bcryptjs";
import {getUser} from "@/queries/user";
import {AccessDenied, CredentialsSignin} from "@auth/core/errors";



export async function checkCredential(formData: FormData) {

    const parsedCredentials = z
        .object({email: z.string().email(), password: z.string().min(6)})
        .safeParse({email: formData.get('email'), password: formData.get('password')});

    if (parsedCredentials.success) {
        const {email, password} = parsedCredentials.data;
        const user = await getUser(email);

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password as string);

        if (passwordsMatch) {
            return user;
        } else {
            throw new AccessDenied("Invalid credentials");
        }
    }


    return null;
}