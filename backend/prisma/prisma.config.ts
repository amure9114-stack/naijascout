import 'dotenv/config';

export default {
  datasource: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/naijascout'
  }
};