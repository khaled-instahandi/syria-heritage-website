import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "Syria Heritage - Reviving Syrian Mosques",
    description: "An initiative to document Syrian mosque restoration achievements, showcase projects needing funding, and receive supporter applications",
}
const cairo = Cairo({
    subsets: ["latin", "arabic"],
    weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>

            {children}
        </>
    )
}
