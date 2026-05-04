# Karteikarten & Quiz

Ein einfaches Web-Tool, das aus Text Karteikarten und Multiple-Choice-Quizfragen erzeugt — komplett per Copy-Paste mit Hilfe von Claude.ai. Kein API-Key, keine Server-Logik. Läuft komplett im Browser.

## Workflow

1. Text in das Eingabefeld einfügen, **Modus** wählen (Karteikarten / Quiz).
2. **„Prompt generieren"** klicken — der Prompt erscheint mit Kopier-Knopf.
3. Auf [claude.ai](https://claude.ai) gehen, Prompt einfügen, JSON-Antwort kopieren.
4. JSON unten in das Eingabefeld einfügen, **„Anzeigen"** klicken.
5. Karten durchgehen oder Quiz lösen.

### JSON-Formate

**Karteikarten:**

```json
[{"frage": "…", "antwort": "…"}]
```

**Quiz:**

```json
[{"frage": "…", "optionen": ["A","B","C","D"], "richtige_antwort": 0}]
```

`richtige_antwort` ist der Index 0–3 der korrekten Option.

Der Parser ist tolerant: Markdown-Codeblöcke (` ``` `) um die JSON werden automatisch entfernt, der Modus wird anhand der Felder erkannt.

## Lokale Entwicklung

```bash
npm install      # einmalig: Pakete laden
npm run dev      # Dev-Server starten (Auto-Reload bei Code-Änderungen)
```

Anschließend [http://localhost:3000](http://localhost:3000) im Browser öffnen. Server stoppen mit `Ctrl + C`.

Weitere Befehle:

| Befehl            | Zweck                                  |
|-------------------|----------------------------------------|
| `npm run build`   | Produktions-Build erzeugen             |
| `npm start`       | Produktions-Server starten             |
| `npm run lint`    | Code-Qualität prüfen (ESLint)          |

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- 100 % clientseitig (eine einzige Seite, `app/page.tsx`)

## Projekt-Doku

- **`PROJEKT_PLAN.md`** — Übersicht aller 5 Phasen mit Checkliste
- **`FORTSCHRITT.md`** — Tagebuch: was wann passiert ist, welche Stolpersteine
- **`ANLEITUNG.md`** — Anfänger-Spickzettel zum Starten/Stoppen/Ändern

## Lizenz

Privatprojekt — keine Lizenz festgelegt.
