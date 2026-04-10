import Banner from "@/components/modules/homepage/Banner";
import MenuCategory from "@/components/modules/homepage/MenuCategory";
import PopularMeals from "@/components/modules/homepage/PopularMeals";
import TopRestaurants from "@/components/modules/homepage/TopRestaurants";
import HowItWorks from "@/components/modules/homepage/HowItWorks";
import OffersDiscounts from "@/components/modules/homepage/OffersDiscounts";
import Features from "@/components/modules/homepage/Features";
import Statistics from "@/components/modules/homepage/Statistics";
import Testimonial from "@/components/modules/homepage/Testimonial";
import BlogSection from "@/components/modules/homepage/BlogSection";
import FAQSection from "@/components/modules/homepage/FAQSection";
import Newsletter from "@/components/modules/homepage/Newsletter";
import { bannerAPI, blogsAPI } from "@/lib/api";

export default async function Home() {
  let banners = [];
  let blogs = [];
  try {
     const [bannerData, blogData] = await Promise.all([
       bannerAPI.getAll({ params: { isActive: "true" } }),
       blogsAPI.getAll().catch(() => ({ data: [] }))
     ]);
     banners = bannerData;
     blogs = blogData.data.slice(0, 3);
  } catch (error) {
     console.error("Failed to fetch home data:", error);
  }

  return (
    <div className="min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full">
        <Banner banners={banners} />
      </main>
      <MenuCategory />
      <PopularMeals />
      <TopRestaurants />
      <HowItWorks />
      <OffersDiscounts />
      <Features />
      <Statistics />
      <Testimonial />
      <BlogSection blogs={blogs} />
      <FAQSection />
      <Newsletter />
    </div>
  );
}
