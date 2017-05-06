import { map, reduce } from 'lodash';

const COLORS = {
  for: '#00628c',
  against: '#009cdd',
  abstain: '#003b54',
  not_present: '#99e1ff',
};

export default (votes) => {
  const voteSum = Object.keys(votes).reduce((sum, vote) => sum + votes[vote], 0);
  const mappedVotes = [];

  for (let key in votes) {
    mappedVotes.push({
      percentage: votes[key] / voteSum,
      color: COLORS[key],
    });
  }

  return mappedVotes;
};
