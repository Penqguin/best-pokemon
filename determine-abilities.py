import csv
import re

def js_to_python(js_code):
    # Remove JS function signature and replace with Python
    js_code = re.sub(r'onHit\s*\(([^)]*)\)\s*{', r'def on_hit(\1):', js_code)
    js_code = js_code.replace('?.', '.')
    js_code = js_code.replace(';', '')
    js_code = js_code.replace('{', ':')
    js_code = js_code.replace('}', '')
    js_code = js_code.replace('trySetStatus', 'try_set_status')
    js_code = js_code.replace('addVolatile', 'add_volatile')
    js_code = js_code.replace('target.', 'target.')
    js_code = js_code.replace('source.', 'source.')
    js_code = js_code.replace('move.', 'move.')
    # Indent lines inside the function
    lines = js_code.split('\n')
    for i in range(1, len(lines)):
        lines[i] = '    ' + lines[i].strip()
    return '\n'.join(lines).strip()

with open('data/moves.csv', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    onhit_idx = header.index('Secondary: onHit')
    move_name_idx = header.index('Move Name')
    for row in reader:
        onhit = row[onhit_idx]
        move_name = row[move_name_idx]
        if onhit and 'onHit' in onhit:
            print(f'# Move: {move_name}')
            print(js_to_python(onhit))
            print()