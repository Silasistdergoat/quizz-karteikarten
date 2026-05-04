# Anleitung — Karteikarten-Tool

Spickzettel für Mike: wenn du nach einer Pause zurückkommst und nicht mehr weißt, wie alles geht, schau hier rein.

---

## Wo liegt das Projekt?

```
~/Projects/karteikarten-app
```

Die Tilde `~` ist eine Abkürzung für deinen Heimordner (`/Users/Meister`).

## Wie öffne ich das Terminal?

`Cmd` + `Leertaste` → „Terminal" tippen → `Enter`.

## Wie komme ich in den Projektordner?

Im Terminal eintippen und `Enter`:
```
cd ~/Projects/karteikarten-app
```

## Was ist schon installiert?

| Werkzeug | Wofür |
|---|---|
| **Homebrew** | „App Store" der Kommandozeile — installiert andere Programme |
| **Node.js** | Führt JavaScript-Code auf deinem Mac aus |
| **npm** | Lädt fremde Code-Pakete für unser Projekt herunter (kommt mit Node.js) |
| **Git** | Verwaltet Versionen unseres Codes (für den GitHub-Upload in Phase 4) |

Versionen prüfen: `node --version`, `npm --version`, `brew --version`, `git --version`.

---

## Tool starten / stoppen / ändern

### Wie starte ich das Tool?

1. **Terminal öffnen** (`Cmd + Leertaste` → „Terminal" → `Enter`)
2. **In den Projektordner wechseln**:
   ```
   cd ~/Projects/karteikarten-app
   ```
3. **Dev-Server starten**:
   ```
   npm run dev
   ```
4. **Warten**, bis `✓ Ready in …s` erscheint (5–15 Sekunden beim ersten Start)
5. Im Browser [http://localhost:3000](http://localhost:3000) öffnen
6. ⚠️ **Terminal-Fenster offen lassen**, solange du das Tool nutzt — schließt du es, geht der Server aus.

### Wie stoppe ich das Tool?

Im Terminal-Fenster (wo der Server läuft) **`Ctrl + C`** drücken.

- ⚠️ `Ctrl` ist die **Steuerungs-Taste** (nicht Cmd!). Auf der Mac-Tastatur unten links neben Caps Lock.
- Danach landest du wieder beim normalen Eingabe-Prompt (`~/Projects/karteikarten-app %`) → Server ist aus, Port 3000 wieder frei.

### Wie ändere ich etwas am Code?

Die ganze App-Logik liegt in **einer einzigen Datei**:
```
~/Projects/karteikarten-app/app/page.tsx
```

So gehst du vor:
1. Datei mit einem Text-Editor öffnen — empfohlen: **VS Code** (gratis, sehr beliebt → https://code.visualstudio.com). TextEdit geht zur Not auch, ist aber unkomfortabel für Code.
2. Code ändern, mit `Cmd + S` speichern.
3. **Wenn der Dev-Server läuft, lädt der Browser automatisch neu** — du siehst die Änderung sofort. Magisch.
4. Bei Fehlern erscheint eine Meldung im Browser oder im Terminal — meistens steht da auch genau, was falsch ist.

Andere wichtige Dateien (zur Orientierung):

| Datei              | Was drin steht                                       |
|--------------------|------------------------------------------------------|
| `app/page.tsx`     | Die ganze App-Logik (Eingabe, Karten, Quiz)          |
| `app/layout.tsx`   | Browser-Tab-Titel, Sprache, Schriftart               |
| `app/globals.css`  | Globale Stile + Tailwind-Setup                       |
| `package.json`     | Welche Code-Pakete dieses Projekt verwendet          |
| `README.md`        | Projekt-Beschreibung                                 |

---

## Hilfe für die nächste Claude-Code-Sitzung

Wenn du eine neue Claude-Code-Sitzung startest und einfach weitermachen willst, sag:

> *„Lies bitte zuerst `PROJEKT_PLAN.md` und `FORTSCHRITT.md`, dann mach da weiter, wo wir stehen geblieben sind."*

Dort steht alles, was Claude wissen muss, um sofort einsteigen zu können.
