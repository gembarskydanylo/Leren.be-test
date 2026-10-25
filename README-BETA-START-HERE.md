# Поточні тести та майбутнє перенесення

- [Журнал усіх змін і перевірок](TESTING-JOURNAL.md)
- [План перенесення в основний проєкт](PRODUCTION-TRANSFER.md)
- [Навчальний маршрут](GUIDED-LEARNING-PREVIEW.md)

# leren.be — FULL BETA for GitHub Pages

This archive contains the full October 23 application plus the language-first daily-learning beta overlay. It is not a production release.

## Publish
1. Create a **new** public GitHub repository named `Leren.be-Beta`.
2. Upload **the contents** of this ZIP to the repository root. `index.html` must be in the root.
3. Settings > Pages > Deploy from a branch > `main` > `/ (root)` > Save.
4. Open `https://YOUR-USERNAME.github.io/Leren.be-Beta/`.
5. Test the daily learning module from the site. Test UA, EN, FR, AR and refresh.

## Safety
- No `CNAME` is included: do not redirect the beta to lerenbe.com.
- Original GitHub Actions workflows and Cloudflare Worker deployment config are excluded to avoid accidental deployment.
- Firebase/Cloudflare integrations may still point to production endpoints in client code. Avoid real accounts or modifying real data during beta testing until backend isolation is confirmed.
- The new module has only partial translations; full course translation and AI integration are not complete.
- For GitHub Pages, use a separate browser profile if you want to avoid mixing cached state.

This is a complete static application bundle, not an Android Studio project.
