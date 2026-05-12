import MainLayout from '../../app/layout/MainLayout'
import ContentWrapper from '../../shared/components/contentWrapper/ContentWrapper'
import './AboutDataPage.css'

export default function AboutDataPage() {
  return (
    <MainLayout>
      <ContentWrapper hideRensaLink>
        <div className="about-data-page">
          <h2>Om datan</h2>
          <p>
            Den här tjänsten visar historiska platsannonser från
            Arbetsförmedlingens publiceringskanal Platsbanken. Datan kommer från
            Jobtech historical API och kompletteras med AI-berikningar (enriched
            skills, occupation-fields m.m.).
          </p>
          <p>
            Sökindex byggs upp av kontinuerlig import. Vissa fält kan saknas i
            äldre annonser — i sökresultatet markeras dessa som
            <em> Uppgift saknas</em>.
          </p>
          <p>
            Detaljerad metadata hämtas från
            <code> /api/v1/metadata </code>
            och per annons via
            <code> include_metadata=true</code>.
          </p>
        </div>
      </ContentWrapper>
    </MainLayout>
  )
}
