import json
from typing import Literal

from .fetch_teams_html_by_year import fetch_teams_html_by_year
from .find_teams import find_teams

years = range(2024, 2015, -1)
categories: list[Literal["J1", "J2", "J3"]] = ["J1", "J2", "J3"]

for year in years:
    for category in categories:
        html = fetch_teams_html_by_year(year, category)
        teams = find_teams(html)
        key = f"{year}_{category.lower()}"
        with open(f"./data/teams/{key}.json", "w") as f:
            jsonStr = json.dumps(teams, ensure_ascii=False, indent=2)
            f.write(jsonStr)
