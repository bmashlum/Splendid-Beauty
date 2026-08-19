from __future__ import annotations

import csv
import json
import time
import urllib.parse
import urllib.request
import zipfile
from datetime import datetime, timezone
from pathlib import Path

PERIOD1 = 1724025600  # 2024-08-19 00:00:00 UTC
PERIOD2 = 1787097600  # 2026-08-19 00:00:00 UTC, exclusive
OUTPUT_DIR = Path("yahoo_exports")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

REQUESTS = [
    ("IWM", ["IWM"]),
    ("DAX", ["^GDAXI"]),
    ("EEM", ["EEM"]),
    ("XOM", ["XOM"]),
    ("XAUUSD", ["XAUUSD=X", "GC=F"]),
]


def yahoo_url(host: str, symbol: str) -> str:
    encoded = urllib.parse.quote(symbol, safe="")
    return (
        f"https://{host}/v8/finance/chart/{encoded}"
        f"?period1={PERIOD1}&period2={PERIOD2}&interval=1d"
        "&includePrePost=false&events=div%2Csplits"
    )


def fetch_symbol(symbol: str) -> tuple[dict, str]:
    errors: list[str] = []
    for host in ("query1.finance.yahoo.com", "query2.finance.yahoo.com"):
        url = yahoo_url(host, symbol)
        for attempt in range(1, 5):
            request = urllib.request.Request(
                url,
                headers={
                    "User-Agent": (
                        "Mozilla/5.0 (X11; Linux x86_64) "
                        "AppleWebKit/537.36 Chrome/151 Safari/537.36"
                    ),
                    "Accept": "application/json,text/plain,*/*",
                },
            )
            try:
                with urllib.request.urlopen(request, timeout=30) as response:
                    payload = json.load(response)
                chart = payload.get("chart", {})
                if chart.get("error"):
                    raise RuntimeError(str(chart["error"]))
                results = chart.get("result") or []
                if not results:
                    raise RuntimeError("Yahoo returned no chart result")
                return results[0], url
            except Exception as exc:
                errors.append(
                    f"{host} attempt {attempt}: {type(exc).__name__}: {exc}"
                )
                time.sleep(attempt * 2)
    raise RuntimeError(f"Unable to download {symbol}: " + " | ".join(errors))


def fetch_first_available(
    candidates: list[str],
) -> tuple[str, dict, str, list[str]]:
    failures: list[str] = []
    for candidate in candidates:
        try:
            result, url = fetch_symbol(candidate)
            return candidate, result, url, failures
        except Exception as exc:
            failures.append(f"{candidate}: {exc}")
    raise RuntimeError("; ".join(failures))


def fmt_price(value: float | int | None) -> str:
    if value is None:
        return ""
    return f"{float(value):.10f}".rstrip("0").rstrip(".")


def utc_date(timestamp: int) -> str:
    return datetime.fromtimestamp(timestamp, tz=timezone.utc).date().isoformat()


manifest: dict[str, object] = {
    "generated_at_utc": datetime.now(timezone.utc).isoformat(),
    "requested_period_start_utc": "2024-08-19T00:00:00+00:00",
    "requested_period_end_exclusive_utc": "2026-08-19T00:00:00+00:00",
    "interval": "1d",
    "source": "Yahoo Finance chart API",
    "time_format": "UNIX seconds as returned by Yahoo Finance chart API",
    "csv_columns": ["time", "open", "high", "low", "close", "Volume"],
    "instruments": [],
}

generated_files: list[Path] = []

for output_symbol, candidates in REQUESTS:
    source_symbol, result, source_url, prior_failures = fetch_first_available(
        candidates
    )
    timestamps = result.get("timestamp") or []
    indicators = result.get("indicators") or {}
    quotes = indicators.get("quote") or []
    if not quotes:
        raise RuntimeError(f"{source_symbol}: no quote indicator")
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
        raise RuntimeError(f"{source_symbol}: mismatched array lengths {lengths}")

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
        tolerance = (
            max(abs(high_f), abs(low_f), abs(opn_f), abs(close_f), 1.0) * 1e-9
        )
        if high_f + tolerance < max(opn_f, close_f, low_f):
            raise RuntimeError(f"{source_symbol}: invalid high at {ts_i}")
        if low_f - tolerance > min(opn_f, close_f, high_f):
            raise RuntimeError(f"{source_symbol}: invalid low at {ts_i}")
        rows.append((ts_i, opn_f, high_f, low_f, close_f, volume))

    rows.sort(key=lambda row: row[0])
    if not rows:
        raise RuntimeError(f"{source_symbol}: no complete OHLC rows")
    if len(rows) < 450:
        raise RuntimeError(
            f"{source_symbol}: expected roughly two years, got only {len(rows)} rows"
        )
    timestamps_clean = [row[0] for row in rows]
    if len(timestamps_clean) != len(set(timestamps_clean)):
        raise RuntimeError(f"{source_symbol}: duplicate timestamps")
    if timestamps_clean != sorted(timestamps_clean):
        raise RuntimeError(f"{source_symbol}: timestamps not sorted")

    first_date = utc_date(rows[0][0])
    last_date = utc_date(rows[-1][0])
    if first_date > "2024-08-20":
        raise RuntimeError(f"{source_symbol}: first date too late: {first_date}")
    if last_date < "2026-08-17":
        raise RuntimeError(f"{source_symbol}: last date too early: {last_date}")

    filename = f"{output_symbol}, 1D.csv"
    output_path = OUTPUT_DIR / filename
    with output_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        writer.writerow(["time", "open", "high", "low", "close", "Volume"])
        for ts, opn, high, low, close, volume in rows:
            if volume is None:
                volume_text = ""
            elif float(volume).is_integer():
                volume_text = str(int(volume))
            else:
                volume_text = fmt_price(volume)
            writer.writerow(
                [
                    ts,
                    fmt_price(opn),
                    fmt_price(high),
                    fmt_price(low),
                    fmt_price(close),
                    volume_text,
                ]
            )
    generated_files.append(output_path)

    manifest["instruments"].append(
        {
            "requested_symbol": output_symbol,
            "yahoo_source_symbol": source_symbol,
            "source_url": source_url,
            "fallback_used": source_symbol != candidates[0],
            "prior_candidate_failures": prior_failures,
            "filename": filename,
            "row_count": len(rows),
            "first_timestamp": rows[0][0],
            "first_date_utc": first_date,
            "last_timestamp": rows[-1][0],
            "last_date_utc": last_date,
            "validation": {
                "minimum_row_count_passed": True,
                "unique_sorted_timestamps": True,
                "ohlc_integrity": True,
            },
        }
    )

manifest_path = OUTPUT_DIR / "Yahoo_Finance_2Y_manifest.json"
manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
generated_files.append(manifest_path)

zip_path = OUTPUT_DIR / "Yahoo_Finance_1D_CSV_exports_2Y.zip"
with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
    for path in generated_files:
        archive.write(path, arcname=path.name)

print(json.dumps(manifest, indent=2))
print(f"Created {zip_path} ({zip_path.stat().st_size} bytes)")
