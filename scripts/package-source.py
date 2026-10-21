"""Create the portable source download without Git, secrets or deployment state."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parent.parent
output = root / 'dist' / 'spareverksted-kildekode.zip'
files = [root / name for name in ('README.md', 'LICENSE', 'CONTRIBUTING.md')]
for folder in ('dist', 'tests', 'scripts', 'research', '.github'):
    files += [p for p in (root / folder).rglob('*')
              if p.is_file() and p.suffix in ('.html', '.css', '.js', '.cjs', '.py', '.json', '.yml')
              and not p.name.startswith('_qa') and '__pycache__' not in p.parts]
with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
    for path in sorted(files):
        archive.write(path, Path('spareverksted') / path.relative_to(root))
print(f'Source package: {output.name} ({output.stat().st_size} bytes)')
