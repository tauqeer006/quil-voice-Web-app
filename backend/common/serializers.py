"""Helpers to turn Mongo documents (with ObjectId/datetime) into JSON-safe dicts."""
from bson import ObjectId
from datetime import datetime


def to_json_safe(doc: dict) -> dict:
    if doc is None:
        return None
    out = {}
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            out[k] = str(v)
        elif isinstance(v, datetime):
            out[k] = v.isoformat()
        elif isinstance(v, list):
            out[k] = [to_json_safe(i) if isinstance(i, dict) else
                       (str(i) if isinstance(i, ObjectId) else i) for i in v]
        elif isinstance(v, dict):
            out[k] = to_json_safe(v)
        else:
            out[k] = v
    if "_id" in doc:
        out["id"] = str(doc["_id"])
    return out
