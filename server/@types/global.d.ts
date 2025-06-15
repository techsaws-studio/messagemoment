import { Connection } from "mongoose";

declare global {
  var mongooseConnection: Connection | undefined;
}

declare module "ipinfo" {
  interface IPInfo {
    ip: string;
    city?: string;
    region?: string;
    country?: string;
    loc?: string;
  }

  import { Connection } from "mongoose";

  declare global {
    var mongooseConnection: Connection | undefined;
  }

  declare module "ipinfo" {
    interface IPInfo {
      ip: string;
      city?: string;
      region?: string;
      country?: string;
      loc?: string;
    }

    interface IPInfoClient {
      lookup(ip: string): Promise<IPInfo>;
    }

    export function createClient(config: { token: string }): IPInfoClient;
  }

  declare module "mongoose" {
    interface Connection {
      db: {
        command(command: Record<string, any>): Promise<any>;
        admin(): {
          ping(): Promise<any>;
        };
      };
    }
  }

  interface IPInfoClient {
    lookup(ip: string): Promise<IPInfo>;
  }

  export function createClient(config: { token: string }): IPInfoClient;
}
