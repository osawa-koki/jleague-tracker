from typing import Literal

import requests


# flake8: noqa: C901
def fetch_teams_html_by_year(year: int, category: Literal["J1", "J2", "J3"]) -> str:
    url = f"https://www.jleague.jp/special/schedule/{year}/spring/"
    if category in ["J2", "J3"]:
        url += f"{category.lower()}.html"

    response = requests.get(url)
    response.raise_for_status()
    return response.text
