CarFact — updated frontend with real API integration

Files:
  - index.html
  - assets/styles.css
  - assets/main.js

Important:
- Configure your API base url by editing the meta tag in index.html:
    <meta name="cf-api-base" content="https://your-api.example.com">
  or by setting window.CF_API_BASE before loading the script.

- Expected API endpoint:
    GET {API_BASE}/lookup?q=<VIN_or_query>&m=<mileage_optional>

  Example response JSON (recommended schema):
  {
    "vin":"JTMBFREV0JD123456",
    "model":"Toyota Prius 2021",
    "mileage":120000,
    "sections":[
      {"id":"next_service","title_ru":"Следующее ТО","title_en":"Next service","content_ru":"Замена масла через 5500 км","content_en":"Oil change in 5500 km"},
      {"id":"oil","title_ru":"Масло","title_en":"Oil","content_ru":"0W-20 — 10000 km","content_en":"0W-20 — 10000 km"},
      {"id":"filters","title_ru":"Фильтры","title_en":"Filters","content_ru":"Воздушный — каждые 30000 км","content_en":"Air filter — every 30000 km"}
    ],
    "notes": "Доп. примечание"
  }

- The frontend will gracefully fallback to older field names:
  nextService, oil, filters, etc., mapping them into accordion sections.

- Language toggle switches UI text and uses title_* and content_* fields from API sections
  (title_ru/title_en and content_ru/content_en). If sections are absent, fallback is used.

- Theme toggle persists selection to localStorage (light/dark).

Next steps I can do for you (pick any):
 - Prepare a small server-side example (Node/Express) that serves the expected /lookup endpoint using your data.
 - Make a PR to your repo with these files (requires write/fork access).
 - Wire GitHub Action to build and publish ZIP/artifact automatically.

