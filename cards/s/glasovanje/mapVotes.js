const COLORS = {
  for: '#00628c',
  against: '#009cdd',
  abstain: '#003b54',
  not_present: '#99e1ff',
};

export default (votes) => {
  const voteKeys = Object.keys(votes);
  const voteSum = voteKeys.reduce((sum, vote) => sum + votes[vote], 0);

  return voteKeys.map(key => ({
    percentage: votes[key] / voteSum,
    color: COLORS[key],
  }));
};
