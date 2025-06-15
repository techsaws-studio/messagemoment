import {
  ConnectMongooseDatabase,
  DisconnectMongooseDatabase,
} from "../databases/mongoose-database.js";
import { ConnectRedis, DisconnectRedis } from "../databases/redis-database.js";

export const ConnectAllDatabasesService = async (): Promise<void> => {
  await ConnectMongooseDatabase();
  await ConnectRedis();
};

export const DisconnectAllDatabasesService = async (): Promise<void> => {
  await DisconnectRedis();
  await DisconnectMongooseDatabase();
};
