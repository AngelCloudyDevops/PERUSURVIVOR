"""Build lossless WebP copies and verify identical RGBA pixels (requires Pillow)."""
import argparse, hashlib, json
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--check', action='store_true')
parser.add_argument('--only', nargs='+', help='Process selected repository-relative PNG paths and merge their records into the asset audit.')
parser.add_argument('--quality', type=int, help='Encode selected art as lossy WebP at this quality (1–100) to keep the deployment archive small.')
parser.add_argument('--max-width', type=int, help='Limit selected runtime copies to this width while preserving aspect ratio.')
parser.add_argument('--max-height', type=int, help='Limit selected runtime copies to this height while preserving aspect ratio.')
args = parser.parse_args()
if args.quality is not None and not 1 <= args.quality <= 100:
    parser.error('--quality must be between 1 and 100')
if args.max_width is not None and args.max_width < 1 or args.max_height is not None and args.max_height < 1:
    parser.error('--max-width and --max-height must be positive')
rows = []
path = ROOT/'docs/arte/auditorias/asset-optimization.json'
previous = json.loads(path.read_text(encoding='utf-8')) if path.exists() else {'assets':[], 'previews':[]}
previous_by_source = {row['source']:row for row in previous['assets']}
sources = [ROOT / name for name in args.only] if args.only else [ROOT/'public'/row['source'] for row in previous['assets']] if args.check else sorted((ROOT / 'public/assets').rglob('*.png'))
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
        runtime = original.copy()
        source_name = source.relative_to(ROOT/'public').as_posix()
        recorded = previous_by_source.get(source_name, {}) if args.check else {}
        quality = args.quality if args.quality is not None else recorded.get('quality')
        max_width = args.max_width or recorded.get('runtimeWidth') or original.width
        max_height = args.max_height or recorded.get('runtimeHeight') or original.height
        runtime.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
        if not args.check:
            if args.quality is None:
                runtime.save(target, 'WEBP', lossless=True, method=6, exact=True)
            else:
                runtime.save(target, 'WEBP', quality=args.quality, method=6)
        if not target.exists():
            continue
        with Image.open(target) as optimized:
            assert optimized.size == runtime.size, source
            pixels = original.convert('RGBA').tobytes()
            if quality is None and runtime.size == original.size:
                assert optimized.convert('RGBA').tobytes() == pixels, f'Pixel mismatch: {source}'
        if target.stat().st_size >= source.stat().st_size:
            if not args.check:
                target.unlink()
            continue
        rgba_hash = recorded.get('rgbaSha256') if args.check and quality is not None else hashlib.sha256(pixels).hexdigest()
        row=dict(source=source.relative_to(ROOT/'public').as_posix(), output=target.relative_to(ROOT/'public').as_posix(), width=original.width, height=original.height, originalBytes=source.stat().st_size, optimizedBytes=target.stat().st_size, sourceSha256=hashlib.sha256(source.read_bytes()).hexdigest(), outputSha256=hashlib.sha256(target.read_bytes()).hexdigest(), rgbaSha256=rgba_hash)
        if quality is not None:
            row['quality']=quality
        if runtime.size != original.size:
            row['runtimeWidth'],row['runtimeHeight']=runtime.size
        rows.append(row)
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
            assert decoded.size == preview.size
            if not args.check:
                assert decoded.convert('RGBA').tobytes() == preview.tobytes()
        previews.append(dict(output=target.relative_to(ROOT/'public').as_posix(), width=preview.width, height=preview.height, bytes=target.stat().st_size, sha256=hashlib.sha256(target.read_bytes()).hexdigest()))
if args.only:
    indexed = {row['source']:row for row in previous['assets']}
    indexed.update({row['source']:row for row in rows})
    rows = sorted(indexed.values(), key=lambda row:row['source'])
    previews = previous['previews']
report = {'format':'WebP lossless by default; selected assets may record lossy quality', 'assets':rows, 'previews':previews, 'originalBytes':sum(r['originalBytes'] for r in rows), 'optimizedBytes':sum(r['optimizedBytes'] for r in rows)}
if args.check:
    expected = json.loads(path.read_text(encoding='utf-8'))
    if expected != report:
        expected_assets = {row['source']:row for row in expected['assets']}
        actual_assets = {row['source']:row for row in report['assets']}
        changed = next((name for name in sorted(set(expected_assets)|set(actual_assets)) if expected_assets.get(name) != actual_assets.get(name)), 'summary')
        raise AssertionError(f'Report mismatch: {changed}')
else:
    path.write_text(json.dumps(report, indent=2)+'\n', encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k!='assets'}))
lossy=sum('quality' in row for row in rows)
print(f'{len(rows)} images checked: {len(rows)-lossy} lossless pixel matches, {lossy} lossy assets verified by dimensions and SHA-256')
