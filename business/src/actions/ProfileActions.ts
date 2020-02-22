import { createAction } from "redux-actions";
import { Dispatch, AnyAction } from "redux";
import { GetUserProfilePayload, NetworkRequestState } from "../payload";
import { ObjectFactory, FactoryKeys } from "../loader/kernel";
import { IAccountService, ISettingsProvider, SettingsKey } from "../loader/interfaces";
import { Profile } from "../types";

export const ProfileActions = {
  UPDATE_STATE_GET_USER_PROFILE: "UPDATE_GET_USER_PROFILE"
};

export const updateStateGetUserProfile = createAction<GetUserProfilePayload>(
  ProfileActions.UPDATE_STATE_GET_USER_PROFILE
);

export const getUserProfile = () => {
  return async (dispatch: Dispatch<AnyAction>) => {
    const accountService = ObjectFactory.getObjectInstance<IAccountService>(
      FactoryKeys.IAccountService
    );
    const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
      FactoryKeys.ISettingsProvider
    );

    dispatch(updateStateGetUserProfile({ state: NetworkRequestState.REQUESTING }));
    const token = settings.getValue(SettingsKey.CurrentAccessToken);
    try {
      const profile: Profile | undefined = await accountService.getUserProfile(token);
      if (profile) {
        updateStateGetUserProfile({
          state: NetworkRequestState.SUCCESS,
          data: { profile }
        });
      } else {
        updateStateGetUserProfile({
          state: NetworkRequestState.FAILED,
          error: new Error("Empty profile ")
        });
      }
    } catch (error) {
      updateStateGetUserProfile({ state: NetworkRequestState.FAILED, error });
    }
  };
};
