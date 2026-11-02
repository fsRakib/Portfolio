# Portfolio

Personal portfolio of Md. Rakibul Kabir — a single-page static site with a minimal glass UI, dark/light theme and no build step.

**Live:** https://fsrakib.github.io/Portfolio/

## Structure

```
index.html      # all content
css/style.css   # styles and themes
js/main.js      # theme toggle, scroll reveal, nav highlight
js/manager.js   # in-browser admin: add projects, replace CV
images/hero.jpg
CV.pdf
```

## Run locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Updating content

- Edit `index.html` for experience, projects and skills.
- Replace `CV.pdf` to update the downloadable CV for everyone.
- The **Manage** link in the footer adds projects or a CV in *your* browser only (localStorage). The password hash is in `js/manager.js`; generate a new one with `printf 'yourpassword' | sha256sum`. This is a convenience lock, not real security.
