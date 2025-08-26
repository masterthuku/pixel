import FeaturesSection from "@/components/FeaturesSection";
import HeroSection from "@/components/hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const stats = [
    { label: "Images Processed", value: "100,000", suffix: "+" },
    { label: "Active Users", value: "10,000", suffix: "+" },
    { label: "AI Transformations", value: "50,000", suffix: "+" },
    { label: "User Satisfaction", value: "99", suffix: "%" },
  ];

  return (
    <div className="pt-36">
      {/* hero */}
      <HeroSection />
      {/* stats */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              return (
                <div key={index} className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {stat.value.toLocaleString()}
                    {stat.suffix}
                  </div>
                  <div className="text-gray-400 upppercase tracking-wider text-sm">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* features */}
      <FeaturesSection/>
      {/* pricing */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">
            Ready to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Create Something Amazing?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators and start your creative journey with us,
            using AI to transform your ideas into stunning digital masterpieces.
          </p>
          <Link href={"/dashboard"}>
            <Button variant={"primary"} size={"xl"}>
              Start Creating Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
