from typing import TypedDict

from bs4 import BeautifulSoup

from .team_name import TeamName
from .team_status import TeamStatus


class Match(TypedDict):
    section: str
    home_team: TeamName
    away_team: TeamName
    home_score: int
    away_score: int


def find_matches(
    team_statuses: list[TeamStatus], team_names: list[TeamName], section: str, html: str
) -> list[Match]:
    soup = BeautifulSoup(html, "html.parser")
    match_trs = soup.select("table.matchTable > tbody > tr")

    matches: list[Match] = []

    for match_tr in match_trs:
        td_status = match_tr.select_one("td.status")
        if td_status is None:
            continue
        status = td_status.text.strip()
        if status != "試合終了":
            continue
        home_team_name_td = match_tr.select_one("td.clubName.leftside")
        if home_team_name_td is None:
            raise ValueError("home_team_name_td is None")
        home_team_name = home_team_name_td.text.strip()
        home_team = next(
            (tn for tn in team_names if tn["short_name"] == home_team_name), None
        )
        home_team_score_td = match_tr.select_one("td.point.leftside")
        if home_team_score_td is None:
            raise ValueError("home_team_score_td is None")
        home_team_score = int(home_team_score_td.text.strip())
        away_team_name_td = match_tr.select_one("td.clubName.rightside")
        if away_team_name_td is None:
            raise ValueError("away_team_name_td is None")
        away_team_name = away_team_name_td.text.strip()
        away_team = next(
            (tn for tn in team_names if tn["short_name"] == away_team_name), None
        )
        away_team_score_td = match_tr.select_one("td.point.rightside")
        if away_team_score_td is None:
            raise ValueError("away_team_score_td is None")
        away_team_score = int(away_team_score_td.text.strip())

        if home_team is None:
            raise ValueError(f"Team not found: {home_team_name}")
        if away_team is None:
            raise ValueError(f"Team not found: {away_team_name}")

        matches.append(
            {
                "section": section,
                "home_team": home_team,
                "away_team": away_team,
                "home_score": home_team_score,
                "away_score": away_team_score,
            }
        )
        pass
    return matches
