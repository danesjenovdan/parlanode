import { map, reduce } from 'lodash';

const COLORS = {
  for: '#00628c',
  against: '#009cdd',
  abstain: '#003b54',
  not_present: '#99e1ff',
};

export default (votes) => {
  const voteSum = reduce(votes, ((sum, vote) => sum + vote), 0);
  return map(votes, (voteCount, voteId) => ({
    percentage: voteCount / voteSum,
    color: COLORS[voteId],
  })).filter(vote => vote.percentage !== 0);
};
