from bs4 import BeautifulSoup, Tag


def find_teams(html: str) -> list[str]:
    soup: Tag = BeautifulSoup(html, "html.parser")
    table: Tag | None = soup.select_one("table.infoTable")
    if table is None:
        return []
    teams = [th.text.strip() for th in table.select("tr th")]
    return teams
