# Fortschritt

Tagebuch dieser Reise — was wann gemacht wurde, was als Nächstes kommt, und welche Stolpersteine aufgetaucht sind.

---

## 2026-05-04 — Phase 1: Setup ✅

**Was passiert ist:**
- Projektordner `~/Projects/karteikarten-app` angelegt
- Werkzeuge geprüft:
  - Homebrew → war noch nicht da → installiert (Version 5.1.8)
  - Node.js → war schon vorhanden (v25.9.0)
  - npm → war auch schon vorhanden (v11.12.1, kommt mit Node.js)
  - Git → war schon vorinstalliert (v2.50.1, kommt vom Mac)
- Die drei Living Documents angelegt: `PROJEKT_PLAN.md`, `FORTSCHRITT.md`, `ANLEITUNG.md`

**Hinweise / Stolpersteine:**
- Bei der Homebrew-Installation fragt der Mac nach dem Login-Passwort. Beim Tippen erscheint **nichts** auf dem Bildschirm — keine Sterne, keine Punkte. Das ist normal!
- Nach der Homebrew-Installation muss man im eigenen Terminal-Fenster das Fenster einmal **schließen und neu öffnen** (oder `source ~/.zprofile` ausführen), damit `brew` dort funktioniert. In Claude Code ist das egal, weil ich Homebrew direkt über den Pfad `/opt/homebrew/bin/brew` anspreche.
- Node.js wurde von Homebrew als „bereits installiert" gemeldet — vermutlich existierte schon eine frühere Installation auf dem System.

---

## 2026-05-04 — Phase 2: Projekt erstellen ✅

**Was passiert ist:**
- Mit `npx create-next-app` ein Next.js 16-Projekt angelegt (TypeScript, Tailwind v4, App Router, ESLint, kein `src/`-Ordner)
- Versionen: Next.js **16.2.4**, React **19.2.4**, Tailwind CSS **4**, TypeScript **5**
- Vor dem Aufruf die drei `.md`-Doku-Dateien kurz nach `/tmp` ausgelagert (`create-next-app` braucht einen leeren Ordner) und danach zurückgeschoben
- `app/page.tsx` komplett neu geschrieben mit vier Bereichen (Schritt 1–4):
  - Eingabe + Modus-Wahl
  - Prompt-Anzeige mit Kopier-Knopf + Claude.ai-Link
  - JSON-Eingabe mit toleranter Parser-Logik (auto-Modus-Erkennung, ` ``` `-Codefence-Toleranz, Format-Validierung)
  - Karteikarten-Anzeige (`KarteikartenAnsicht`): Frage → Antwort zeigen → Nächste, Fortschrittsbalken, Mischen
  - Quiz-Anzeige (`QuizAnsicht`): 4-Optionen-Klick mit grün/rot-Feedback, Punktestand, farbige Auswertung (≥80% grün, ≥50% gelb, sonst rot)
- `app/layout.tsx`: Sprache auf `de`, Browser-Tab-Titel auf „Karteikarten & Quiz"
- `README.md` durch projekt-spezifische deutsche Version ersetzt

**Hinweise / Stolpersteine:**
- Next.js 16 + Tailwind 4 sind neuer als der Wissensstand des Modells — `AGENTS.md` weist explizit darauf hin. Vor dem Coden kurz in `node_modules/next/dist/docs/` reingeschaut, alles funktioniert wie erwartet.
- ESLint hat das ursprüngliche `useEffect`-Reset-Muster bemängelt → auf `key`-Prop-Reset (React-empfohlene Schreibweise) umgestellt.
- Bonus: `create-next-app` hat automatisch ein `.git`-Repo angelegt — schon vorbereitet für Phase 4.

---

## 2026-05-04 — Phase 3: Lokal testen ✅

**Was passiert ist:**
- Dev-Server gestartet mit `npm run dev` — lief auf http://localhost:3000
- Browser geöffnet → Layout sauber dargestellt (heller bzw. dunkler Modus je nach System-Einstellung)
- **Mini-Test 1** — Karteikarten mit Beispiel-JSON: ✓ Frage → Antwort zeigen → Nächste, Mischen, Fortschrittsbalken, Auto-Reset bei neuer JSON
- **Mini-Test 2** — Quiz mit Beispiel-JSON: ✓ 4-Optionen-Klick mit grün/rot-Feedback, Punktestand, farbige Auswertung
- **Mini-Test 3** — Voller Roundtrip mit Claude.ai: ✓ Photosynthese-Text → Prompt generiert → in Claude.ai gepastet → JSON-Antwort zurückkopiert → echte Karteikarten generiert
- `ANLEITUNG.md` mit den richtigen Start/Stopp/Ändern-Befehlen befüllt
- Server mit `Ctrl + C` gestoppt

**Hinweise / Stolpersteine:**
- Beim Stoppen ist `Ctrl + C` die **ctrl-Taste**, nicht Cmd — auf dem Mac ein häufiger Stolperstein.
- Solange der Dev-Server läuft, ist das Terminal-Fenster mit Live-Logs „belegt". Das ist normal — für andere Befehle einfach ein zweites Terminal-Fenster öffnen.

---

## 2026-05-04 — Phase 4: GitHub ✅

**Was passiert ist:**
- GitHub-Account war bereits da: `Silasistdergoat`
- Repository auf github.com angelegt: `quizz-karteikarten`, **public**, ohne automatische README/.gitignore/Lizenz (weil wir die schon lokal hatten)
- Git mit globaler Identität konfiguriert: `Silas Gudioni` / `gudionis@gmail.com`
- Alle Änderungen seit `create-next-app` in einen Commit gepackt (`9f39f63`):
  - `README.md`, `app/layout.tsx`, `app/page.tsx` modifiziert
  - `ANLEITUNG.md`, `FORTSCHRITT.md`, `PROJEKT_PLAN.md` neu hinzugefügt
- GitHub CLI (`gh` 2.92.0) via Homebrew installiert, mit `gh auth login` per Web-Browser-OAuth angemeldet (Token im macOS-Keychain)
- Remote `origin` mit der Repo-URL verbunden, `git push -u origin main` → Code online ✓
- URL: https://github.com/Silasistdergoat/quizz-karteikarten

**Hinweise / Stolpersteine:**
- Lokaler Ordnername (`karteikarten-app`) ≠ GitHub-Repo-Name (`quizz-karteikarten`) — egal, Git stört das nicht.
- Bei der Anmeldung über `gh auth login` muss zwischen Terminal und Browser hin- und her gewechselt werden (Code abtippen / einfügen) — kurz fummelig, aber einmalig.

---

## 2026-05-04 — Phase 5: Vercel-Deployment ✅

**Was passiert ist:**
- Vercel-Account mit „Continue with GitHub" angelegt — kein neues Passwort
- GitHub-App auf Silas's Account installiert, Zugriff nur auf Repo `quizz-karteikarten` (Option *„Only select repositories"* — sicherer als alle freizugeben)
- Repo in Vercel importiert; Next.js wurde automatisch erkannt, alle Build-Einstellungen passend vorgeschlagen
- Projektname auf Vercel: `karteikarten-app-beta` (der ursprünglich gewollte `quizz-karteikarten` war im Account schon belegt)
- Build erfolgreich → Live unter **https://karteikarten-app-beta.vercel.app**
- **Auto-Deploy aktiv**: jeder zukünftige `git push` zu `main` löst automatisch ein neues Deployment aus

**Hinweise / Stolpersteine:**
- Vercel-Projektname muss im eigenen Account eindeutig sein. Nur Kleinbuchstaben, Zahlen, `.` `_` `-`. Bei Konflikt einfach eine Variante wählen.
- Beim GitHub-Permission-Dialog „Only select repositories" wählen → sicherer als „All".

---

## Phase 1–5 abgeschlossen 🎉

Das Projekt ist offiziell fertig:
- 💻 Funktioniert lokal (`npm run dev` → http://localhost:3000)
- ☁️ Code in der Cloud auf GitHub
- 🌐 Live im Internet auf Vercel
- 📱 Auf jedem Gerät erreichbar — Mac, Handy, Tablet, Freunde, Welt

## Optionale nächste Level

1. **Design polish** — Tailwind-Übung. Farben, Animationen, Schriftarten, Dark-Mode-Toggle, Logo. Niedriger Einstieg, sofortige visuelle Belohnung.
2. **Claude direkt eingebaut via API** — großer UX-Sprung: Knopfdruck statt Copy-Paste. Braucht Anthropic-API-Key (kostenpflichtig), eine Server-Funktion auf Vercel zum sicheren Verstecken des Keys, eine Next.js-API-Route. Aufwand ~30–60 Min beim ersten Mal.
