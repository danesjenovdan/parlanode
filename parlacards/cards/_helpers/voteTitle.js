function parseVoteTitle(text) {
  const parts = String(text).split('#=#');
  if (parts.length > 1) {
    return {
      title: parts[parts.length - 1].trim(),
      projects: parts[0].split('#+#').map((e) => e.trim()),
    };
  }
  return {
    title: text,
    projects: [],
  };
}

function shortenVoteTitle(text, max = 130) {
  if (text.length > max) {
    return `${text.slice(0, text.lastIndexOf(' ', max))} ...`;
  }
  return text;
}

export { parseVoteTitle, shortenVoteTitle };
