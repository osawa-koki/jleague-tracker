import json
from pathlib import Path
from typing import TypedDict

from bs4 import BeautifulSoup, Tag


class TeamName(TypedDict):
    long_name: str
    short_name: str
    english_name: str


with open(Path(__file__).parent / "./name_mapper.json", "r") as f:
    name_mapper: list[TeamName] = json.load(f)


def find_teams(html: str) -> list[TeamName]:
    soup: Tag = BeautifulSoup(html, "html.parser")
    table: Tag | None = soup.select_one("table.infoTable")
    if table is None:
        return []
    teams = [th.text.strip() for th in table.select("tr th")]
    team_names: list[TeamName] = []
    for team in teams:
        matched_team = next(
            (item for item in name_mapper if item["long_name"] == team), None
        )
        if matched_team is not None:
            team_names.append(matched_team)
        else:
            print(f"No match found for team: {team}")
    return team_names
