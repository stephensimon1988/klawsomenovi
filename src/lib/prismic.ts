import * as prismic from '@prismicio/client';

// Users should set their Prismic repo name here
const repositoryName = import.meta.env.VITE_PRISMIC_REPOSITORY_NAME || 'your-repo-name';

export const prismicClient = prismic.createClient(repositoryName, {
  accessToken: import.meta.env.VITE_PRISMIC_ACCESS_TOKEN,
});

export { prismic };
