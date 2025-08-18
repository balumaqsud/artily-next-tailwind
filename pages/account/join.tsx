import React, { useCallback, useState } from "react";
import { NextPage } from "next";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
} from "@mui/material";
import { useRouter } from "next/router";
import { logIn, signUp } from "../../libs/auth";
import { sweetMixinErrorAlert } from "../../libs/sweetAlert";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const Join: NextPage = () => {
  const router = useRouter();
  const device = useDeviceDetect();
  const [input, setInput] = useState({
    nick: "",
    password: "",
    phone: "",
    type: "USER",
  });
  const [loginView, setLoginView] = useState<boolean>(true);

  /** HANDLERS **/
  const viewChangeHandler = (state: boolean) => {
    setLoginView(state);
  };

  const checkUserTypeHandler = (e: any) => {
    const checked = e.target.checked;
    if (checked) {
      const value = e.target.name;
      handleInput("type", value);
    } else {
      handleInput("type", "USER");
    }
  };

  const handleInput = useCallback((name: any, value: any) => {
    setInput((prev) => {
      return { ...prev, [name]: value };
    });
  }, []);

  const doLogin = useCallback(async () => {
    console.warn(input);
    try {
      await logIn(input.nick, input.password);
      await router.push(`${router.query.referrer ?? "/"}`);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  }, [input]);

  const doSignUp = useCallback(async () => {
    console.warn(input);
    try {
      await signUp(input.nick, input.password, input.phone, input.type);
      await router.push(`${router.query.referrer ?? "/"}`);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  }, [input]);

  console.log("+input: ", input);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <img
              src="/logo/artly-logo.png"
              alt="Artly logo"
              className="h-40 w-auto m-0 p-0"
            />
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-2">
              {loginView ? "Login" : "Sign Up"}
            </h2>
            <p className="text-gray-600">
              {loginView ? "Login" : "Sign"} in to your Artly account.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter Nickname"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => handleInput("nick", e.target.value)}
              required={true}
              onKeyDown={(event) => {
                if (event.key == "Enter" && loginView) doLogin();
                if (event.key == "Enter" && !loginView) doSignUp();
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => handleInput("password", e.target.value)}
              required={true}
              onKeyDown={(event) => {
                if (event.key == "Enter" && loginView) doLogin();
                if (event.key == "Enter" && !loginView) doSignUp();
              }}
            />
          </div>

          {!loginView && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="text"
                placeholder="Enter Phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => handleInput("phone", e.target.value)}
                required={true}
                onKeyDown={(event) => {
                  if (event.key == "Enter") doSignUp();
                }}
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          {!loginView && (
            <div>
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Register as:
              </span>
              <div className="flex space-x-6">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        name={"USER"}
                        onChange={checkUserTypeHandler}
                        checked={input?.type == "USER"}
                      />
                    }
                    label="Artly User"
                  />
                </FormGroup>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        name={"ARTIST"}
                        onChange={checkUserTypeHandler}
                        checked={input?.type == "ARTIST"}
                      />
                    }
                    label="Artly Artist"
                  />
                </FormGroup>
              </div>
            </div>
          )}

          {loginView && (
            <div className="flex items-center justify-between">
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox defaultChecked size="small" />}
                  label="Remember me on Artly"
                  className="text-sm text-gray-600"
                />
              </FormGroup>
              <a className="text-sm text-blue-600 hover:text-blue-500 cursor-pointer">
                Forgot your Artly password?
              </a>
            </div>
          )}

          {loginView ? (
            <Button
              disabled={input.nick == "" || input.password == ""}
              onClick={doLogin}
              className="w-full h-11 rounded-full bg-[#ff6b81]! p-2 text-base font-semibold text-white hover:bg-[#ff5a73]! cursor-pointer transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              LOGIN
            </Button>
          ) : (
            <Button
              disabled={
                input.nick == "" ||
                input.password == "" ||
                input.phone == "" ||
                input.type == ""
              }
              onClick={doSignUp}
              className="w-full h-11 rounded-full bg-[#ff6b81]! p-2 text-base font-semibold text-white hover:bg-[#ff5a73]! cursor-pointer transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              SIGN UP
            </Button>
          )}
        </div>

        <div className="text-center">
          {loginView ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Not registered yet?{" "}
              <button
                onClick={() => {
                  viewChangeHandler(false);
                }}
                className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
              >
                SIGNUP
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Have account?{" "}
              <button
                onClick={() => viewChangeHandler(true)}
                className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
              >
                LOGIN
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default withLayoutBasic(Join);
