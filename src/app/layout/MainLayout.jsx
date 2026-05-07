import './MainLayout.css';
import MainHeader from '../../shared/components/mainHeader/MainHeader';
import SiteFooter from '../../shared/components/siteFooter/SiteFooter';

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <main className="main-layout-main-tag">
        <MainHeader />
        <div className="main-layout-content">{children}</div>

        <div className="footer-container">
          <SiteFooter />
        </div>
      </main>
    </div>
  );
}

export default MainLayout;