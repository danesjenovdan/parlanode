import axios from 'axios';

const { CancelToken } = axios;

export default {
  data() {
    return {
      cancelRequest: null,
    };
  },
  methods: {
    makeRequest(url) {
      if (this.cancelRequest) {
        this.cancelRequest();
        this.cancelRequest = null;
      }
      const request = axios
        .get(url, {
          cancelToken: new CancelToken((c) => {
            this.cancelRequest = c;
          }),
        })
        .then(
          (response) => {
            this.cancelRequest = null;
            return response;
          },
          (error) => {
            this.cancelRequest = null;
            throw error;
          }
        );
      return {
        then(responseHandler) {
          // catch cancelations to prevent sending them to sentry as errors
          return request.then(responseHandler).catch((error) => {
            if (!axios.isCancel(error)) {
              throw error;
            }
          });
        },
      };
    },
  },
};
