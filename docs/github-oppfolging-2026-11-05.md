# Notat til senere GitHub-gjennomgang

Lars meldte 5. november 2026 et Aikido-varsel med ID **GHSA-cxwv-7g56-2vh6** og foreslo `v4`-tagg eller versjon `4.3.1`. Han ba om at oppfølgingen tas ved den planlagte gjennomgangen av GitHub, uten å utvide kalkulatorrettingene.

Dette er registrert som et **rapportert varsel**, ikke som en ferdig verifisert beskrivelse av berørt komponent eller en påstand om at en versjonsendring er utført. Advisory-siden og korrekt versjonsgrense må kontrolleres mot primærkilden før retting:

https://github.com/advisories/GHSA-cxwv-7g56-2vh6

Ved gjennomgangen:

1. Bekreft ID, berørt Action/pakke, berørte versjoner og rettet versjon i den offisielle sikkerhetsmeldingen. Ta utgangspunkt i Aikido-funnet dersom ID-en ikke kan slås opp direkte.
2. Kontroller alle brukssteder og hva taggen faktisk peker til. Koden på main etter #222 bruker allerede `actions/download-artifact@v4` i `.github/workflows/static.yml`; det beviser ikke alene hvilken revisjon en tidligere kjøring brukte, eller at dette er komponenten i varselet.
3. Vurder om verifisert rettet revisjon skal festes til SHA eller versjon etter prosjektets policy. Ikke stol på at ordet `v4` alene dokumenterer en retting.
4. Kontroller både PR-kjøring og publiseringens nedlasting av artefakter før saken lukkes. Før opp faktisk verifisert status og eventuelle gjenstående funn.

Lars opplyser også at domeneskanningen i Aikido ikke fant problemer. Dette er et avgrenset resultat fra hans skanning. Det er ikke utført en ny domeneskanning i denne økten, og notatet er ingen generell sikkerhetssertifisering.

Arbeidsflytene er ikke endret som del av dette notatet. Oppfølgingen holdes atskilt fra kalkulatorens pågående feilrettinger.
