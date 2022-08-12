import type { NextPage } from 'next';
import { Banner } from '../components';

const Home: NextPage = () => (
  <div className="flex justify-center sm:px-4 p-12">
    <div className="w-full minmd:w-4/5">
      <Banner
        parentStyles="justify-start mb-7 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
        childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left"
        name="Discover, collect, and sell extraordinary NTFs"
      />
    </div>
  </div>
);

export default Home;
