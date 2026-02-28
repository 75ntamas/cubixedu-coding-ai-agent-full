# Coding AI Agent Project

Ez a projekt egy AI-alapú kódolási asszisztenst valósít meg, amely C# matematikai könyvtárak kódbázisáról tud válaszolni kérdésekre.

## Projekt Struktúra

### 🤖 Agent System Prompt
Az AI asszisztens rendszer prompt-ja itt található: [`coding-ai-agent/system-prompt.md`](coding-ai-agent/system-prompt.md)

Ez a fájl határozza meg az agent viselkedését, szabályait és válaszadási stratégiáit.

### 📚 Code Indexer (`code-indexer/`)
**Mit csinál:** Python script, amely C# forrásfájlokat dolgoz fel és darabolja fel (chunk-ol) RAG rendszerekhez optimalizált darabokra, majd feltölti azokat a vektoros adatbázisba. A chunkolás class és method szintű, metaadatokkal gazdagítva.

**Részletes dokumentáció:** [`code-indexer/README.md`](code-indexer/README.md)

### 💬 Coding AI Agent (`coding-ai-agent/`)
**Mit csinál:** Next.js alapú webalkalmazás, amely AI-vezérelt chat felületet biztosít. OpenAI GPT-4-et és Qdrant vektoros adatbázist használ, hogy szemantikus kereséssel válaszoljon a kódbázissal kapcsolatos kérdésekre.

**Részletes dokumentáció:** [`coding-ai-agent/README.md`](coding-ai-agent/README.md)

## Gyors Áttekintés

1. **Indexing folyamat**: A `code-indexer` feldolgozza a C# fájlokat és feltölti a chunk-okat az API-ba
2. **Agent működés**: A `coding-ai-agent` webalkalmazás fogadja a felhasználói kérdéseket, keres a vektoros adatbázisban, és AI-alapú válaszokat generál

## Kódbázis

A [`codebase/`](codebase/) könyvtárban található a feldolgozásra szánt C# matematikai könyvtár forráskódja.

## További Dokumentációk

- [Coding Assistant Concept](coding-assistant-concept.md)
- [Policy Matrix](policy-matrix.md)
