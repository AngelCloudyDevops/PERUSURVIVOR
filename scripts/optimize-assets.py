"""Build lossless WebP copies and verify identical RGBA pixels (requires Pillow)."""
import argparse, hashlib, json
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--check', action='store_true')
parser.add_argument('--only', nargs='+', help='Process selected repository-relative PNG paths and merge their records into the asset audit.')
args = parser.parse_args()
rows = []
sources = [ROOT / name for name in args.only] if args.only else sorted((ROOT / 'public/assets').rglob('*.png'))
asset_root = (ROOT / 'public/assets').resolve()
for source in sources:
    source = source.resolve()
    try:
        source.relative_to(asset_root)
    except ValueError:
        parser.error(f'PNG must be inside public/assets: {source}')
    if source.suffix.lower() != '.png' or not source.is_file():
        parser.error(f'Expected an existing PNG: {source}')
    target = source.with_suffix('.webp')
    with Image.open(source) as original:
        if not args.check:
            original.save(target, 'WEBP', lossless=True, method=6, exact=True)
        if not target.exists():
            continue
        with Image.open(target) as optimized:
            assert optimized.size == original.size, source
            pixels = original.convert('RGBA').tobytes()
            assert optimized.convert('RGBA').tobytes() == pixels, f'Pixel mismatch: {source}'
        if target.stat().st_size >= source.stat().st_size:
            if not args.check:
                target.unlink()
            continue
        rows.append(dict(source=source.relative_to(ROOT/'public').as_posix(), output=target.relative_to(ROOT/'public').as_posix(), width=original.width, height=original.height, originalBytes=source.stat().st_size, optimizedBytes=target.stat().st_size, sourceSha256=hashlib.sha256(source.read_bytes()).hexdigest(), outputSha256=hashlib.sha256(target.read_bytes()).hexdigest(), rgbaSha256=hashlib.sha256(pixels).hexdigest()))
previews = []
preview_sources = sorted((ROOT / 'public/assets/maps').glob('*-v1.png')) if not args.only else []
for source in preview_sources:
    target = source.with_name(source.stem.replace('-v1', '-menu-v1') + '.webp')
    with Image.open(source) as original:
        preview = original.convert('RGBA')
        preview.thumbnail((384, 256), Image.Resampling.LANCZOS)
        if not args.check:
            preview.save(target, 'WEBP', lossless=True, method=6, exact=True)
        with Image.open(target) as decoded:
            assert decoded.convert('RGBA').tobytes() == preview.tobytes()
        previews.append(dict(output=target.relative_to(ROOT/'public').as_posix(), width=preview.width, height=preview.height, bytes=target.stat().st_size, sha256=hashlib.sha256(target.read_bytes()).hexdigest()))
path = ROOT/'docs/asset-optimization.json'
if args.only:
    previous = json.loads(path.read_text(encoding='utf-8'))
    indexed = {row['source']:row for row in previous['assets']}
    indexed.update({row['source']:row for row in rows})
    rows = sorted(indexed.values(), key=lambda row:row['source'])
    previews = previous['previews']
report = {'format':'WebP lossless, exact RGBA comparison', 'assets':rows, 'previews':previews, 'originalBytes':sum(r['originalBytes'] for r in rows), 'optimizedBytes':sum(r['optimizedBytes'] for r in rows)}
if args.check:
    assert json.loads(path.read_text(encoding='utf-8')) == report, 'Report mismatch'
else:
    path.write_text(json.dumps(report, indent=2)+'\n', encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k!='assets'}))
print(f'{len(rows)} images verified pixel for pixel')
