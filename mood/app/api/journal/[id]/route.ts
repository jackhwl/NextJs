import { getUserByClerkID } from "@/app/utils/auth"
import { prisma } from "@/app/utils/db"
import { NextResponse } from "next/server"
import { analyze } from "@/app/utils/ai"

export const PATCH = async (request: Request, { params }) => {
    const {content} = await request.json()
    const user = await getUserByClerkID()
    const updatedEntry = await prisma.journalEntry.update({
        where: {
            userId_id: {
                userId: user.id,
                id: params.id
            }
        },
        data: {
            content
        }
    })

    const analysis = await analyze(updatedEntry.content)

    await prisma.analysis.upsert({
        where: {
            entryId: updatedEntry.id
        },
        create: {
            entryId: updatedEntry.id,
            ...analysis
        },
        update: analysis

    })

    return NextResponse.json({ data: updatedEntry })
}