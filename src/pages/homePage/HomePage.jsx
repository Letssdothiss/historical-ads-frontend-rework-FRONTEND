import './HomePage.css';
import MainLayout from '../../app/layout/MainLayout';
import ContentWrapper from '../../shared/components/contentWrapper/ContentWrapper';

function HomePage() {
  return (
    <div className="home-page">
      <MainLayout>
        <ContentWrapper />
      </MainLayout>
    </div>

  );
}

export default HomePage;