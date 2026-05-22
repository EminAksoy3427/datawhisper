from fastapi import APIRouter, Depends, File, UploadFile

from app.core.security import get_current_user
from app.db.models import User
from app.schemas.data import BusinessSummaryResponse
from app.services.csv_service import analyze_uploaded_csv
from app.services.demo_data_service import get_demo_business_summary

router = APIRouter(tags=["data"])


@router.get("/demo-data", response_model=BusinessSummaryResponse)
def get_demo_data() -> BusinessSummaryResponse:
    summary = get_demo_business_summary()
    return BusinessSummaryResponse.model_validate(summary)


@router.post("/upload-csv", response_model=BusinessSummaryResponse)
async def upload_csv(
    _: User = Depends(get_current_user),
    file: UploadFile = File(...),
) -> BusinessSummaryResponse:
    summary = await analyze_uploaded_csv(file)
    return BusinessSummaryResponse.model_validate(summary)
