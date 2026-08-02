"""
Builds data/wdi_growth_emissions.json from the raw WDI CSV export.

Source files expected at ../../WDI_CSV/ relative to this script:
  WDICSV.csv, WDICountry.csv

Run: python3 build_data.py
"""
import csv
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
WDI_DIR = os.path.join(SCRIPT_DIR, "..", "..", "WDI_CSV")
OUT_PATH = os.path.join(SCRIPT_DIR, "..", "data", "wdi_growth_emissions.json")

INDICATORS = {
    "NY.GDP.PCAP.PP.KD": "gdpPerCapita",
    "EN.GHG.CO2.PC.CE.AR5": "co2PerCapita",
    "SP.POP.TOTL": "population",
}
TARGET_YEARS = ["1990", "2000", "2010", "2020", "2022"]


def load_countries():
    countries = {}
    with open(os.path.join(WDI_DIR, "WDICountry.csv"), encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            if row["Region"].strip():
                countries[row["Country Code"]] = {
                    "name": row["Table Name"],
                    "region": row["Region"],
                }
    return countries


def build_records(countries):
    records = {}
    with open(os.path.join(WDI_DIR, "WDICSV.csv"), encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            code = row["Indicator Code"]
            cc = row["Country Code"]
            if code not in INDICATORS or cc not in countries:
                continue
            field = INDICATORS[code]
            for year in TARGET_YEARS:
                val = row.get(year, "").strip()
                if val == "":
                    continue
                key = (cc, year)
                records.setdefault(key, {})[field] = float(val)
    return records


def main():
    countries = load_countries()
    print(f"Loaded {len(countries)} real countries")

    records = build_records(countries)

    output = []
    for (cc, year), vals in records.items():
        if not all(k in vals for k in ("gdpPerCapita", "co2PerCapita", "population")):
            continue
        meta = countries[cc]
        output.append({
            "countryCode": cc,
            "countryName": meta["name"],
            "region": meta["region"],
            "year": int(year),
            "gdpPerCapita": round(vals["gdpPerCapita"], 2),
            "co2PerCapita": round(vals["co2PerCapita"], 3),
            "population": int(vals["population"]),
        })

    output.sort(key=lambda r: (r["year"], r["countryName"]))

    by_year = {}
    for r in output:
        by_year[r["year"]] = by_year.get(r["year"], 0) + 1
    for year in sorted(by_year):
        print(f"  {year}: {by_year[year]} countries")

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w") as f:
        json.dump(output, f, separators=(",", ":"))

    size_kb = os.path.getsize(OUT_PATH) / 1024
    print(f"{len(output)} total records written to {OUT_PATH} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
