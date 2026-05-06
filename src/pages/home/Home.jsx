import HeroSection from '../../components/layout/HeroSection';
import ContentWrapper from '../../components/layout/ContentWrapper';
import DigiFooter from '../../components/layout/DigiFooter';

const Home = () => {
  return (
    <div className="home-page">
      <main className="home-main">
        <HeroSection />

        <ContentWrapper />

        <div className="footer-container">
          <DigiFooter />
      </div>
      </main>
    </div>
  );
};

export default Home;