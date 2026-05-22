# CraftForge Local Development

## Start local dev

```bash
npm install
npx astro check
npm run build
npm run dev
```

## Local D1 database

CraftForge uses Cloudflare D1 with the binding name:

```txt
DB
```

The local database is managed by Wrangler.

## Apply migrations locally

```bash
npx wrangler d1 migrations apply craftforge-db --local
```

## Reset and seed local data

Use the local seed file only for local development.

```bash
npx wrangler d1 execute craftforge-db --local --file seed/local_seed.sql
```

This resets local product and launch pack data, then inserts deterministic test records.

Expected seeded products:

```txt
/products/1
/products/2
/products/3
```

Product 1 should include at least one saved launch pack for testing copy buttons and launch pack display.

## Do not run local seed remotely

Do not run this against remote or production:

```bash
npx wrangler d1 execute craftforge-db --remote --file seed/local_seed.sql
```

The local seed file is destructive and is intended only for local development.

## Useful checks

List local products:

```bash
npx wrangler d1 execute craftforge-db --local --command "SELECT id, name, status FROM products;"
```

List local launch packs:

```bash
npx wrangler d1 execute craftforge-db --local --command "SELECT id, product_id, etsy_title FROM launch_packs;"
```

## Local test flow

After seeding, check:

```txt
/
/products
/products/1
/products/1/edit
/products/new
```

Test:

- create product
- edit product
- change status
- filter product list by status
- generate launch pack
- copy launch pack text
- light/dark theme toggle
