import fs from 'fs-extra';
import axios from 'axios';
import { get as getPath } from 'lodash-es';

export function getConfig() {
  return {
    urls: {
      cards: process.env.PARLASITE_PARLACARDS_URL,
      data: process.env.PARLASITE_PARLADATA_URL,
      cdn: process.env.PARLASITE_PARLASSETS_URL,
      metaImages: process.env.PARLASITE_METAIMAGES_URL,
    },
    defaultLocale: 'sl-obcina-ljubljana', // TODO: move to env var
    leaderId: process.env.PARLASITE_LEADER_ID,
    rootOrgId: process.env.PARLASITE_ROOT_ORG_ID,
    mandateId: process.env.PARLASITE_MANDATE_ID,
    defaultCardDate: process.env.PARLASITE_DEFAULT_CARD_DATE,
    newsletterSegmentId: process.env.PARLASITE_NEWSLETTER_SEGMENT_ID,
  };
}

export function getLocale(overrideLocale) {
  let locale = overrideLocale;
  if (!locale) {
    const config = getConfig();
    locale = config.defaultLocale;
  }
  return locale;
}

export function getSiteMap(overrideLocale) {
  const locale = getLocale(overrideLocale);
  return fs.readJSONSync(`./i18n/${locale}/sitemap.json`);
}

function stringify(object) {
  return typeof object === 'object' ? JSON.stringify(object) : String(object);
}

function stringifyParams(params) {
  if (Object.keys(params).length > 0) {
    const query = Object.keys(params)
      .filter((key) => params[key] != null) // ignore null or undefined
      .map((key) => {
        const val = stringify(params[key]);
        return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
      })
      .join('&');
    return `?${query}`;
  }
  return '';
}

function alertBox(cardPath, errorText, moreInfoText) {
  return `<div class="alert alert-danger" style="margin-top:20px;text-align:left">Failed to fetch card: ${cardPath}<pre>${errorText}</pre><pre>${moreInfoText}</pre></div>`;
}

export async function fetchCard(
  overrideLocale,
  cardPath,
  id,
  extraParams = {}
) {
  return '';

  const { urls, defaultCardDate } = getConfig();
  const locale = getLocale(overrideLocale);

  const params = {
    id,
    template: 'site',
    locale,
    ...extraParams,
  };

  if (!params.date && defaultCardDate) {
    params.date = defaultCardDate;
  }

  const cardUrl = `${urls.cards}${cardPath}${stringifyParams(params)}`;

  // eslint-disable-next-line no-console
  console.log('Fetching card:', cardUrl);

  // TODO: return error card fetching card fails
  try {
    const response = await axios.get(cardUrl);
    return String(response.data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Fetching card FAILED:', error);
    return alertBox(cardPath, cardUrl, error.stack);
  }
}

function expandProps(message, props) {
  let expandedMessage = message;
  Object.keys(props).forEach((key) => {
    expandedMessage = expandedMessage.replaceAll(
      `{${key}}`,
      stringify(props[key])
    );
  });
  return expandedMessage;
}

function isEmptyMessage(value) {
  return value == null || value === '[empty]' || value === '';
}

export function getTranslations(overrideLocale) {
  const locale = getLocale(overrideLocale);

  const messages = fs.readJsonSync(`./i18n/${locale}/defaults.json`);

  const get = (path, props = {}) => {
    const message = messages[path] || getPath(messages, path);
    if (isEmptyMessage(message)) {
      // eslint-disable-next-line no-console
      console.warn(
        `[i18n] Translation value for locale="${locale}" path="${path}" is missing.`
      );
      return path;
    }
    if (typeof message !== 'string') {
      // eslint-disable-next-line no-console
      console.warn(
        `[i18n] Translation value for locale="${locale}" path="${path}" is not a string.`
      );
      return stringify(message);
    }
    return expandProps(message, props);
  };

  get.exists = (path) => {
    const message = messages[path] || getPath(messages, path);
    return !isEmptyMessage(message);
  };

  return get;
}

function idFromSlug(slug) {
  return parseInt(String(slug).split('-')[0], 10);
}

export async function fetchPageData(cardPath, slug) {
  const id = idFromSlug(slug);
  if (id) {
    const { urls } = getConfig();
    try {
      const response = await axios.get(
        `${urls.data}/cards/${cardPath}/?id=${id}`
      );
      return {
        ...response.data,
      };
    } catch (error) {
      // noop
    }
  }
  return null;
}

export function getOgImageUrl(type, params = {}) {
  const { urls, defaultLocale } = getConfig();
  const locale = getLocale(defaultLocale);
  const url = `${urls.metaImages}/${type}`;
  const query = stringifyParams({ theme: locale, ...params });
  return `${url}${query}`;
}
