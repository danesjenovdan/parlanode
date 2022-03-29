export default (session) => {
  const orgNames = session?.organizations?.map((org) => org.name);
  const orgList = orgNames?.length ? ` (${orgNames.join(', ')})` : '';
  return `${session?.name || ''}${orgList}`;
};
