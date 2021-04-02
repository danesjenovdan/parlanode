import { pick } from 'lodash-es';

export default (vote, linkGenerator) => {
  const newVote = pick(vote.results, [
    'tags',
    'text',
    'for',
    'against',
    'abstain',
    'absent',
    'result',
  ]);
  const allInVotes =
    vote.results.for +
    vote.results.against +
    vote.results.abstain +
    vote.results.absent;
  newVote.date = vote.session.date_ts;
  newVote.url = linkGenerator({
    session_id: vote.session.id,
    vote_id: vote.results.motion_id,
  });
  newVote.accepted = `accepted ${vote.results.result ? 'aye' : 'nay'}`;
  newVote.accepted_glyph = `glyphicon glyphicon-${
    vote.results.result ? 'ok' : 'remove'
  }`;
  newVote.percent_for = Math.floor((vote.results.for / allInVotes) * 100);
  newVote.percent_against = Math.floor(
    (vote.results.against / allInVotes) * 100
  );
  newVote.percent_abstain = Math.floor(
    (vote.results.abstain / allInVotes) * 100
  );
  newVote.percent_absent = Math.floor((vote.results.absent / allInVotes) * 100);
  newVote.is_outlier = vote.results.is_outlier || false;
  newVote.has_outliers = vote.results.has_outliers || false;

  return newVote;
};
