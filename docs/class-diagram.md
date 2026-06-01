# Klassdiagram – Historiska platsannonser (Frontend)

> Projektet är byggt i **React 19** med funktionskomponenter och hooks (inga
> ES-klasser). I diagrammen nedan modelleras därför varje **komponent**, **hook**
> och **modul** som en "klass" i UML-mening:
>
> - `<<component>>` = React-komponent — **attribut = props**, **metoder = interna funktioner/handlers**
> - `<<hook>>` = custom hook — attribut = returnerat state, metoder = exponerade funktioner
> - `<<module>>` = ren JS-modul (api/utils/mapper) — metoder = exporterade funktioner
> - `<<const>>` = konstant-/konfigurationsmodul
>
> Relationspilar:
> - `-->` "renderar / komponerar" (en komponent renderar en annan)
> - `..>` "använder / importerar" (beroende på hook, util, api)
> - `--|>` används ej (ingen arvshierarki finns)

---

## 1. Översikt – applikations- och routinglager

```mermaid
classDiagram
    direction TB

    class main {
        <<entrypoint>>
        +createRoot(#root)
        +render(App)
    }
    class App {
        <<component>>
        +render() BrowserRouter
    }
    class AppRoutes {
        <<component>>
        +render() Routes
    }
    class MainLayout {
        <<component>>
        +children
    }
    class ContentWrapper {
        <<component>>
        +children
        +onReset()
        +hideRensaLink
        +contentClassName
        +handleClear()
    }
    class routes {
        <<const>>
        +ROUTES
        +MAIN_TAB_PREFIXES
        +getMainTabSection(pathname)
        +buildAdDetailPath(adId)
    }

    main --> App
    App --> AppRoutes
    App --> ScrollToTop
    AppRoutes ..> routes
    AppRoutes --> JobAdsSearchPage
    AppRoutes --> JobAdsResultsPage
    AppRoutes --> JobAdDetailPage
    AppRoutes --> StatisticsSearchPage
    AppRoutes --> StatisticsResultsPage
    AppRoutes --> AboutDataPage
    AppRoutes --> NotFoundPage

    MainLayout --> MainHeader
    MainLayout --> SiteFooter
    ContentWrapper --> TabsSwitch
    ContentWrapper ..> routes
```

---

## 2. Sidor (Pages)

```mermaid
classDiagram
    direction TB

    class JobAdsSearchPage {
        <<component>>
    }
    class JobAdsResultsPage {
        <<component>>
        -page : number
        -adjustOpen : bool
        -uiParams
        +readUiParamsFromUrl(searchParams)
        +buildSummary(params)
        +handleViewAd(ad)
    }
    class JobAdDetailPage {
        <<component>>
        -isLoading, error, ad, metadata
        +adReducer(state, action)
        +mergeQualifications(source)
        +readResultContext()
        +backToResults()
        +goNextAd()
    }
    class StatisticsSearchPage {
        <<component>>
    }
    class StatisticsResultsPage {
        <<component>>
        -data, yearResults
        -isLoading, error, adjustOpen
        +readUiParamsFromUrl(searchParams)
    }
    class AboutDataPage {
        <<component>>
    }
    class HomePage {
        <<component>>
        %% ej registrerad i AppRoutes
    }
    class NotFoundPage {
        <<component>>
    }

    JobAdsSearchPage --> MainLayout
    JobAdsSearchPage --> ContentWrapper
    JobAdsSearchPage --> JobAdsSearchForm

    JobAdsResultsPage --> MainLayout
    JobAdsResultsPage --> ContentWrapper
    JobAdsResultsPage --> ResultsAdjustSearch
    JobAdsResultsPage --> JobAdsSearchForm
    JobAdsResultsPage --> JobAdsResultsList
    JobAdsResultsPage --> JobAdsPagination
    JobAdsResultsPage ..> useJobAdsQuery
    JobAdsResultsPage ..> routes
    JobAdsResultsPage ..> ui

    JobAdDetailPage --> MainLayout
    JobAdDetailPage --> ContentWrapper
    JobAdDetailPage --> ErrorState
    JobAdDetailPage ..> jobAdsApi
    JobAdDetailPage ..> jobAdsMapper
    JobAdDetailPage ..> routes

    StatisticsSearchPage --> MainLayout
    StatisticsSearchPage --> ContentWrapper
    StatisticsSearchPage --> StatisticsSearchForm

    StatisticsResultsPage --> MainLayout
    StatisticsResultsPage --> ContentWrapper
    StatisticsResultsPage --> ResultsAdjustSearch
    StatisticsResultsPage --> StatisticsSearchForm
    StatisticsResultsPage --> StatisticsChartPanel
    StatisticsResultsPage ..> StatisticsApi
    StatisticsResultsPage ..> StatisticsMapper

    AboutDataPage --> MainLayout
    AboutDataPage --> ContentWrapper
    HomePage --> MainLayout
    HomePage --> ContentWrapper
    HomePage --> JobAdsSearchForm
    NotFoundPage --> MainLayout
```

---

## 3. Feature: jobAds (platsannonser)

```mermaid
classDiagram
    direction TB

    class jobAdsApi {
        <<module>>
        +search(params)
        +getAd(adId, includeMetadata)
        +getFilters(params)
        +getFilter(name, params)
        +shareUrl(params)
        +export(params, format)
    }
    class jobAdsMapper {
        <<module>>
        +mapHitToAd(hit)
        +mapSearchResponse(response)
    }
    class useJobAdsQuery {
        <<hook>>
        +ads, total, offset
        +isLoading, isError, error
        +refetch()
        -toApiParams(uiParams, opts)
    }
    class useJobAdsSearchParams {
        <<hook>>
        +lan, kommuner, yrkesomraden, yrkesgrupper
        +fritext, korkort
        +setGeographyFilter()
        +setJobFilter()
        +setFreetext()
        +setDriversLicense()
        +clearAll()
    }
    class JobAdsSearchForm {
        <<component>>
        +searchParams
        +handleSubmit(event)
    }
    class JobAdsResultsList {
        <<component>>
        +ads, isLoading, isError, error
        +onViewAd(), onRetry()
    }
    class JobAdsResultCard {
        <<component>>
        +ad, onViewAd()
        -formatText(value)
        -formatDate(value)
    }
    class JobAdsPagination {
        <<component>>
        +currentPage, totalPages, totalResults
        +pageSize, maxPages, onPageChange()
        -clampPage(page, totalPages)
    }
    class JobAdsFormatters {
        <<module>>
        +formatResultCount(total)
        +formatEmployerSearchLabel(type)
    }

    useJobAdsQuery ..> jobAdsApi
    useJobAdsQuery ..> jobAdsMapper
    useJobAdsQuery ..> ui
    useJobAdsQuery ..> employmentParams
    useJobAdsQuery ..> monthLabels

    jobAdsApi ..> HttpClient
    jobAdsMapper ..> Date

    JobAdsResultsList --> JobAdsResultCard
    JobAdsSearchForm ..> searchFormParams
    JobAdsSearchForm --> CompetencySearch
    JobAdsSearchForm --> Dropdown
    JobAdsSearchForm --> GeographyFilter
    JobAdsSearchForm --> JobGroupFilter
    JobAdsSearchForm --> TimePeriodFilter
    JobAdsSearchForm --> EmploymentFactsPicker
    JobAdsSearchForm --> GroupedTooltip
    JobAdsSearchForm --> InfoTooltip
```

---

## 4. Feature: statistics (statistik)

```mermaid
classDiagram
    direction TB

    class StatisticsApi {
        <<module>>
        +fetchStatistics(params)
        +exportStatistics(params, format)
        -toBaseApiParams(params)
        -toDrivingLicenseRequired(value)
    }
    class StatisticsMapper {
        <<module>>
        +mapStatisticsResponse(yearResults)
        +mapStatisticsByMonth(yearResults)
        +mapStatisticsByMunicipality(yearResults)
        -extractRegions(raw)
        -parseMonthLabel(label)
    }
    class useStatisticsParams {
        <<hook>>
        +params, setParams(), hasParams
    }
    class useStatisticsQuery {
        <<hook>>
        +data, loading, error
    }
    class StatisticsSearchForm {
        <<component>>
        +searchParams
        +handleSubmit(event)
    }
    class StatisticsChartPanel {
        <<component>>
        +data, yearResults, searchParams
        -visning, enhet, pivot, detailLevel
        -sortCol, sortDir, exportFormat, toast
        +handleSort(col)
        +handleExport(format)
        +saveSearch()
        -buildSummary(params)
    }
    class BarChart {
        <<component>>
        +data, stacked
    }
    class LineChart {
        <<component>>
        +data
    }
    class PieChart {
        <<component>>
        +data
    }
    class DrivingLicenseFilter {
        <<component>>
        +value, onChange()
        -deriveChecks(value)
        -toValue(checks)
    }
    class TrendsFilter {
        <<component>>
        +value, onChange()
    }
    class StatisticsTransformers {
        <<module>>
        +toBarChartData(data, options)
        +toChartData(data, options)
        +toAndel(data)
    }
    class chartUtils {
        <<module>>
        +chartMaxWidth(categoryCount)
    }

    StatisticsApi ..> HttpClient
    StatisticsApi ..> employmentParams
    useStatisticsQuery ..> StatisticsApi
    useStatisticsQuery ..> StatisticsMapper

    StatisticsChartPanel ..> StatisticsApi
    StatisticsChartPanel ..> StatisticsMapper
    StatisticsChartPanel ..> StatisticsTransformers
    StatisticsChartPanel ..> monthLabels
    StatisticsChartPanel --> BarChart
    StatisticsChartPanel --> LineChart

    BarChart ..> StatisticsTransformers
    BarChart ..> chartUtils
    LineChart ..> StatisticsTransformers
    PieChart ..> StatisticsTransformers

    StatisticsSearchForm ..> searchFormParams
    StatisticsSearchForm --> CompetencySearch
    StatisticsSearchForm --> Dropdown
    StatisticsSearchForm --> GeographyFilter
    StatisticsSearchForm --> JobGroupFilter
    StatisticsSearchForm --> TimePeriodFilter
    StatisticsSearchForm --> EmploymentFactsPicker
    StatisticsSearchForm --> DrivingLicenseFilter
    StatisticsSearchForm --> TrendsFilter
    StatisticsSearchForm --> GroupedTooltip
    StatisticsSearchForm --> InfoTooltip
```

---

## 5. Delade resurser (shared) – api, hooks, utils, konstanter

```mermaid
classDiagram
    direction TB

    class HttpClient {
        <<module>>
        +get(path, params)
        +getFile(path, params)
        -buildQuery(params)
        -httpClient : AxiosInstance
    }
    class usePagination {
        <<hook>>
        +offset, currentPage, pageSize
        +goToPage(page), reset()
    }
    class useDebounce {
        <<hook>>
        +debounced
    }
    class useGeographyData {
        <<hook>>
        +lanData, loading, error
    }
    class useJobData {
        <<hook>>
        +jobData, loading, error
    }

    class Date {
        <<module>>
        +formatShortDate(dateString)
    }
    class QueryString {
        <<module>>
        +buildQueryString(params)
    }
    class employmentParams {
        <<module>>
        +resolveEmploymentTypeParams(values)
    }
    class monthLabels {
        <<module>>
        +SWEDISH_MONTH_NAMES
        +parseMonthNumbers(months)
        +formatPeriodLabel(years, months)
        +buildPublishedDateRange(years, months)
    }
    class searchFormParams {
        <<module>>
        +parseJobAdsSearchFormState(sp)
        +parseStatisticsSearchFormState(sp)
        +geographyFilterKey(geo)
        +jobGroupFilterKey(occ)
    }
    class ui {
        <<const>>
        +PAGE_SIZE
        +EMPLOYMENT_TYPES
        +EMPLOYMENT_DURATIONS
        +EMPLOYMENT_SCOPES
        +TRENDS, DRIVING_LICENSE, TABS
    }

    usePagination ..> ui
    employmentParams ..> ui : (konceptbeskrivning)
```

---

## 6. Delade UI-komponenter (shared/components)

```mermaid
classDiagram
    direction TB

    class GeographyFilter {
        <<component>>
        +onClose(), onApply()
        +initialLan, initialKommuner
        +handleApply()
        +toggleKommun(), toggleAllaLan()
    }
    class JobGroupFilter {
        <<component>>
        +onClose(), onApply()
        +initialAreas, initialGroups
        +handleApply()
        +toggleGroup(), toggleAllaAreas()
    }
    class TimePeriodFilter {
        <<component>>
        +onChange(), initialPeriod
        +handleYearClick(), handleMonthClick()
        -getTimePeriodPayload()
        -applyTimePeriodValue()
    }
    class EmploymentFactsPicker {
        <<component>>
        +value, onChange()
        +toggleSectionOption()
        +toggleAllForSection()
    }
    class CompetencySearch {
        <<component>>
        +value, onChange()
    }
    class Dropdown {
        <<component>>
        +trigger, children, isOpen, onClose()
    }
    class GroupedTooltip {
        <<component>>
        +title, grouped
    }
    class InfoTooltip {
        <<component>>
        +label, children
    }
    class FilterIndicator {
        <<component>>
        +heading, groups
    }
    class ResultsAdjustSearch {
        <<component>>
        +open, onToggle(), children
    }
    class MainHeader {
        <<component>>
    }
    class TabsSwitch {
        <<component>>
    }
    class SiteFooter {
        <<component>>
    }
    class ScrollToTop {
        <<component>>
    }
    class ErrorState {
        <<component>>
        +title, message, onRetry()
    }
    class LoadingState {
        <<component>>
        +text
    }
    class SkeletonLoader {
        <<component>>
    }
    class ResultCount {
        <<component>>
        +count
    }

    GeographyFilter ..> useGeographyData
    JobGroupFilter ..> useJobData
    EmploymentFactsPicker ..> ui
    CompetencySearch --> InfoTooltip
    TabsSwitch ..> routes
    ScrollToTop ..> routes
```

---

## 7. Beroendekarta på hög nivå (lager)

```mermaid
flowchart TB
    subgraph Entry
        main
    end
    subgraph AppLager["App / Routing"]
        App --> AppRoutes
    end
    subgraph Pages["Sidor"]
        P1[JobAds-sidor]
        P2[Statistik-sidor]
        P3[Om datan / 404]
    end
    subgraph Features["Features"]
        F1["jobAds<br/>api · hooks · components"]
        F2["statistics<br/>api · hooks · components"]
    end
    subgraph Shared["Shared"]
        S1["components"]
        S2["hooks"]
        S3["utils + constants"]
        S4["HttpClient (axios)"]
    end
    subgraph Extern["Externa tjänster"]
        BE["Backend API<br/>/api/v1"]
        TAX["JobTech Taxonomy<br/>GraphQL"]
    end

    main --> App
    AppRoutes --> Pages
    Pages --> Features
    Pages --> Shared
    Features --> Shared
    F1 --> S4
    F2 --> S4
    S4 --> BE
    S2 --> TAX
```

---

### Anteckningar

- **`HomePage`** finns men är **inte** kopplad i `AppRoutes` (roten `/`
  redirectar till `/platsannonser`). Den behålls i diagrammet för fullständighet.
- **`useJobAdsSearchParams`**, **`useStatisticsParams`**, **`useStatisticsQuery`**,
  **`usePagination`**, **`useDebounce`**, **`FilterIndicator`**, **`ResultCount`**,
  **`LoadingState`**, **`SkeletonLoader`** och **`JobAdsFormatters`** existerar i
  kodbasen men anropas inte från de aktiva sidorna/formulären (resultatsidorna
  läser URL-parametrar direkt och anropar `fetch*`-API:erna). De är ritade som
  fristående "klasser" utan inkommande renderingspilar.
- Två separata GraphQL-hooks (`useGeographyData`, `useJobData`) hämtar län/kommun
  respektive yrkesområde/yrkesgrupp direkt från **JobTech Taxonomy**.
- All backend-kommunikation går genom **`HttpClient`** (en delad axios-instans
  med response-interceptor för felhantering).
```
