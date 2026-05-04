"use client";

import { useState } from "react";

type Modus = "karteikarten" | "quiz";
type Karteikarte = { frage: string; antwort: string };
type QuizFrage = { frage: string; optionen: string[]; richtige_antwort: number };

const KARTEIKARTEN_PROMPT_KOPF = `Lies den folgenden Text aufmerksam und erstelle daraus Karteikarten zum Lernen. Jede Karte besteht aus einer kurzen, präzisen Frage und einer klaren Antwort.

Antworte AUSSCHLIESSLICH mit gültigem JSON in genau diesem Format — keinen Fließtext davor oder danach, keinen Markdown-Codeblock:

[{"frage": "...", "antwort": "..."}]

Erstelle so viele Karteikarten, wie der Text sinnvoll hergibt.

Hier der Text:
---
`;

const QUIZ_PROMPT_KOPF = `Lies den folgenden Text aufmerksam und erstelle daraus ein Multiple-Choice-Quiz. Jede Frage hat genau 4 Antwortoptionen, davon ist genau eine richtig.

Antworte AUSSCHLIESSLICH mit gültigem JSON in genau diesem Format — keinen Fließtext davor oder danach, keinen Markdown-Codeblock. "richtige_antwort" ist der Index (0-3) der korrekten Option:

[{"frage": "...", "optionen": ["A","B","C","D"], "richtige_antwort": 0}]

Erstelle so viele Fragen, wie der Text sinnvoll hergibt.

Hier der Text:
---
`;

function generierePrompt(text: string, modus: Modus): string {
  const kopf = modus === "karteikarten" ? KARTEIKARTEN_PROMPT_KOPF : QUIZ_PROMPT_KOPF;
  return kopf + text + "\n---";
}

type ParseErgebnis =
  | { typ: "karteikarten"; daten: Karteikarte[] }
  | { typ: "quiz"; daten: QuizFrage[] }
  | { typ: "fehler"; nachricht: string };

function parseAntwort(text: string): ParseErgebnis {
  let bereinigt = text.trim();
  if (!bereinigt) {
    return { typ: "fehler", nachricht: "Bitte füge die JSON-Antwort von Claude.ai ein." };
  }
  bereinigt = bereinigt
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();
  const klammerMatch = bereinigt.match(/\[[\s\S]*\]/);
  if (klammerMatch) bereinigt = klammerMatch[0];

  let parsed: unknown;
  try {
    parsed = JSON.parse(bereinigt);
  } catch {
    return {
      typ: "fehler",
      nachricht:
        "Konnte JSON nicht lesen. Stelle sicher, dass nur der JSON-Text drin steht (Liste in eckigen Klammern), keine Erklärungen drumherum.",
    };
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    return { typ: "fehler", nachricht: "Die JSON-Antwort enthält keine Liste oder ist leer." };
  }

  const ersterEintrag = parsed[0] as Record<string, unknown>;
  if ("optionen" in ersterEintrag) {
    const ok = parsed.every(
      (q: unknown): q is QuizFrage => {
        const r = q as Record<string, unknown>;
        return (
          !!r &&
          typeof r.frage === "string" &&
          Array.isArray(r.optionen) &&
          r.optionen.length === 4 &&
          r.optionen.every((o) => typeof o === "string") &&
          typeof r.richtige_antwort === "number" &&
          r.richtige_antwort >= 0 &&
          r.richtige_antwort <= 3
        );
      },
    );
    if (!ok) {
      return {
        typ: "fehler",
        nachricht:
          "Quiz-Format stimmt nicht. Jede Frage braucht: 'frage' (Text), 'optionen' (genau 4 Texte) und 'richtige_antwort' (Zahl 0-3).",
      };
    }
    return { typ: "quiz", daten: parsed as QuizFrage[] };
  }

  const ok = parsed.every((k: unknown): k is Karteikarte => {
    const r = k as Record<string, unknown>;
    return !!r && typeof r.frage === "string" && typeof r.antwort === "string";
  });
  if (!ok) {
    return {
      typ: "fehler",
      nachricht:
        "Karteikarten-Format stimmt nicht. Jede Karte braucht: 'frage' (Text) und 'antwort' (Text).",
    };
  }
  return { typ: "karteikarten", daten: parsed as Karteikarte[] };
}

function KarteikartenAnsicht({ karten }: { karten: Karteikarte[] }) {
  const [reihenfolge, setReihenfolge] = useState<number[]>(() =>
    karten.map((_, i) => i),
  );
  const [position, setPosition] = useState(0);
  const [antwortGezeigt, setAntwortGezeigt] = useState(false);

  const aktuell = karten[reihenfolge[position]];
  const istLetzte = position >= karten.length - 1;
  const fortschrittProzent = ((position + 1) / karten.length) * 100;

  function naechste() {
    if (istLetzte) return;
    setPosition((p) => p + 1);
    setAntwortGezeigt(false);
  }

  function vonVorne() {
    setPosition(0);
    setAntwortGezeigt(false);
  }

  function mischen() {
    const neu = [...reihenfolge];
    for (let i = neu.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [neu[i], neu[j]] = [neu[j], neu[i]];
    }
    setReihenfolge(neu);
    setPosition(0);
    setAntwortGezeigt(false);
  }

  if (!aktuell) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-400">
        <span>
          Karte <span className="font-semibold">{position + 1}</span> von{" "}
          {karten.length}
        </span>
        <button
          type="button"
          onClick={mischen}
          className="rounded-md border border-zinc-300 px-2 py-1 text-xs transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          🔀 Mischen
        </button>
      </div>

      <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${fortschrittProzent}%` }}
        />
      </div>

      <div className="flex min-h-48 items-center justify-center rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center dark:border-blue-900 dark:from-blue-950/30 dark:to-blue-900/20">
        <div className="w-full">
          <div className="text-xs font-semibold uppercase tracking-wide text-blue-700/70 dark:text-blue-300/70">
            Frage
          </div>
          <div className="mt-2 text-base font-medium leading-relaxed sm:text-lg">
            {aktuell.frage}
          </div>
          {antwortGezeigt && (
            <div className="mt-5 border-t border-blue-200 pt-4 dark:border-blue-900">
              <div className="text-xs font-semibold uppercase tracking-wide text-blue-700/70 dark:text-blue-300/70">
                Antwort
              </div>
              <div className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                {aktuell.antwort}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {!antwortGezeigt ? (
          <button
            type="button"
            onClick={() => setAntwortGezeigt(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Antwort zeigen
          </button>
        ) : istLetzte ? (
          <button
            type="button"
            onClick={vonVorne}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            ✓ Fertig — Von vorne
          </button>
        ) : (
          <button
            type="button"
            onClick={naechste}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Nächste Karte →
          </button>
        )}
      </div>
    </div>
  );
}

function QuizAnsicht({ fragen }: { fragen: QuizFrage[] }) {
  const [reihenfolge, setReihenfolge] = useState<number[]>(() =>
    fragen.map((_, i) => i),
  );
  const [position, setPosition] = useState(0);
  const [antworten, setAntworten] = useState<(number | null)[]>(() =>
    new Array(fragen.length).fill(null),
  );

  function mischen() {
    const neu = [...reihenfolge];
    for (let i = neu.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [neu[i], neu[j]] = [neu[j], neu[i]];
    }
    setReihenfolge(neu);
    setPosition(0);
    setAntworten(new Array(fragen.length).fill(null));
  }

  function vonVorne() {
    setPosition(0);
    setAntworten(new Array(fragen.length).fill(null));
  }

  function optionWaehlen(optionIndex: number) {
    if (antworten[position] !== null) return;
    const neu = [...antworten];
    neu[position] = optionIndex;
    setAntworten(neu);
  }

  function naechste() {
    setPosition((p) => p + 1);
  }

  const istFertig = position >= fragen.length;

  if (istFertig) {
    const richtig = antworten.reduce<number>((sum, antwort, i) => {
      if (antwort === null) return sum;
      const frageIndex = reihenfolge[i];
      return antwort === fragen[frageIndex].richtige_antwort ? sum + 1 : sum;
    }, 0);
    const prozent = Math.round((richtig / fragen.length) * 100);
    const farbeBox =
      prozent >= 80
        ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
        : prozent >= 50
          ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"
          : "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30";
    const farbeLabel =
      prozent >= 80
        ? "text-emerald-700/70 dark:text-emerald-300/70"
        : prozent >= 50
          ? "text-amber-700/70 dark:text-amber-300/70"
          : "text-rose-700/70 dark:text-rose-300/70";
    return (
      <div>
        <div className={`rounded-xl border p-6 text-center ${farbeBox}`}>
          <div
            className={`text-xs font-semibold uppercase tracking-wide ${farbeLabel}`}
          >
            Auswertung
          </div>
          <div className="mt-2 text-2xl font-bold sm:text-3xl">
            {richtig} von {fragen.length} richtig
          </div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {prozent} %
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={vonVorne}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            ↻ Von vorne
          </button>
          <button
            type="button"
            onClick={mischen}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            🔀 Mischen
          </button>
        </div>
      </div>
    );
  }

  const aktuelleFrage = fragen[reihenfolge[position]];
  const aktuelleAntwort = antworten[position];
  const istLetzte = position >= fragen.length - 1;
  const fortschrittProzent = ((position + 1) / fragen.length) * 100;

  function optionStil(optionIndex: number): string {
    const basis =
      "block w-full rounded-lg border px-3 py-2 text-left text-sm transition disabled:cursor-default";
    if (aktuelleAntwort === null) {
      return `${basis} border-zinc-300 hover:border-blue-400 hover:bg-blue-50 dark:border-zinc-700 dark:hover:border-blue-700 dark:hover:bg-blue-950/30`;
    }
    const istRichtige = optionIndex === aktuelleFrage.richtige_antwort;
    const istGewaehlt = optionIndex === aktuelleAntwort;
    if (istRichtige) {
      return `${basis} border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200`;
    }
    if (istGewaehlt) {
      return `${basis} border-rose-500 bg-rose-50 text-rose-900 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-200`;
    }
    return `${basis} border-zinc-300 text-zinc-500 dark:border-zinc-700 dark:text-zinc-500`;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-400">
        <span>
          Frage <span className="font-semibold">{position + 1}</span> von{" "}
          {fragen.length}
        </span>
        <button
          type="button"
          onClick={mischen}
          className="rounded-md border border-zinc-300 px-2 py-1 text-xs transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          🔀 Mischen
        </button>
      </div>

      <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${fortschrittProzent}%` }}
        />
      </div>

      <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 dark:border-blue-900 dark:from-blue-950/30 dark:to-blue-900/20">
        <div className="text-xs font-semibold uppercase tracking-wide text-blue-700/70 dark:text-blue-300/70">
          Frage
        </div>
        <div className="mt-2 text-base font-medium leading-relaxed sm:text-lg">
          {aktuelleFrage.frage}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {aktuelleFrage.optionen.map((option, i) => (
          <button
            key={i}
            type="button"
            disabled={aktuelleAntwort !== null}
            onClick={() => optionWaehlen(i)}
            className={optionStil(i)}
          >
            <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-semibold text-zinc-700 ring-1 ring-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
              {String.fromCharCode(65 + i)}
            </span>
            {option}
          </button>
        ))}
      </div>

      {aktuelleAntwort !== null && (
        <div className="mt-4">
          <button
            type="button"
            onClick={naechste}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {istLetzte ? "Auswertung →" : "Nächste Frage →"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [eingabeText, setEingabeText] = useState("");
  const [modus, setModus] = useState<Modus>("karteikarten");
  const [generierterPrompt, setGenerierterPrompt] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [ergebnis, setErgebnis] = useState<ParseErgebnis | null>(null);
  const [kopiert, setKopiert] = useState(false);
  const [parseId, setParseId] = useState(0);

  function handleGenerate() {
    if (!eingabeText.trim()) return;
    setGenerierterPrompt(generierePrompt(eingabeText, modus));
    setKopiert(false);
    setErgebnis(null);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(generierterPrompt);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 2000);
    } catch {
      window.prompt("Markiere und kopiere den Prompt von Hand:", generierterPrompt);
    }
  }

  function handleParse() {
    setErgebnis(parseAntwort(jsonText));
    setParseId((g) => g + 1);
  }

  function handleReset() {
    setEingabeText("");
    setGenerierterPrompt("");
    setJsonText("");
    setErgebnis(null);
    setKopiert(false);
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <header className="mb-8 text-center sm:mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Karteikarten &amp; Quiz
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Aus deinem Text → Lernkarten oder Quiz, mit Hilfe von Claude.ai.
          </p>
        </header>

        <section className="mb-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Schritt 1 — Text einfügen &amp; Modus wählen
          </h2>
          <textarea
            value={eingabeText}
            onChange={(e) => setEingabeText(e.target.value)}
            placeholder="Füge hier den Text ein, aus dem Karteikarten oder Quiz-Fragen entstehen sollen…"
            className="block w-full min-h-32 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
          />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <fieldset className="flex gap-2">
              <legend className="sr-only">Modus</legend>
              <label
                className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm transition ${
                  modus === "karteikarten"
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                }`}
              >
                <input
                  type="radio"
                  name="modus"
                  className="sr-only"
                  checked={modus === "karteikarten"}
                  onChange={() => setModus("karteikarten")}
                />
                Karteikarten
              </label>
              <label
                className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm transition ${
                  modus === "quiz"
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                }`}
              >
                <input
                  type="radio"
                  name="modus"
                  className="sr-only"
                  checked={modus === "quiz"}
                  onChange={() => setModus("quiz")}
                />
                Quiz
              </label>
            </fieldset>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!eingabeText.trim()}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Prompt generieren →
            </button>
          </div>
        </section>

        {generierterPrompt && (
          <section className="mb-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Schritt 2 — Prompt kopieren &amp; in Claude.ai einfügen
            </h2>
            <pre className="mb-3 max-h-60 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-zinc-100 p-3 text-xs dark:bg-zinc-800">
              {generierterPrompt}
            </pre>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                {kopiert ? "✓ Kopiert" : "Prompt kopieren"}
              </button>
              <a
                href="https://claude.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Claude.ai öffnen ↗
              </a>
            </div>
          </section>
        )}

        {generierterPrompt && (
          <section className="mb-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Schritt 3 — JSON-Antwort von Claude einfügen
            </h2>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder={`[{"frage": "…", "antwort": "…"}, ...]`}
              className="block w-full min-h-28 rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleParse}
                disabled={!jsonText.trim()}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Anzeigen →
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Zurücksetzen
              </button>
            </div>
            {ergebnis?.typ === "fehler" && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                <strong>Hoppla:</strong> {ergebnis.nachricht}
              </div>
            )}
          </section>
        )}

        {ergebnis && ergebnis.typ !== "fehler" && (
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Schritt 4 — Lernen
            </h2>
            {ergebnis.typ === "karteikarten" && (
              <KarteikartenAnsicht key={parseId} karten={ergebnis.daten} />
            )}
            {ergebnis.typ === "quiz" && (
              <QuizAnsicht key={parseId} fragen={ergebnis.daten} />
            )}
          </section>
        )}
      </main>
    </div>
  );
}
