import TopTitleSection from '../../components/layout/TopTitleSection';
import ContentWrapper from '../../components/layout/ContentWrapper';
import DigiFooter from '../../components/layout/DigiFooter';

function Home() {
  return (
    <div className="home-page">
      <main className="home-main">
        <TopTitleSection />

        <ContentWrapper />

        <div className="footer-container">
          <DigiFooter />
      </div>
      </main>
    </div>
  );
};

export default Home;