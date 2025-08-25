import decodeJWT from "jwt-decode";
import { initializeApollo } from "../../apollo/client";
import { userVar } from "../../apollo/store";
import { CustomJwtPayload } from "../types/customJwtPayload";
import { sweetMixinErrorAlert } from "../sweetAlert";
import { LOGIN, SIGN_UP } from "../../apollo/user/mutation";

export function getJwtToken(): string {
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("accessToken");
      // Validate that token is a non-empty string
      if (token && typeof token === "string" && token.trim().length > 0) {
        return token;
      }
      return "";
    } catch (error) {
      console.error("Error getting JWT token from localStorage:", error);
      return "";
    }
  }
  return "";
}

export function isTokenValid(): boolean {
  try {
    const token = getJwtToken();
    if (!token || typeof token !== "string" || token.trim().length === 0) {
      return false;
    }

    // Basic JWT format validation before decoding
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.warn("Invalid JWT token format");
      return false;
    }

    const claims = decodeJWT<CustomJwtPayload>(token);
    if (!claims) return false;

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (claims.exp && claims.exp < currentTime) {
      console.warn("JWT token has expired");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating JWT token:", error);
    return false;
  }
}

export function setJwtToken(token: string) {
  try {
    if (token && typeof token === "string" && token.trim().length > 0) {
      localStorage.setItem("accessToken", token);
    } else {
      console.warn("Attempted to set invalid JWT token:", token);
      localStorage.removeItem("accessToken");
    }
  } catch (error) {
    console.error("Error setting JWT token:", error);
  }
}

export function clearInvalidToken() {
  try {
    localStorage.removeItem("accessToken");
    console.log("Invalid token cleared from localStorage");
  } catch (error) {
    console.error("Error clearing invalid token:", error);
  }
}

export const logIn = async (nick: string, password: string): Promise<void> => {
  try {
    const { jwtToken } = await requestJwtToken({ nick, password });

    if (
      jwtToken &&
      typeof jwtToken === "string" &&
      jwtToken.trim().length > 0
    ) {
      // Validate token format before storing
      const parts = jwtToken.split(".");
      if (parts.length === 3) {
        updateStorage({ jwtToken });
        const success = updateUserInfo(jwtToken);
        if (!success) {
          console.error("Failed to update user info after login");
          clearInvalidToken();
          logOut();
        }
      } else {
        console.error("Invalid JWT token format received from login");
        logOut();
      }
    } else {
      console.error("Invalid JWT token received from login");
      logOut();
    }
  } catch (err) {
    console.warn("login err", err);
    clearInvalidToken();
    logOut();
    // throw new Error('Login Err');
  }
};

const requestJwtToken = async ({
  nick,
  password,
}: {
  nick: string;
  password: string;
}): Promise<{ jwtToken: string }> => {
  const apolloClient = await initializeApollo();

  try {
    const result = await apolloClient.mutate({
      mutation: LOGIN,
      variables: { input: { memberNick: nick, memberPassword: password } },
      fetchPolicy: "network-only",
    });

    console.log("---------- login ----------");
    const { accessToken } = result?.data?.login;

    return { jwtToken: accessToken };
  } catch (err: any) {
    console.log("request token err", err.graphQLErrors);
    if (err.graphQLErrors && err.graphQLErrors.length > 0) {
      switch (err.graphQLErrors[0].message) {
        case "Definer: login and password do not match":
          await sweetMixinErrorAlert("Please check your password again");
          break;
        case "Definer: user has been blocked!":
          await sweetMixinErrorAlert("User has been blocked!");
          break;
      }
    }
    throw new Error("token error");
  }
};

export const signUp = async (
  nick: string,
  password: string,
  phone: string,
  type: string
): Promise<void> => {
  try {
    const { jwtToken } = await requestSignUpJwtToken({
      nick,
      password,
      phone,
      type,
    });

    if (
      jwtToken &&
      typeof jwtToken === "string" &&
      jwtToken.trim().length > 0
    ) {
      // Validate token format before storing
      const parts = jwtToken.split(".");
      if (parts.length === 3) {
        updateStorage({ jwtToken });
        const success = updateUserInfo(jwtToken);
        if (!success) {
          console.error("Failed to update user info after signup");
          clearInvalidToken();
          logOut();
        }
      } else {
        console.error("Invalid JWT token format received from signup");
        logOut();
      }
    } else {
      console.error("Invalid JWT token received from signup");
      logOut();
    }
  } catch (err) {
    console.warn("signup err", err);
    clearInvalidToken();
    logOut();
    // throw new Error('Signup Err');
  }
};

const requestSignUpJwtToken = async ({
  nick,
  password,
  phone,
  type,
}: {
  nick: string;
  password: string;
  phone: string;
  type: string;
}): Promise<{ jwtToken: string }> => {
  const apolloClient = await initializeApollo();

  try {
    const result = await apolloClient.mutate({
      mutation: SIGN_UP,
      variables: {
        input: {
          memberNick: nick,
          memberPassword: password,
          memberPhone: phone,
          memberType: type,
        },
      },
      fetchPolicy: "network-only",
    });

    console.log("---------- signup ----------");
    const { accessToken } = result?.data?.signup;

    return { jwtToken: accessToken };
  } catch (err: any) {
    console.log("request token err", err.graphQLErrors);
    if (err.graphQLErrors && err.graphQLErrors.length > 0) {
      switch (err.graphQLErrors[0].message) {
        case "Definer: login and password do not match":
          await sweetMixinErrorAlert("Please check your password again");
          break;
        case "Definer: user has been blocked!":
          await sweetMixinErrorAlert("User has been blocked!");
          break;
        case "Definer: this member with nick already exist!":
          await sweetMixinErrorAlert("This nickname is already taken!");
          break;
      }
    }
    throw new Error("token error");
  }
};

export const updateStorage = ({ jwtToken }: { jwtToken: any }) => {
  setJwtToken(jwtToken);
  window.localStorage.setItem("login", Date.now().toString());
};

export const updateUserInfo = (jwtToken: any) => {
  if (!jwtToken || typeof jwtToken !== "string") {
    console.warn("Invalid JWT token provided to updateUserInfo:", jwtToken);
    return false;
  }

  // Basic JWT format validation before decoding
  const trimmedToken = jwtToken.trim();
  if (trimmedToken.length === 0) {
    console.warn("Empty JWT token provided to updateUserInfo");
    return false;
  }

  const parts = trimmedToken.split(".");
  if (parts.length !== 3) {
    console.warn("Invalid JWT token format in updateUserInfo");
    return false;
  }

  try {
    const claims = decodeJWT<CustomJwtPayload>(trimmedToken);

    if (!claims) {
      console.warn("Failed to decode JWT token");
      return false;
    }

    userVar({
      _id: claims._id ?? "",
      memberType: claims.memberType ?? "",
      memberStatus: claims.memberStatus ?? "",
      memberAuthType: claims.memberAuthType ?? "",
      memberPhone: claims.memberPhone ?? "",
      memberNick: claims.memberNick ?? "",
      memberFullName: claims.memberFullName ?? "",
      memberImage:
        claims.memberImage === null || claims.memberImage === undefined
          ? "/img/profile/defaultUser.svg"
          : `${claims.memberImage}`,
      memberAddress: claims.memberAddress ?? "",
      memberDesc: claims.memberDesc ?? "",
      memberProducts: claims.memberProducts ?? 0,
      memberFollowers: claims.memberFollowers ?? 0,
      memberFollowing: claims.memberFollowing ?? 0,
      memberRank: claims.memberRank ?? 0,
      memberArticles: claims.memberArticles ?? 0,
      memberPoints: claims.memberPoints ?? 0,
      memberLikes: claims.memberLikes ?? 0,
      memberViews: claims.memberViews ?? 0,
      memberWarnings: claims.memberWarnings ?? 0,
      memberBlocks: claims.memberBlocks ?? 0,
    });

    return true;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    console.error("Token that caused error:", trimmedToken);
    return false;
  }
};

export const logOut = () => {
  deleteStorage();
  deleteUserInfo();
  window.location.reload();
};

export const updateProfileAndRefreshToken = async (
  updateResult: any
): Promise<boolean> => {
  try {
    const updateMemberData = updateResult?.data?.updateMember;

    if (!updateMemberData) {
      console.error("No update member data in response");
      return false;
    }

    // Update user data with the actual response data (not just JWT claims)
    const updatedUserData = {
      _id: updateMemberData._id ?? "",
      memberType: updateMemberData.memberType ?? "",
      memberStatus: updateMemberData.memberStatus ?? "",
      memberAuthType: updateMemberData.memberAuthType ?? "",
      memberPhone: updateMemberData.memberPhone ?? "",
      memberNick: updateMemberData.memberNick ?? "",
      memberFullName: updateMemberData.memberFullName ?? "",
      memberImage: updateMemberData.memberImage ?? "",
      memberAddress: updateMemberData.memberAddress ?? "",
      memberDesc: updateMemberData.memberDesc ?? "",
      memberProducts: updateMemberData.memberProducts ?? 0,
      memberFollowers: updateMemberData.memberFollowers ?? 0,
      memberFollowing: updateMemberData.memberFollowing ?? 0,
      memberRank: updateMemberData.memberRank ?? 0,
      memberArticles: updateMemberData.memberArticles ?? 0,
      memberPoints: updateMemberData.memberPoints ?? 0,
      memberLikes: updateMemberData.memberLikes ?? 0,
      memberViews: updateMemberData.memberViews ?? 0,
      memberWarnings: updateMemberData.memberWarnings ?? 0,
      memberBlocks: updateMemberData.memberBlocks ?? 0,
    };

    // Update the user data immediately with the response data
    userVar(updatedUserData);
    console.log("User data updated with profile changes:", updatedUserData);

    // Check if the update response contains a new access token
    if (updateMemberData.accessToken) {
      const newToken = updateMemberData.accessToken;

      console.log("New access token received from profile update");

      // Validate the new token format
      if (
        newToken &&
        typeof newToken === "string" &&
        newToken.trim().length > 0
      ) {
        const parts = newToken.split(".");
        if (parts.length === 3) {
          // Update the stored token
          updateStorage({ jwtToken: newToken });

          // Reset Apollo client to use new token
          await resetApolloClient();

          console.log("Token refreshed successfully after profile update");
          return true;
        } else {
          console.error(
            "Invalid JWT token format received from profile update"
          );
          return false;
        }
      } else {
        console.error("Invalid access token received from profile update");
        return false;
      }
    } else {
      console.log("No new access token in profile update response");
      return true; // Update successful but no new token
    }
  } catch (error) {
    console.error("Error updating profile and refreshing token:", error);
    return false;
  }
};

// Function to reset Apollo client after token changes
export const resetApolloClient = async (): Promise<void> => {
  try {
    // Import dynamically to avoid circular dependencies
    const { initializeApollo } = await import("../../apollo/client");
    const apolloClient = await initializeApollo();

    // Clear the cache to ensure fresh data with new token
    await apolloClient.clearStore();
    await apolloClient.resetStore();

    console.log("Apollo client reset successfully");
  } catch (error) {
    console.error("Error resetting Apollo client:", error);
  }
};

// Function to force refresh user data from server
export const refreshUserDataFromServer = async (): Promise<boolean> => {
  try {
    // Import dynamically to avoid circular dependencies
    const { initializeApollo } = await import("../../apollo/client");
    const apolloClient = await initializeApollo();

    // Refetch user data by clearing and resetting the store
    await apolloClient.clearStore();
    await apolloClient.resetStore();

    console.log("User data refreshed from server");
    return true;
  } catch (error) {
    console.error("Error refreshing user data from server:", error);
    return false;
  }
};

// Utility function to check and refresh token from any GraphQL response
export const checkAndRefreshTokenFromResponse = async (
  response: any
): Promise<boolean> => {
  try {
    // Check if response contains an access token (common pattern in many mutations)
    const accessToken =
      response?.data?.updateMember?.accessToken ||
      response?.data?.createMember?.accessToken ||
      response?.data?.login?.accessToken ||
      response?.data?.signup?.accessToken;

    if (accessToken) {
      console.log("Access token found in response, refreshing...");
      return await updateProfileAndRefreshToken(response);
    }

    return true; // No token to refresh
  } catch (error) {
    console.error("Error checking token from response:", error);
    return false;
  }
};

// Custom hook for components to automatically handle token refresh
export const useTokenRefresh = () => {
  const handleMutationWithTokenRefresh = async <T>(
    mutationFn: () => Promise<T>
  ): Promise<T> => {
    try {
      const result = await mutationFn();

      // Check if the result contains a new token and refresh if needed
      await checkAndRefreshTokenFromResponse(result);

      return result;
    } catch (error) {
      console.error("Mutation failed:", error);
      throw error;
    }
  };

  return { handleMutationWithTokenRefresh };
};

// Function to handle 401 errors and attempt token refresh
export const handleAuthError = async (): Promise<boolean> => {
  try {
    console.log("Handling authentication error, checking token validity...");

    if (!isTokenValid()) {
      console.log("Token is invalid, clearing and redirecting to login");
      clearInvalidToken();
      deleteUserInfo();
      window.location.href = "/account/join";
      return false;
    }

    // Token is valid but request failed - might need to refresh Apollo client
    await resetApolloClient();
    return true;
  } catch (error) {
    console.error("Error handling auth error:", error);
    return false;
  }
};

const deleteStorage = () => {
  localStorage.removeItem("accessToken");
  window.localStorage.setItem("logout", Date.now().toString());
};

const deleteUserInfo = () => {
  userVar({
    _id: "",
    memberType: "",
    memberStatus: "",
    memberAuthType: "",
    memberPhone: "",
    memberNick: "",
    memberFullName: "",
    memberImage: "",
    memberAddress: "",
    memberDesc: "",
    memberProducts: 0,
    memberFollowers: 0,
    memberFollowing: 0,
    memberRank: 0,
    memberArticles: 0,
    memberPoints: 0,
    memberLikes: 0,
    memberViews: 0,
    memberWarnings: 0,
    memberBlocks: 0,
  });
};
