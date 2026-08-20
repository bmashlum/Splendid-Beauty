from __future__ import annotations

import csv
import hashlib
import json
import time
import urllib.parse
import urllib.request
import zipfile
from datetime import datetime, timezone
from pathlib import Path

PERIOD1 = 1629417600  # 2021-08-20 00:00:00 UTC
PERIOD2 = 1787184000  # 2026-08-20 00:00:00 UTC, exclusive
OUTPUT_DIR = Path("yahoo_5y_exports")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

SYMBOLS = [
    ("IWM", "IWM"),
    ("DAX", "^GDAXI"),
    ("EEM", "EEM"),
    ("XOM", "XOM"),
]


def yahoo_url(symbol: str) -> str:
    encoded = urllib.parse.quote(symbol, safe="")
    return (
        f"http://query1.finance.yahoo.com/v8/finance/chart/{encoded}"
        f"?period1={PERIOD1}&period2={PERIOD2}&interval=1d"
        "&includePrePost=false&events=div%2Csplits"
    )


def fetch_yahoo(symbol: str) -> tuple[dict, str, str]:
    source_url = yahoo_url(symbol)
    relay_url = "https://r.jina.ai/" + source_url
    request = urllib.request.Request(
        relay_url,
        headers={
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/151 Safari/537.36",
            "Accept": "text/plain,*/*",
        },
    )
    failures: list[str] = []
    for attempt in range(1, 4):
        try:
            with urllib.request.urlopen(request, timeout=90) as response:
                text = response.read().decode("utf-8-sig")
            marker = text.find('{"chart":')
            if marker < 0:
                raise RuntimeError("Yahoo JSON marker not found in relay response")
            payload = json.loads(text[marker:].strip())
            chart = payload.get("chart", {})
            if chart.get("error"):
                raise RuntimeError(str(chart["error"]))
            results = chart.get("result") or []
            if not results:
                raise RuntimeError("Yahoo returned no chart result")
            return results[0], source_url.replace("http://", "https://", 1), relay_url
        except Exception as exc:
            failures.append(f"attempt {attempt}: {type(exc).__name__}: {exc}")
            time.sleep(attempt * 3)
    raise RuntimeError(f"Unable to download {symbol}: " + " | ".join(failures))


def fmt_number(value: float | int | None) -> str:
    if value is None:
        return ""
    number = float(value)
    if number.is_integer():
        return str(int(number))
    return f"{number:.10f}".rstrip("0").rstrip(".")


def utc_date(timestamp: int) -> str:
    return datetime.fromtimestamp(timestamp, tz=timezone.utc).date().isoformat()


manifest: dict[str, object] = {
    "generated_at_utc": datetime.now(timezone.utc).isoformat(),
    "requested_period_start_utc": "2021-08-20T00:00:00+00:00",
    "requested_period_end_exclusive_utc": "2026-08-20T00:00:00+00:00",
    "interval": "1d",
    "source": "Yahoo Finance chart API",
    "transport": "Yahoo response relayed verbatim through r.jina.ai",
    "time_format": "UNIX seconds as returned by Yahoo Finance",
    "csv_columns": ["time", "open", "high", "low", "close", "Volume"],
    "instruments": [],
}

generated_csvs: list[Path] = []

for output_symbol, yahoo_symbol in SYMBOLS:
    result, source_url, relay_url = fetch_yahoo(yahoo_symbol)
    timestamps = result.get("timestamp") or []
    indicators = result.get("indicators") or {}
    quotes = indicators.get("quote") or []
    if not quotes:
        raise RuntimeError(f"{yahoo_symbol}: no quote indicator")
    quote = quotes[0]
    opens = quote.get("open") or []
    highs = quote.get("high") or []
    lows = quote.get("low") or []
    closes = quote.get("close") or []
    volumes = quote.get("volume") or []

    lengths = {
        "timestamp": len(timestamps),
        "open": len(opens),
        "high": len(highs),
        "low": len(lows),
        "close": len(closes),
        "volume": len(volumes),
    }
    if len(set(lengths.values())) != 1:
        raise RuntimeError(f"{yahoo_symbol}: mismatched arrays {lengths}")

    rows: list[tuple[int, float, float, float, float, int | float | None]] = []
    for ts, opn, high, low, close, volume in zip(
        timestamps, opens, highs, lows, closes, volumes, strict=True
    ):
        if ts is None or opn is None or high is None or low is None or close is None:
            continue
        ts_i = int(ts)
        opn_f = float(opn)
        high_f = float(high)
        low_f = float(low)
        close_f = float(close)
        tolerance = max(abs(opn_f), abs(high_f), abs(low_f), abs(close_f), 1.0) * 1e-9
        if high_f + tolerance < max(opn_f, low_f, close_f):
            raise RuntimeError(f"{yahoo_symbol}: invalid high at {ts_i}")
        if low_f - tolerance > min(opn_f, high_f, close_f):
            raise RuntimeError(f"{yahoo_symbol}: invalid low at {ts_i}")
        rows.append((ts_i, opn_f, high_f, low_f, close_f, volume))

    rows.sort(key=lambda row: row[0])
    if len(rows) < 1200:
        raise RuntimeError(f"{yahoo_symbol}: expected five years; received only {len(rows)} rows")
    clean_times = [row[0] for row in rows]
    if len(clean_times) != len(set(clean_times)):
        raise RuntimeError(f"{yahoo_symbol}: duplicate timestamps")
    if clean_times != sorted(clean_times):
        raise RuntimeError(f"{yahoo_symbol}: timestamps not sorted")

    first_date = utc_date(rows[0][0])
    last_date = utc_date(rows[-1][0])
    if first_date > "2021-08-23":
        raise RuntimeError(f"{yahoo_symbol}: first date too late: {first_date}")
    if last_date < "2026-08-19":
        raise RuntimeError(f"{yahoo_symbol}: last date too early: {last_date}")
    if last_date > "2026-08-19":
        raise RuntimeError(f"{yahoo_symbol}: included an unintended later/partial date: {last_date}")

    filename = f"{output_symbol}, 1D.csv"
    output_path = OUTPUT_DIR / filename
    with output_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        writer.writerow(["time", "open", "high", "low", "close", "Volume"])
        for ts, opn, high, low, close, volume in rows:
            writer.writerow([
                ts,
                fmt_number(opn),
                fmt_number(high),
                fmt_number(low),
                fmt_number(close),
                fmt_number(volume),
            ])

    digest = hashlib.sha256(output_path.read_bytes()).hexdigest()
    generated_csvs.append(output_path)
    manifest["instruments"].append({
        "requested_symbol": output_symbol,
        "yahoo_source_symbol": yahoo_symbol,
        "source_url": source_url,
        "relay_url": relay_url,
        "filename": filename,
        "row_count": len(rows),
        "first_timestamp": rows[0][0],
        "first_date_utc": first_date,
        "last_timestamp": rows[-1][0],
        "last_date_utc": last_date,
        "sha256": digest,
        "validation": {
            "minimum_row_count_passed": True,
            "unique_sorted_timestamps": True,
            "ohlc_integrity": True,
            "coverage_passed": True,
        },
    })
    time.sleep(2)

manifest_path = OUTPUT_DIR / "Yahoo_Finance_5Y_manifest.json"
manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

zip_path = OUTPUT_DIR / "Yahoo_Finance_1D_CSV_exports_5Y.zip"
with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
    for path in generated_csvs:
        archive.write(path, arcname=path.name)
    archive.write(manifest_path, arcname=manifest_path.name)

print(json.dumps(manifest, indent=2))
print(f"Created {zip_path} ({zip_path.stat().st_size} bytes)")
