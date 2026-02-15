#!/usr/bin/env python3
"""
C# File Chunker and Uploader

This script chunks C# files and uploads them to the /api/chunk endpoint.
"""

import argparse
import glob
import json
import re
import sys
import uuid
from pathlib import Path
from typing import List, Dict, Tuple
import requests


# API endpoint constant
API_URL = 'http://localhost:3000/api/chunk'


def extract_chunks(filepath: str) -> Tuple[str, str, List[Dict]]:
    """
    Extract chunks from a C# file.
    
    Returns:
        Tuple of (filename, class_name, chunks)
        where chunks is a list of dicts with 'text' and 'chunk_type'
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    chunks = []
    
    # Try to extract class name - look for actual class declaration, not comments
    # Match: [access modifier] [class modifier] class ClassName
    class_match = re.search(
        r'^\s*(public|internal|private|protected)?\s*(static|abstract|sealed|partial)?\s*class\s+(\w+)',
        content,
        re.MULTILINE
    )
    class_name = class_match.group(3) if class_match else "UnknownClass"
    
    # Split content into lines for processing
    lines = content.split('\n')
    
    i = 0
    class_level_content = []
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Check if this might be the start of XML documentation
        if line.startswith('///') or line.startswith('/**'):
            # Collect XML documentation
            xml_doc_lines = []
            xml_start = i
            
            while i < len(lines) and (lines[i].strip().startswith('///') or 
                                       lines[i].strip().startswith('*') or
                                       lines[i].strip().startswith('/**')):
                xml_doc_lines.append(lines[i])
                i += 1
            
            # Now check if the next non-empty line is a method
            while i < len(lines) and lines[i].strip() == '':
                i += 1
            
            if i < len(lines):
                next_line = lines[i].strip()
                
                # Check if it's a method (has parentheses and opening brace eventually)
                if '(' in next_line and not next_line.startswith('//'):
                    # Collect the method signature (might span multiple lines)
                    method_lines = []
                    method_start = i
                    
                    # Collect until we find the opening brace
                    brace_count = 0
                    found_opening_brace = False
                    
                    while i < len(lines):
                        method_lines.append(lines[i])
                        line_content = lines[i]
                        
                        if '{' in line_content:
                            found_opening_brace = True
                            brace_count += line_content.count('{')
                            brace_count -= line_content.count('}')
                            i += 1
                            break
                        i += 1
                    
                    if found_opening_brace:
                        # Collect the method body
                        while i < len(lines) and brace_count > 0:
                            line_content = lines[i]
                            method_lines.append(line_content)
                            brace_count += line_content.count('{')
                            brace_count -= line_content.count('}')
                            i += 1
                        
                        # Extract method name from signature
                        # Get first few lines of method signature
                        method_signature = ' '.join([l.strip() for l in method_lines[:3]])
                        # Find the identifier immediately before the opening parenthesis
                        method_name_match = re.search(r'\b(\w+)\s*\(', method_signature)
                        method_name = method_name_match.group(1) if method_name_match else "UnknownMethod"
                        
                        # Create a chunk with XML doc + method
                        chunk_text = '\n'.join(xml_doc_lines + method_lines)
                        chunks.append({
                            'text': chunk_text,
                            'chunk_type': 'method',
                            'method_name': method_name
                        })
                        continue
                    else:
                        # Not a method, treat as class-level
                        class_level_content.extend(xml_doc_lines)
                        i = method_start
                else:
                    # Not a method, add to class-level content
                    class_level_content.extend(xml_doc_lines)
        
        # Check if this is a property or field (not in a method)
        elif (('get;' in line or 'set;' in line or line.endswith(';')) and 
              not line.startswith('//') and
              ('public' in line or 'private' in line or 'protected' in line or 'internal' in line)):
            class_level_content.append(lines[i])
            i += 1
        else:
            # Add other lines to class-level content (namespace, using, class declaration, etc.)
            class_level_content.append(lines[i])
            i += 1
    
    # Add class-level content as a separate chunk (if not empty)
    class_level_text = '\n'.join(class_level_content).strip()
    if class_level_text:
        chunks.insert(0, {
            'text': class_level_text,
            'chunk_type': 'class_definition'
        })
    
    return Path(filepath).name, class_name, chunks


def upload_chunk(text: str, metadata: Dict, api_url: str) -> Dict:
    """Upload a chunk to the API endpoint."""
    payload = {
        'text': text,
        'metadata': metadata
    }
    
    response = requests.post(api_url, json=payload, headers={'Content-Type': 'application/json'})
    response.raise_for_status()
    return response.json()


def main():
    parser = argparse.ArgumentParser(description='Chunk and upload C# files to the API')
    parser.add_argument('files', nargs='+', help='C# files to process (supports wildcards like *.cs)')
    parser.add_argument('--test', action='store_true', help='Test mode: print chunks instead of uploading')
    
    args = parser.parse_args()
    
    # Expand wildcards
    all_files = []
    for pattern in args.files:
        expanded = glob.glob(pattern)
        if expanded:
            all_files.extend(expanded)
        else:
            # If no match, treat as literal filename
            all_files.append(pattern)
    
    # Filter for .cs files
    cs_files = [f for f in all_files if f.endswith('.cs')]
    
    if not cs_files:
        print("No .cs files found!")
        sys.exit(1)
    
    print(f"Processing {len(cs_files)} C# file(s)...\n")
    
    for filepath in cs_files:
        try:
            print(f"Processing: {filepath}")
            filename, class_name, chunks = extract_chunks(filepath)
            
            # Generate a unique GUID for this class
            class_guid = str(uuid.uuid4())
            
            print(f"  Class: {class_name}")
            print(f"  Class GUID: {class_guid}")
            print(f"  Chunks: {len(chunks)}")
            
            for idx, chunk in enumerate(chunks):
                metadata = {
                    'filename': filename,
                    'class_name': class_name,
                    'class_guid': class_guid,
                    'chunk_type': chunk['chunk_type'],
                    'chunk_index': idx
                }
                
                # Add method name to metadata if it's a method chunk
                if chunk['chunk_type'] == 'method' and 'method_name' in chunk:
                    metadata['method_name'] = chunk['method_name']
                
                if args.test:
                    print(f"\n  --- Chunk {idx} ({chunk['chunk_type']}) ---")
                    print(f"  Metadata: {json.dumps(metadata, indent=2)}")
                    print(f"  Text preview (first 200 chars):")
                    print(f"  {chunk['text'][:200]}...")
                    print()
                else:
                    try:
                        result = upload_chunk(chunk['text'], metadata, API_URL)
                        print(f"    ✓ Chunk {idx} uploaded (ID: {result.get('id', 'N/A')})")
                    except Exception as e:
                        print(f"    ✗ Failed to upload chunk {idx}: {e}")
            
            print()
            
        except Exception as e:
            print(f"  Error processing {filepath}: {e}")
            print()
    
    print("Done!")


if __name__ == '__main__':
    main()
