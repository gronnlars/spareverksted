# MiniSearch (kun for forsøket)

Kilde: https://github.com/lucaong/minisearch, tag v7.2.0, commit 3d239d1c3ae7aef1bf5d8945dd7b5f0709f646f5. Lisens: MIT (se MINISEARCH-LICENSE.txt).

npm var ikke tilgjengelig i dette miljøet (policy-sperre mot registeret). Kilden ble klonet med git og bygget lokalt:

    git clone --depth 1 --branch v7.2.0 https://github.com/lucaong/minisearch.git
    esbuild src/index.ts --bundle --format=cjs --minify --outfile=minisearch-7.2.0.min.cjs

esbuild ligger i miljøets verktøy. Filen er altså ikke den offisielle npm-pakken, men bygget fra samme tag. Den brukes bare av forsøket under research/sokeprove og lastes ikke av nettsiden.
