const LEGISLATION_STATUSES = {
  enacted: {
    iconClass: 'vote-result--enacted',
    translationKey: 'vote-result--enacted',
  },
  adopted: {
    iconClass: 'vote-result--adopted',
    translationKey: 'vote-result--adopted',
  },
  rejected: {
    iconClass: 'vote-result--rejected',
    translationKey: 'vote-result--rejected',
  },
  retracted: {
    iconClass: 'vote-result--retracted',
    translationKey: 'vote-result--retracted',
  },
  submitted: {
    iconClass: 'vote-result--submitted',
    translationKey: 'vote-result--submitted',
  },
  received: {
    iconClass: 'vote-result--received',
    translationKey: 'vote-result--received',
  },
  in_procedure: {
    iconClass: 'vote-result--in_procedure',
    translationKey: 'vote-result--in_procedure',
  },
};

export default (status) => {
  const key = status || 'in_procedure';
  return LEGISLATION_STATUSES[key] || LEGISLATION_STATUSES.in_procedure;
};
