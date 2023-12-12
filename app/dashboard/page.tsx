import { fetchRevenue } from "../lib/data"

export default async function Dashboard() {
    const revenue = await fetchRevenue()
    console.log(revenue)
    return <div>Dashboard</div>
}