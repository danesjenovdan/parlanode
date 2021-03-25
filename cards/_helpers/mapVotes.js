export default (votes) => {
  // sort and reverse in order to get: for, against, abstain, absent
  const voteKeys = Object.keys(votes).sort().reverse();
  const voteSum = voteKeys.reduce((sum, vote) => sum + votes[vote], 0);

  return voteKeys.map((key) => ({
    percentage: votes[key] / voteSum,
    type: key,
  }));
};
