
import Banner from "@/components/modules/homepage/Banner";
import MenuCategory from "@/components/modules/homepage/MenuCategory";
import PopularMeals from "@/components/modules/homepage/PopularMeals";
import TopRestaurants from "@/components/modules/homepage/TopRestaurants";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full">
        <Banner />
      </main>
      <MenuCategory />
      <PopularMeals />
      <TopRestaurants />
    </div>
  );
}
