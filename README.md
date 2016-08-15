# Logs CLI
CLI tools for enhancing my logs

## Quickstart
```
git clone https://github.com/nezaj/logs-cli
make check
```

## Scripts

### parseFoods
Run it
```
chmod +x scripts/parseFoods.js
./scripts/parseFoods.js [PATH_TO_LOG_FILE]
```
Generates a summary of foods eaten for a given time range. Default values
start from present day and go 6 days back (or one week of data).
See `scripts/parseFoods.js` for more details

### parseMantra
Run it
```
chmod +x scripts/parseMantra.js.js
./scripts/parseFoods.js [PATH_TO_LOG_FILE] [PATH_TO_OUTFILE]
```
Converts daily mantra log into a json file. Meant to be consumed by
mantra dashboard
See `scripts/parseMantra.js` for more details
