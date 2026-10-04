from fastapi import APIRouter, HTTPException

from ..database import get_db, doc_to_dict
from ..models.replacement import ReplacementRecommendationResponse

router = APIRouter()


@router.get("/{request_id}", response_model=ReplacementRecommendationResponse)
async def get_replacement(request_id: str):
    db = get_db()
    rec = await db.replacement_recommendations.find_one({"request_id": request_id})
    if not rec:
        raise HTTPException(
            status_code=404, detail="Replacement recommendation not found"
        )
    return doc_to_dict(rec)
