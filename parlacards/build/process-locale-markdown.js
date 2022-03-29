import { Remarkable } from 'remarkable';

const md = new Remarkable();

const processLocaleMarkdown = (messages) => {
  if (messages?.card?.info) {
    messages.card.info = md.render(messages.card.info);
  }
  return messages;
};

// eslint-disable-next-line import/prefer-default-export
export { processLocaleMarkdown };
