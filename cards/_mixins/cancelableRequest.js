import axios, { CancelToken } from 'axios';

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
      return axios
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
    },
  },
};
