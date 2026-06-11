export default {
  api: {
    route: import.meta.env.VITE_API_ROUTE ?? '',
    proxyRoute: import.meta.env.VITE_API_PROXY_ROUTE,
  },
};
