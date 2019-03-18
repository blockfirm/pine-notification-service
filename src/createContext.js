import { ApnQueue } from './apn';

const createContext = (config) => {
  const context = {
    apn: new ApnQueue(config),
    config
  };

  return context;
};

export default createContext;
