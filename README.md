# Strowa Online V2

This version fixes the broken package that referenced missing `styles.css`, `app.js`, and `config.js`.

## Files to upload

Upload these two files directly to the ROOT of the GitHub `Strowa` repository:

- `index.html`
- `config.js`

The repository root should look like:

```
Strowa/
├── index.html
└── config.js
```

## 1. Preserve your Supabase settings

Open your existing `config.js` and copy its two real values into the new `config.js`:

```js
window.STROWA_CONFIG = {
  SUPABASE_URL: "https://YOUR_PROJECT.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "YOUR_PUBLISHABLE_OR_ANON_KEY"
};
```

Never use a secret or `service_role` key.

## 2. Optional backend verification

Run `backend_patch.sql` once in Supabase SQL Editor. It refreshes the API schema cache and then calls the list function.

A successful final result may show no rows, or your existing check-ins.

## 3. Replace the GitHub files

Delete the old broken front-end files, or simply overwrite:

- replace `index.html`
- replace `config.js`

This V2 has all CSS and application JavaScript embedded in `index.html`, so missing `styles.css` or `app.js` cannot break it again.

## 4. Wait for GitHub Pages deployment

Open the repository's **Actions** tab and wait for the Pages deployment to finish, then open the Pages URL.

On both phones:
- close the old page completely
- reopen the URL with `?v=2` added once, e.g. `https://yyyayunliu.github.io/Strowa/?v=2`

The top-right badge must say **多人在线**. Tap the badge to see detailed connection status.

## 5. Two-phone test

1. Phone A opens the site and publishes a check-in.
2. Phone B opens the same URL.
3. Phone B presses Refresh, or waits up to 5 seconds.
4. Phone B should see Phone A.
5. Phone B publishes another check-in.
6. Both phones should show two families.

## Diagnostics

- **未配置数据库**: `config.js` is missing or contains placeholders.
- **Supabase 失败**: the Supabase CDN was blocked.
- **数据库错误**: tap the badge for the exact RPC/API error.
- **地图没有加载**: Leaflet or map tiles were blocked; test with mobile data or disable content blocking.
