import { Suspense } from "react";
import { fetchCardData, fetchFilteredInvoices, fetchLatestInvoices, fetchRevenue, } from "../lib/data"
import CardWrapper, { Card } from "../ui/dashboard/cards";
import LatestInvoices from "../ui/dashboard/latest-invoices";
import RevenueChart from "../ui/dashboard/revenue-chart";
import { lusitana } from "../ui/fonts";
import { CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from "../ui/skeletons";

export default async function Dashboard() {
    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <Suspense fallback={<CardsSkeleton />}>
                <CardWrapper />
            </Suspense>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <LatestInvoices />
                </Suspense>
            </div>
        </main>
    );
}