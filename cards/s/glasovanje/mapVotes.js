export default (votes) => {
  const voteKeys = Object.keys(votes);
  const voteSum = voteKeys.reduce((sum, vote) => sum + votes[vote], 0);

  return voteKeys.map(key => ({
    percentage: votes[key] / voteSum,
    type: key,
  }));
};
