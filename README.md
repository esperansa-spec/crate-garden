# Beep's Crate Garden

A 3D crate-pushing puzzle for kids. Guide Beep the robot around floating garden islands and push every crate onto its coin pad.

**Play:** https://esperansa-spec.github.io/crate-garden/

- Tablet (iPad): open the link in Safari, tap Share, then **Add to Home Screen**.
- Android / PC (Chrome or Edge): open the link, then choose **Install** from the address bar or menu.
- After the first visit it works offline.

Controls: arrow keys or WASD to walk, Q/E or drag to turn the view, Z to undo, R to start over, M for music.

## Credits

3D models: [Kenney](https://kenney.nl) Starter Kit 3D Platformer, CC0. 3D engine: three.js (MIT). Game, levels and music: original.

## Rebuilding

`src/` holds the source: `game.src.html` (game), `levels.json` (20 levels with `par` = fewest steps), `build.js` (inlines models + levels), `app-build.js` (bundles three.js into a single offline `index.html`), `strip-models.py` (prepares the Kenney models), `level-generator.js` and `minsteps.js` (level design and checking).
