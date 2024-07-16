const url = "http://localhost:5000";
const backendDomain = {
  auth: {
    signup: `${url}/api/auth/signup`,
    login: `${url}/api/auth/login`,
    logout: `${url}/api/auth/logout`,
  },
  user: {
    getUser: `${url}/api/user/me`,
  },
  document: {
    create: `${url}/api/doc/create`,
    created: `${url}/api/doc/created`,
    edited: `${url}/api/doc/edited`,
    update: `${url}/api/doc/update`,
    roomUpdate: `${url}/api/doc/room-update`,
  },
};

export default backendDomain;
