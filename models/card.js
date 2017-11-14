var cardSchema = {
    "id": "/Card",
    "type":"object",
    "properties": {
        "id": {"type":"number"},
        "question" : {"type":"string"},
        "answer": {"type":"string"}
    },
    "required":["id","question","answer"]
}

exports.cardSchema = cardSchema;