import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-white text-gray-900">
            {/* Hero Section */}
            <section className="bg-green-100 py-20 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Empower Change Through Giving
                    </h1>
                    <p className="text-lg md:text-xl mb-6">
                        Discover and support verified NGOs working in local communities.
                    </p>
                    <Button asChild>
                        <Link href="#featured-ngos">Explore NGOs</Link>
                    </Button>
                </div>
            </section>

            {/* Featured NGOs */}
            <section id="featured-ngos" className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-semibold mb-10 text-center">Featured NGOs</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((ngo) => (
                            <div
                                key={ngo}
                                className="rounded-2xl bg-white shadow p-6 hover:shadow-lg transition"
                            >
                                <img
                                    src={`/dummy/ngo${ngo}.jpg`}
                                    alt="NGO Logo"
                                    className="w-full h-40 object-cover rounded-xl mb-4"
                                />
                                <h3 className="text-xl font-semibold">NGO Name {ngo}</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Empowering communities through health and education.
                                </p>
                                <Button asChild>
                                    <Link href={`/ngo/ngo-${ngo}`}>View Profile</Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Campaigns */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-semibold mb-10 text-center">Featured Campaigns</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((campaign) => (
                            <div
                                key={campaign}
                                className="rounded-2xl bg-gray-50 shadow p-6 hover:shadow-md transition"
                            >
                                <h3 className="text-xl font-semibold mb-2">
                                    Support School Girls {campaign}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Help provide menstrual kits to 200 girls in rural schools.
                                </p>
                                <Button asChild>
                                    <Link href={`/campaign/campaign-${campaign}`}>Donate Now</Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 text-center text-muted-foreground text-sm bg-gray-100">
                &copy; {new Date().getFullYear()} Donation Platform. Built with ❤️
            </footer>
        </main>
    );
}