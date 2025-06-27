def get_upcycling_suggestion(label):
    label = label.lower()
    suggestions = {
        'bottle': 'Recycled into fabric or refillable containers',
        'bag': 'Used in composite bricks or art materials',
        'net': 'Turned into ropes or woven crafts',
        'plastic': 'Processed into reusable pellets',
        'cup': 'Used for insulation filler or plastic lumber'
    }
    for key in suggestions:
        if key in label:
            return suggestions[key]
    return 'No upcycling suggestion available'
