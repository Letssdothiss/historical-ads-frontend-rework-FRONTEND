# Bugs/Fixes needed

## Priority

### High

#### Generellt

- Felmeddelande bör uppdateras när annons inte kan hämtas.
  `(Exempel: /platsannonser/annons/5285b3b3531f1b74082cbd487109a551aca921c3)`
- ~~Formulär rensas om "Justera sökning" knappen används för att öppna och stänga formuläret.~~
- ~~Input i sökfält sparas inte när sökning görs, dvs. fält rensas vid sökning.~~
- Rensa-knappen ovanför tabsSwitch-komponenten fungerar ej.
- ~~Knappen för att justera sökning bör minskas i klickbar storlek för när man vill förminska sökformuläret, för att undvika felklick.(Placera under sök istället?)~~

#### Platsannonser
- ~~Geografiskt område visar enbart Uppsala län.~~
- ~~Yrkesgrupper verkar inte fungera, får "Inga annonser hittades. Prova att ändra sökkriterier." på alla sökningar.~~

#### Statistik
- ~~Geografiskt område visar enbart Uppsala län.~~

---

### Medium

#### Generellt

- Rullgardinsmenyn för Tidsperiod blir blank vid mindre bredd än 800px.
- Rullgardinsmenyn för Fakta Anställning hoppar runt i browsern vid bredder mindre än 800px.
- ~~TabsSwitch-komponenten anpassar sig inte i bredder mindre än 975px.~~
- ~~Rullgardingsmenyn för Geografiskt område "overflowar" utanför browser, synligt vid mindre bredd än 1520px.~~
- ~~Rullgardingsmenyn för Yrkesgrupper "overflowar" utanför browser, synligt vid mindre bredd än 1520px.~~

#### Platsannonser
- ~~När en sökning görs försvinner "Rensa"-knappen som är ovanför tabsSwitch-komponenten, den kommer tillbaka om man gör ett menyval igen. (ex. Sökning i platsannonser > knappen försvinner > tryck på platsannonser igen > knapp tillbaka.)~~

#### Statistik
- ~~När en sökning görs försvinner "Rensa"-knappen som är ovanför tabsSwitch-komponenten, den kommer tillbaka om man gör ett menyval igen. (ex. Sökning i platsannonser > knappen försvinner > tryck på platsannonser igen > knapp tillbaka.)~~

---

### Low

#### Generellt

- Lägga till visning för var annonsen har sitt ursprung ifrån, ("source_type":)
- s.k "trigger-dot" för rullgardinsmeny "Geografiskt område" bör ha mer utrymme runt sig.
- Rullgardinsmenyer har olika utseenden. Geografiskt område & Yrkesgrupper är lika, men överensstämmer inte med resten. En design bör väljas som de andra ska efterlikna.
- ~~När "Om datan"-fliken är aktiv, dvs grön, så syns fortfarande vitt längst till höger från ett parent element.~~

#### Platsannonser

- ~~Infoikonen (hover), visar info korrekt vid hover men kräver antingen klick utanför eller att muspekaren dras över själva textrutan för att försvinna.~~

#### Statistik

- ~~Infoikonen (hover), visar info korrekt vid hover men kräver antingen klick utanför eller att muspekaren dras över själva textrutan för att försvinna.~~

## Okänd orsak

- Följande felmeddelande i browser inspector: <br>
  <i>Encountered two children with the same key, `cd783341348fc5b6ec5f7ef45f2c4776f154459e`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. <br>
  react-dom-client.development.js:6604:23 <br>
  React 22 <br>
  onClick JobAdsResultsPage.jsx:83 <br>
  React 8<i> - `Möjlig orsak skulle kunna vara cachning, så den hittar cachat och nytt?`<br>
  <br>

---
