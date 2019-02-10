import { ApnClient } from './apn';

const createContext = (config) => {
  const context = {
    apn: new ApnClient(config.apn),
    config
  };

  return context;
};

export default createContext;
