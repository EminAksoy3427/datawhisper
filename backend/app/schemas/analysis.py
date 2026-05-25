from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.data import BusinessSummaryResponse

RiskLevel = Literal["low", "medium", "high"]
ChartSuggestion = Literal["bar", "line", "pie", "table"]
Priority = Literal[
    "Bugün kontrol edilmeli",
    "Bu hafta kontrol edilmeli",
    "Takipte kalmalı",
]


class AskRequest(BaseModel):
    question: str = Field(min_length=3, max_length=1000)
    business_summary: BusinessSummaryResponse


class AnalysisResponse(BaseModel):
    # Legacy fields kept for backward compatibility with earlier MVP clients.
    summary: str
    insight: str
    recommendation: str
    risk_level: RiskLevel
    chart_suggestion: ChartSuggestion

    # New business-analyst structured fields.
    headline: str = Field(max_length=160)
    focus_area: str
    priority: Priority
    main_finding: str
    why_it_matters: str
    recommended_actions: list[str] = Field(min_length=3, max_length=3)
    expected_impact: str
    data_to_check: list[str] = Field(min_length=3, max_length=5)
    follow_up_questions: list[str] = Field(min_length=3, max_length=3)
