from typing import Literal

import requests
from find_matches import find_matches
from team_name import TeamName
from team_status import TeamStatus


def search_matches(
    team_names: list[TeamName], year: int, category: Literal["J1", "J2", "J3"]
) -> list[TeamStatus]:
    team_statuses: list[TeamStatus] = [
        TeamStatus(team_name) for team_name in team_names
    ]
    section = 0
    while True:
        section += 1
        print(f"  - Processing section {section}")
        url = f"https://www.jleague.jp/match/search/?category[]={category.lower()}&year={year}&section=1-{section}"
        response = requests.get(url)
        if "日程・試合結果はありません。" in response.text:
            print("  - No more sections found")
            print(f"  - section ended at {section - 1}")
            break
        html = response.text
        matches = find_matches(team_statuses, team_names, str(section), html)
        for match in matches:
            home_team = match["home_team"]
            away_team = match["away_team"]
            home_score = match["home_score"]
            away_score = match["away_score"]

            home_team_status = next(
                (
                    ts
                    for ts in team_statuses
                    if ts.team_name["short_name"] == home_team["short_name"]
                ),
                None,
            )
            away_team_status = next(
                (
                    ts
                    for ts in team_statuses
                    if ts.team_name["short_name"] == away_team["short_name"]
                ),
                None,
            )
            if home_team_status is None:
                raise ValueError("Home team status not found")
            if away_team_status is None:
                raise ValueError("Away team status not found")
            home_team_status.add_game_result(
                home_score,
                away_score,
                is_home=True,
                opponent_team_name=away_team,
            )
            away_team_status.add_game_result(
                away_score,
                home_score,
                is_home=False,
                opponent_team_name=home_team,
            )

    return team_statuses
