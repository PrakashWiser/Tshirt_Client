import BestSellers from "./BestSellers";
import CategorySlider from "./CategorySlider";
import HeroBanner from "./HeroBanner";
import TrendingNow from "./TrendingNow";
import WatchAndShop from "./WatchAndShop";

function HomeSection() {
  return (
    <>
      <HeroBanner />
      <CategorySlider />
      <BestSellers />
      <TrendingNow />
      <WatchAndShop />
    </>
  );
}

export default HomeSection;
