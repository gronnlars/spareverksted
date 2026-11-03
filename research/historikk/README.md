# Historiske rådata

Hentet av `scripts/tidsmaskin.py`. Ikke rediger filene her: de skal være uendret slik kilden publiserte dem (Norges Banks vilkår). `python3 scripts/tidsmaskin.py sjekk` kontrollerer det.

- `register.json`: hver fil med kilde, adresse, versjon, hentetidspunkt og SHA256.
- `<id>/<fil>` og `<id>/<fil>.meta.json`: rådata og opplysninger om dem.
- `OVERSIKT.md`: hva filene inneholder.

Kilde: Norges Bank og Statistisk sentralbyrå. Se docs/tidsmaskin.md.
