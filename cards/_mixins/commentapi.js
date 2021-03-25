import axios from 'axios';

function commentapi() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const propertyId = '808d5796958a415987c82a74d7214c4a';
  const apiToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODUzMjAyNzksImlhdCI6MTU1Mzc4NDI3OSwic3ViIjoiOTZhZTQzZjQyMTM3NDk1YmI1OGZkMTVlYWI4ZTQ4MzkifQ.hsh7CiyPeKmmZ-F5grscaa9mh42IIXd-fhiNYo9MoqM';

  const backend = axios.create({
    baseURL: 'https://frontmentality.djnd.si/backend/api/v2',
    headers: {
      'api-token': apiToken,
    },
  });

  return {
    createArticle(title, owner = propertyId) {
      return backend.post('/articles/', { title, owner });
    },
    getMostDiscussed() {
      return backend.get(`/properties/most_discussed/${propertyId}`);
    },
  };
}

export default {
  created() {
    const $commentapi = commentapi.call(this);
    Object.defineProperty(this, '$commentapi', {
      get() {
        return $commentapi;
      },
    });
  },
};
