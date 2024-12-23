import json
import os
from typing import Literal

from search_matches import search_matches
from team_name import TeamName

years = range(2024, 2016, -1)
categories: list[Literal["J1", "J2", "J3"]] = ["J1", "J2", "J3"]

for year in years:
    for category in categories:
        key = f"{year}_{category.lower()}"
        if os.path.exists(f"./public/team_statuses/{key}.json") and year != max(years):
            print(f"⭐️ {key} already exists. skipping...")
            continue
        print(f"⭐️ Processing {key}")
        with open(f"./public/teams/{key}.json", "r") as f:
            team_names: list[TeamName] = json.load(f)
        team_statuses = search_matches(team_names, year, category)
        with open(f"./public/team_statuses/{key}.json", "w") as f:
            json.dump(
                [ts.to_object() for ts in team_statuses],
                f,
                ensure_ascii=False,
                indent=2,
            )
