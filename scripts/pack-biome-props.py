from PIL import Image
from pathlib import Path
import hashlib
import json

root = Path(__file__).resolve().parents[1]
folder = root / "public/assets/environment"
catalogs = {
    "terminal": [
        ("bus-stop", (34, 68, 524, 464)), ("road-barrier", (546, 208, 1028, 488)),
        ("tire-stack", (1104, 154, 1498, 478)), ("ticket-booth", (60, 530, 500, 968)),
        ("traffic-cones", (538, 576, 998, 958)), ("vendor-cart", (1102, 518, 1486, 988)),
    ],
    "rooftop": [
        ("parapet", (46, 70, 552, 508)), ("water-tank", (628, 26, 1016, 512)),
        ("antenna", (1128, 24, 1506, 520)), ("roof-vent", (42, 556, 452, 964)),
        ("rebar-columns", (594, 506, 944, 1004)), ("roof-bridge", (986, 550, 1522, 954)),
    ],
    "cabinet": [
        ("office-planter", (8, 126, 568, 478)), ("filing-cabinet", (612, 18, 900, 486)),
        ("security-desk", (964, 134, 1532, 471)), ("queue-barrier", (28, 580, 500, 944)),
        ("civic-bench", (538, 570, 1044, 944)), ("civic-lamp", (1160, 504, 1406, 1002)),
    ],
    "archive": [
        ("archive-shelf", (74, 42, 516, 490)), ("archive-boxes", (546, 104, 1018, 478)),
        ("archive-cabinet", (1094, 30, 1456, 492)), ("warning-light", (164, 514, 392, 972)),
        ("archive-ladder", (576, 510, 962, 958)), ("evidence-cage", (1038, 530, 1486, 982)),
    ],
}

audits = []
for biome, definitions in catalogs.items():
    source = folder / f"{biome}-props-v1.png"
    image = Image.open(source).convert("RGBA")
    packed = Image.new("RGBA", (480, 320))
    cells = []
    for index, (prop_id, box) in enumerate(definitions):
        tile = image.crop(box)
        tile.thumbnail((148, 148), Image.Resampling.LANCZOS)
        x = index % 3 * 160 + (160 - tile.width) // 2
        y = index // 3 * 160 + 154 - tile.height
        packed.alpha_composite(tile, (x, y))
        cells.append({"id": prop_id, "x": x, "y": y, "w": tile.width, "h": tile.height})
    runtime = source.with_suffix(".webp")
    packed.save(runtime, quality=60, alpha_quality=100, exact=True, method=6)
    audits.append({
        "biome": biome,
        "source": source.relative_to(root).as_posix(),
        "runtime": runtime.relative_to(root).as_posix(),
        "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "runtime_sha256": hashlib.sha256(runtime.read_bytes()).hexdigest(),
        "bytes": runtime.stat().st_size,
        "width": packed.width,
        "height": packed.height,
        "cells": cells,
    })

audit = {
    "method": "Built-in image_gen; reviewed crop boundaries; Lanczos packing into six isolated cells.",
    "atlases": audits,
}
(root / "docs/arte/auditorias/biome-props-audit.json").write_text(json.dumps(audit, indent=2) + "\n", encoding="utf8")
print(json.dumps(audit))
