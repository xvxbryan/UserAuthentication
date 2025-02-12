import { cookies } from "next/headers";

export default async function Dashboard() {
    try {
        const cookie = (await cookies()).get("session");
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/Auth/dashboard`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cookie?.value}`
                },
                cache: "no-store",
            }
        );
        if (res.ok) {
            const data = await res.json();
            console.log("Dashboard Data:", data);
        } else {
            throw new Error('Unauthorized');
        }
    } catch (error) {
        console.log("Error: ", error);
    }

    return <div>Dashboard</div>;
}