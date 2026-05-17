import './SiteFooter.css';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  DigiFooter,
  DigiFooterCard,
  DigiLogo,
} from '@designsystem-se/af-react';
import {
  FooterVariation,
  FooterCardVariation,
  LogoColor,
  LogoVariation,
} from '@designsystem-se/af';

const SiteFooter = () => {
  return (
    <DigiFooter afVariation={FooterVariation.LARGE}>
      <div slot="content-top" className="footer-content-top">
        <div className="footer-content-top__cards">
          <div>
          <DigiFooterCard afType={FooterCardVariation.ICON}>
            <ul>
              <li>
                <a href="#">
                  <digi-icon-web-tv></digi-icon-web-tv>
                  Kontakta oss
                </a>
              </li>
              <li>
                <a href="https://github.com/Letssdothiss/historical-ads-frontend-rework-FRONTEND">
                <digi-icon-external-link-alt></digi-icon-external-link-alt>
                  Github källkod till Frontend
                </a>
              </li>
              <li>
                <a href="https://github.com/Letssdothiss/historical-ads-frontend-rework-BACKEND">
                <digi-icon-external-link-alt></digi-icon-external-link-alt>
                  Github källkod till Backend
                </a>
              </li>
            </ul>
          </DigiFooterCard>
        </div>
        <div>
          <DigiFooterCard>
            <ul>
              <li>
                <a href="https://arbetsformedlingen.se/om-oss/press">För press och media</a>
              </li>
              <li>
                <a href="https://arbetsformedlingen.se/varden">För hälso- och sjukvården</a>
              </li>
              <li>
                <a href="https://arbetsformedlingen.se/for-kommuner">För kommuner</a>
              </li>
            </ul>
          </DigiFooterCard>
        </div>
        </div>
        <div className="footer-card-border-container">
          <DigiFooterCard
          afType={FooterCardVariation.BORDER}>
            <a href="https://arbetsformedlingen.se/for-arbetsgivare">För Arbetsgivare</a>
            <p>När du behöver rekrytera hjälper vi dig att hitta värdefull kompetens</p>
          </DigiFooterCard>
          <DigiFooterCard afType={FooterCardVariation.BORDER}>
            <a href="https://arbetsformedlingen.se/for-leverantorer">För Leverantörer</a>
            <p>När du är leverantör av våra tjänster</p>
          </DigiFooterCard>
          <DigiFooterCard afType={FooterCardVariation.BORDER}>
            <a href="https://arbetsformedlingen.se/om-oss">Om oss</a>
            <p>När du vill veta mer om vår myndighet och våra uppdrag</p>
          </DigiFooterCard>
          <DigiFooterCard afType={FooterCardVariation.BORDER}>
            <a href="https://arbetsformedlingen.se/statistik">Statistik och analyser</a>
            <p>När du vill se statistik och ta del av våra analyser för arbetsmarknaden</p>
          </DigiFooterCard>
        </div>
      </div>
      <div slot="content-bottom-left">
        <Link to="/">
          <DigiLogo afVariation={LogoVariation.LARGE} afColor={LogoColor.SECONDARY}></DigiLogo>
        </Link>
      </div>
      <div slot="content-bottom-right">
        <p>Följ oss på</p>
        <a href="https://www.facebook.com/Arbetsformedlingen">Facebook</a>
        <a href="https://www.youtube.com/Arbetsformedlingen">Youtube</a>
        <a href="https://www.linkedin.com/company/arbetsformedlingen">Linkedin</a>
        <a href="https://www.instagram.com/arbetsformedlingen">Instagram</a>
      </div>
    </DigiFooter>
  );
};

export default SiteFooter;