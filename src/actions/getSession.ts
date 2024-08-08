import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

export default async function getSession (){
    return await getServerSession(authOptions);
}


