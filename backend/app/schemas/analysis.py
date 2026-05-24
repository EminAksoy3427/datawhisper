from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.data import BusinessSummaryResponse

RiskLevel = Literal["low", "medium", "high"]
ChartSuggestion = Literal["bar", "line", "pie", "table"]


class AskRequest(BaseModel):
    question: str = Field(min_length=3, max_length=1000)
    business_summary: BusinessSummaryResponse


class AnalysisResponse(BaseModel):
    summary: str
    insight: str
    recommendation: str
    risk_level: RiskLevel
    chart_suggestion: ChartSuggestion
