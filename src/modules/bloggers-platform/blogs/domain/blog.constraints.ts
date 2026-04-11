export const nameConstraints = {
  maxLength: 15,
};

export const descriptionConstraints = {
  maxLength: 500,
};

export const webSiteUrlConstraints = {
  match: /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
};
