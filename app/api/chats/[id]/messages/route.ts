import { auth } from "@/auth";
import { getMessagesByChatId} from "@/db/queries";
import {NextApiRequest} from "next";

export async function GET( request: NextApiRequest, { params }: { params: { id: string } }) {
    const session = await auth();

    if (!session || !session.user) {
        return Response.json("Unauthorized!", { status: 401 });
    }

    const {id} = params;

    const messages = await getMessagesByChatId({ id: id as string });
    if (!messages) {
        return Response.json([]);
    }
    return Response.json(messages);
}
