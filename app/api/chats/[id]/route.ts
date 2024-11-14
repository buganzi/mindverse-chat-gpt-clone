import { auth } from "@/auth";
import {getChatById} from "@/db/queries";
import {NextApiRequest} from "next";

export async function GET( request: NextApiRequest, { params }: { params: { id: string } }) {
    const session = await auth();

    if (!session || !session.user) {
        return Response.json("Unauthorized!", { status: 401 });
    }

    const {id} = params;

    const chats = await getChatById({ id: id as string });
    if (!chats) {
        return Response.json([]);
    }
    return Response.json([chats]);
}
