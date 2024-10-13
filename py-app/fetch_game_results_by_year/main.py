import json
from typing import Literal

from team_name import TeamName
from search_matches import search_matches


years = range(2024, 2016, -1)
categories: list[Literal["J1", "J2", "J3"]] = ["J1", "J2", "J3"]

for year in years:
    for category in categories:
        key = f"{year}_{category.lower()}"
        print(f"⭐️ Processing {key}")
        with open(f"./data/teams/{key}.json", "r") as f:
            team_names: list[TeamName] = json.load(f)
        team_statuses = search_matches(team_names, year, category)
        with open(f"./data/team_statuses/{key}.json", "w") as f:
            json.dump([ts.to_object() for ts in team_statuses], f, ensure_ascii=False, indent=2)
