import MainHeader from '../../shared/components/mainHeader/MainHeader';
import ContentWrapper from '../../components/layout/ContentWrapper';
import DigiFooter from '../../shared/components/digiFooter/DigiFooter';

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