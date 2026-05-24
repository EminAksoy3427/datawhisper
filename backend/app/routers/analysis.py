from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.db.models import User
from app.schemas.analysis import AnalysisResponse, AskRequest
from app.services.ai_service import analyze_business_question

router = APIRouter(tags=["analysis"])


@router.post("/ask", response_model=AnalysisResponse)
async def ask_question(
    payload: AskRequest,
    _: User = Depends(get_current_user),
) -> AnalysisResponse:
    business_summary = payload.business_summary.model_dump()
    return await analyze_business_question(
        question=payload.question,
        business_summary=business_summary,
    )
