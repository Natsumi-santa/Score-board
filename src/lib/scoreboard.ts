import { Team, TeamStanding, QualificationStatus } from '../types';

export function calculateStandings(
  teams: Team[],
  isKillPointEnabled: boolean,
  matchesRemaining: number
): TeamStanding[] {
  // 1. Calculate points for each team
  const teamsWithPoints = teams.map(team => {
    let totalPoints = (team.booyahs * 5) + (team.roundsWon * 1);
    if (isKillPointEnabled) {
      totalPoints += team.kills; // Assuming 1 kill = 1 point if enabled
    }
    return { ...team, totalPoints };
  });

  // 2. Sort teams by total points (descending), then booyahs, then kills
  teamsWithPoints.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.booyahs !== a.booyahs) return b.booyahs - a.booyahs;
    return b.kills - a.kills;
  });

  // 3. Determine the cut-off (6th place points)
  const cutOffRank = 6;
  // If fewer than 6 teams, all might be qualified or just use the last team's points.
  // Here, we'll assign the 6th team's points if available, otherwise 0
  const cutOffPoints = teamsWithPoints.length >= cutOffRank ? teamsWithPoints[cutOffRank - 1].totalPoints : 0;

  // 4. Assign rank and status
  // User prompt mentions "winning the remaining X matches (5 pts each)"
  const maxPossibleExtraPoints = matchesRemaining * 5; 

  return teamsWithPoints.map((team, index) => {
    const rank = index + 1;
    let status: QualificationStatus = 'Eliminated';

    if (rank <= cutOffRank) {
      status = 'Qualified';
    } else {
      const maxPossiblePoints = team.totalPoints + maxPossibleExtraPoints;
      if (maxPossiblePoints >= cutOffPoints) {
        status = 'Contender';
      }
    }

    return {
      ...team,
      rank,
      status
    };
  });
}
