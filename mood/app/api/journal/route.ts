import { analyze } from "@/app/utils/ai"
import { getUserByClerkID } from "@/app/utils/auth"
import { prisma } from "@/app/utils/db"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export const POST = async () => {
    const user = await getUserByClerkID()
    const entry = await prisma.journalEntry.create({
        data: {
            userId: user.id,
            content: 'Write about your day!'
        }
    })

    const analysis = await analyze(entry.content)
    await prisma.analysis.create({
        data: {
            entryId: entry.id,
            ...analysis
        }
    })

    revalidatePath('/journal')

    return NextResponse.json({ data: entry })
}
