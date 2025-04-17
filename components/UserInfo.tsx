import { auth } from "../auth"

export default async function UserInfo() {
    const session = await auth()

    if (!session?.user) return null

    return (
        <div>
             <h1>userId: {JSON.stringify(session)}</h1>
        </div>
    )
}