from typing import TypedDict

from team_name import TeamName


class GameResult(TypedDict):
    our_score: int
    their_score: int
    is_home: bool
    opponent_team_name: TeamName


class TeamStatus:
    team_name: TeamName
    game_results: list[GameResult]

    def __init__(self, team_name: TeamName):
        self.team_name = team_name
        self.game_results = []

    def add_game_result(
        self,
        our_score: int,
        their_score: int,
        is_home: bool,
        opponent_team_name: TeamName,
    ):
        result: GameResult = {
            "our_score": our_score,
            "their_score": their_score,
            "is_home": is_home,
            "opponent_team_name": opponent_team_name,
        }
        self.game_results.append(result)

    def to_object(self):
        game_results = [
            {
                "our_score": game_result["our_score"],
                "their_score": game_result["their_score"],
                "is_home": game_result["is_home"],
                "opponent_team_name": {
                    "long_name": game_result["opponent_team_name"]["long_name"],
                    "short_name": game_result["opponent_team_name"]["short_name"],
                    "english_name": game_result["opponent_team_name"]["english_name"],
                },
            }
            for game_result in self.game_results
        ]
        return {
            "team_name": {
                "long_name": self.team_name["long_name"],
                "short_name": self.team_name["short_name"],
                "english_name": self.team_name["english_name"],
            },
            "game_results": game_results,
        }
