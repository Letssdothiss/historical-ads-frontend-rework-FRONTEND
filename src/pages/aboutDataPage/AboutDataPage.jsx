import MainLayout from '../../app/layout/MainLayout'
import ContentWrapper from '../../shared/components/contentWrapper/ContentWrapper'
import './AboutDataPage.css'

export default function AboutDataPage() {
  return (
    <MainLayout>
      <ContentWrapper
        hideRensaLink
        contentClassName="shell-form-container--about"
      >
        <div className="about-data-page">
          <h2>Om datan i de Historiska platsannonserna</h2>
          <p>
            Användarundersökningen visade att en av målgrupperna har ett starkt
            intresse av att få metadata kring databasen. Exempel på metadata
            eller vad som ska skrivas under rubriken “Om datan” är följande:
          </p>
          <ul>
            <li>
              Hur har materialet samlats in? Ex. HR system, hur ser variablerna
              ut bakom kulisserna
            </li>
            <li>Vad för kvalitetsbrister kan det finnas?</li>
            <li>Var kommer datan ifrån?</li>
            <li>Vem har lagt upp datan?</li>
            <li>Kort förklaring kring AI-berikningen av olika variabler</li>
            <li>När uppdateras databasen? Vad inkluderas i uppdateringen?</li>
          </ul>
        </div>
      </ContentWrapper>
    </MainLayout>
  )
}
