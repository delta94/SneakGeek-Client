export declare type Account = {
    isVerified: boolean;
    accessLevel: number;
    _id: string;
    profileId: string;
    createdAt: string;
    updatedAt: string;
    accountProvider: "facebook" | "google";
    accountIdByProvider: string;
    accountNameByProvider: {
        familyName: string;
        givenName: string;
        middleName: string;
    };
    accountGenderByProvider: string;
    accountEmailByProvider: string;
    accountProfilePicByProvider: string;
    isAuthenticating: boolean;
    authenticationError: any;
    isAuthenticatingWithFacebook: boolean;
    isAuthenticationCancelled: boolean;
};
