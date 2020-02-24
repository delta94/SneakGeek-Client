//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { IAccountService } from "../interfaces";
import { AuthProvider } from "../../types";
import { Account, Profile } from "../../model";
import { BaseService } from "./BaseService";
import HttpStatus from "http-status";

export class AccountService extends BaseService implements IAccountService {
  public async emailLogin(
    email: string,
    password: string
  ): Promise<{ user: Account; token: string } | undefined> {
    const response = await this.apiClient.getInstance().post(
      `/account/email-login`,
      { email, password },
      {
        headers: {
          "Access-Control-Request-Method": "POST"
        }
      }
    );

    if (
      response &&
      (response.status === HttpStatus.CREATED || response.status === HttpStatus.OK)
    ) {
      return response.data;
    }

    return undefined;
  }

  public async login(
    token: string,
    provider: AuthProvider
  ): Promise<{ user: Account; token: string } | undefined> {
    const headers = { access_token: token };
    const response = await this.apiClient
      .getInstance()
      .post(`/account/${provider}`, {}, { headers });
    {
    }
    if (
      response &&
      (response.status === HttpStatus.CREATED || response.status === HttpStatus.OK)
    ) {
      return response.data;
    }

    return undefined;
  }
  public async getCurrentUser(
    accessToken: string
  ): Promise<{ user: Account; token: string } | undefined> {
    const headers = { authorization: accessToken };
    const response = await this.apiClient.getInstance().get(`/account/get`, { headers });

    if (response && response.status === HttpStatus.OK) {
      return response.data;
    }

    return undefined;
  }

  public async getUserProfile(accessToken: string): Promise<Profile | undefined> {
    const headers = { authorization: accessToken };
    const response = await this.apiClient.getInstance().get("/profile", { headers });

    if (response && response.status === HttpStatus.OK) {
      return response.data;
    }

    return undefined;
  }
}
