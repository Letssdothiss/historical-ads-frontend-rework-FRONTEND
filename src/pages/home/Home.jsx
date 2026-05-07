import MainHeader from '../../components/layout/MainHeader';
import ContentWrapper from '../../components/layout/ContentWrapper';
import DigiFooter from '../../components/layout/DigiFooter';

function Home() {
  return (
    <div className="home-page">
      <main className="home-main">
        <MainHeader />

        <ContentWrapper />

        <div className="footer-container">
          <DigiFooter />
      </div>
      </main>
    </div>
  );
};

export default Home;