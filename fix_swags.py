import re

# Read the file
with open('pages/swags.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Names to remove
remove_names = ['Vivek Kumar thakur', 'Vivek Kumar Thakur', 'Shaikh Junaid Aziz', 'KIRAN SHIL', 'Kiran Shil']

# Find all winner cards
pattern = r'(<!-- Winner \d+: [^>]+>.*?</div>\s*</div>)'
cards = re.findall(pattern, content, re.DOTALL)

print(f"Found {len(cards)} winner cards")

# Filter out the ones to remove and rebuild with correct rankings
filtered_cards = []
for card in cards:
    should_keep = True
    for name in remove_names:
        if name in card:
            print(f"Removing card with: {name}")
            should_keep = False
            break
    if should_keep:
        filtered_cards.append(card)

print(f"Keeping {len(filtered_cards)} cards")

# Rebuild cards with correct rankings
new_cards = []
for idx, card in enumerate(filtered_cards, 1):
    # Update comment
    card = re.sub(r'<!-- Winner \d+:', f'<!-- Winner {idx}:', card)
    # Update class
    card = re.sub(r'winner-\d+', f'winner-{idx}', card)
    # Update rank circle
    card = re.sub(r'<div class="rank-circle">\d+</div>', f'<div class="rank-circle">{idx}</div>', card)
    new_cards.append(card)

# Find where winners section starts and ends
start_marker = '<!-- Winner 1:'
end_marker = '</div>\n\n            <div class="swags-how-to">'

start_pos = content.find(start_marker)
end_pos = content.find(end_marker)

if start_pos == -1 or end_pos == -1:
    print("Error: Could not find winner section markers")
    exit(1)

# Rebuild content
new_content = content[:start_pos] + '\n'.join(new_cards) + '\n\n            <div class="swags-how-to">' + content[end_pos + len(end_marker):]

# Write back
with open('pages/swags.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Done! Fixed rankings and removed 3 winners")
