import Link from "next/link";
import {Button} from "@/components/ui/button.tsx";
import {Heart} from "lucide-react";


const CTASection = () => {
    return (
        <section className="py-20 bg-secondary-light">
            <div className="container mx-auto px-4 text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white">
                        Ready to Make a Difference?
                    </h2>
                    <p className="text-xl text-white/90">
                        Join thousands of Kenyans who are creating positive change in their communities.
                        Every donation, no matter the size, makes a real impact.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/campaigns">
                            <Button variant="secondary" size="lg" className="text-lg px-8 py-4 bg-primary text-white hover:bg-primary-light cursor-pointer">
                                <Heart className="mr-2 h-5 w-5" />
                                Start Donating
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-transparent border-white/30 text-white hover:bg-white hover:text-gray-900 cursor-pointer">
                                Register Your NGO
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
