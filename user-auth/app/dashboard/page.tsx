export default async function Dashboard() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/Auth/dashboard`,
            {
                cache: "no-store",
                credentials: "include"
            }
        );
        console.log(res);
    } catch (error) {
        console.log("Error: ", error);
    }

    return <div>Dashboard</div>;
}
