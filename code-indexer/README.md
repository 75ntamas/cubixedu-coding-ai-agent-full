# C# File Chunker - chunk_cs_files.py

## Áttekintés / Overview
A [`chunk_cs_files.py`](chunk_cs_files.py) egy Python script, amely C# forrásfájlokat dolgoz fel és darabolja fel (chunk-ol) RAG (Retrieval Augmented Generation) rendszerekhez optimalizált darabokra. A script automatikusan feltölti a chunk-okat egy API endpoint-ra.

## Chunkolási logika
A class definiciók kerülnek egy chunk-ba a namespace, using direktívák és az osztály szintû property-ket, 
illetve az osztály minden egyes függvénye az xml dokumentációval egy-egy chunk-ba.
A class-onként egyedi class_guid azonosítja az adott class chunk-jait.
Ezzel a cs fájlokra optimalizált chunk-olási logikával gondolok jobb keresési találatot elérni, a standard chunk-olási eljárasoknál.

## Metaadatok Generálása
Minden chunk-hoz automatikusan generált metaadatok:
```json
{
  "filename": "BasicArithmetic.cs",
  "class_name": "BasicArithmetic",
  "class_guid": "550e8400-e29b-41d4-a716-446655440000",
  "chunk_type": "method",
  "chunk_index": 0
}
```

## Telepítés

### Előfeltételek
- Python 3.6+
- pip csomagkezelő

### Függőségek Telepítése

```bash
pip install -r requirements.txt
```

## Használat

### 1. Egyetlen Fájl Feldolgozása
```bash
python chunk_cs_files.py path/to/MyClass.cs
```

### 2. Több Fájl Feldolgozása
```bash
python chunk_cs_files.py File1.cs File2.cs File3.cs
```

### 3. Wildcard Használata (Összes .cs Fájl egy Könyvtárban)
```bash
python chunk_cs_files.py ../codebase/*.cs
```

### Test Mód

A `--test` flag használatával megtekintheted a chunk-okat **feltöltés nélkül**:

```bash
python chunk_cs_files.py --test MyClass.cs
```
