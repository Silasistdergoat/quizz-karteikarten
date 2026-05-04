# Projekt-Plan: Karteikarten / Quiz Web-Tool

**Stand:** 2026-05-04

Ein einfaches Web-Tool, das aus eingegebenem Text mit Hilfe von Claude.ai Karteikarten oder Multiple-Choice-Quiz-Fragen erzeugt. Voll Copy-Paste, kein API-Key.

---

## Phase 1 — Setup auf dem Mac ✅
- [x] Prüfen, was schon installiert ist
- [x] Homebrew installieren (Version 5.1.8)
- [x] Node.js + npm installieren (Node v25.9.0 / npm 11.12.1 — beides war nach Homebrew schon da)
- [x] Git geprüft (v2.50.1 — war schon vorinstalliert)
- [x] Living Documents angelegt

## Phase 2 — Projekt erstellen ✅
- [x] Next.js-Projekt mit TypeScript + Tailwind anlegen (Next.js 16.2.4 / React 19.2.4 / Tailwind 4)
- [x] Code für das Karteikarten-Tool schreiben:
  - [x] Texteingabe-Bereich
  - [x] Prompt-Generator + „Kopieren"-Button
  - [x] JSON-Antwort-Eingabe-Bereich (mit tolerantem Parser)
  - [x] Karteikarten-Modus (Frage → „Antwort zeigen" → „Nächste") + Mischen + Fortschrittsbalken
  - [x] Quiz-Modus (Multiple Choice mit grün/rot-Feedback + Auswertung am Ende)
  - [x] Freundliche Fehlermeldung bei kaputtem JSON
- [x] README.md schreiben (auf Deutsch, projekt-spezifisch)
- [x] .gitignore — von `create-next-app` sauber vorgeneriert

## Phase 3 — Lokal testen ✅
- [x] `npm install` (lief automatisch beim `create-next-app`)
- [x] `npm run dev` (Dev-Server lief auf http://localhost:3000)
- [x] Im Browser geöffnet — Layout sauber dargestellt
- [x] Vollen Workflow durchgespielt: Karteikarten + Quiz (mit Beispiel-JSON UND echtem Claude.ai-Roundtrip)
- [x] Server gestoppt mit `Ctrl + C`

## Phase 4 — GitHub
- [ ] GitHub-Account anlegen (falls nicht vorhanden)
- [ ] Git konfigurieren (Name + E-Mail eintragen)
- [ ] Repository auf GitHub erstellen
- [ ] Code hochladen

## Phase 5 — Vercel-Deployment
- [ ] Vercel-Account anlegen
- [ ] GitHub-Repo mit Vercel verbinden
- [ ] Deploy starten
- [ ] Echte URL im Browser testen
- [ ] URL auf dem Handy testen

---

## Tech Stack

- **Next.js** mit App Router (beliebtes Framework für moderne Web-Apps)
- **TypeScript** (JavaScript mit Typ-Prüfung — fängt Fehler früh ab)
- **Tailwind CSS** (CSS-Bibliothek für schnelles, sauberes Design)
- 100 % clientseitig (läuft komplett im Browser, kein eigener Server)

## JSON-Formate

**Karteikarten:**
```json
[{"frage": "...", "antwort": "..."}]
```

**Quiz:**
```json
[{"frage": "...", "optionen": ["A","B","C","D"], "richtige_antwort": 0}]
```
