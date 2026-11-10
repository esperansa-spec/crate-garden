# Beep's Crate Garden

A 3D crate-pushing puzzle for kids. Guide Beep the robot around floating garden islands and push every crate onto its star ring. Twenty gardens across four times of day, from Morning Meadow to Starlight Grove.

**Play:** https://esperansa-spec.github.io/crate-garden/

- Tablet (iPad): open the link in Safari, tap Share, then **Add to Home Screen**.
- Android / PC (Chrome or Edge): open the link, then choose **Install** from the address bar or menu.
- After the first visit it works offline.

Controls: arrow keys or WASD to walk, Q/E or drag to turn the view, Z to undo, R to start over, M for music, Esc for the garden picker. On a touch screen, hold the yellow arrows.

## Credits

Robot and coin models: [Kenney](https://kenney.nl) Starter Kit 3D Platformer, CC0. Font: Fredoka (SIL Open Font License). 3D engine: three.js (MIT). Game, scenery, levels and music: original.

## Rebuilding

```
cd src
npm install
npm run build      # writes ../index.html
```

`src/` holds the source: `game.src.html` (the game), `levels.json` (20 levels; `parPushes` = fewest pushes, used for stars), `assets.js` (the Kenney models, prepared by `strip-models.py`), `fredoka.woff2` (font), `build.js` (inlines models, font and levels), `app-build.js` (bundles three.js into the single offline `index.html`), `level-generator.js` and `minsteps.js` (level design and checking). Bump the `CACHE` name in `sw.js` on each release so installed copies update.
