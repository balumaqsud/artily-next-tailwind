import React, { useCallback, useEffect, useState } from "react";
import { NextPage } from "next";
import axios from "axios";
import { Messages, REACT_APP_API_URL } from "../../config";
import { getJwtToken, updateStorage, updateUserInfo } from "../../auth";
import { useMutation, useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { MemberUpdate } from "../../types/member/member.update";
import { UPDATE_MEMBER } from "../../../apollo/user/mutation";
import { sweetErrorHandling, sweetMixinSuccessAlert } from "../../sweetAlert";

const MyProfile: NextPage = ({ initialValues, ...props }: any) => {
  const token = getJwtToken();
  const user = useReactiveVar(userVar);
  const DEFAULT_UPDATE: MemberUpdate = {
    _id: "",
    memberNick: "",
    memberPhone: "",
    memberAddress: "",
    memberImage: "",
  };
  const [updateData, setUpdateData] = useState<MemberUpdate>(
    initialValues && typeof initialValues === "object"
      ? { ...DEFAULT_UPDATE, ...initialValues }
      : DEFAULT_UPDATE
  );

  /** APOLLO REQUESTS **/
  const [updateMember] = useMutation(UPDATE_MEMBER);

  /** LIFECYCLES **/
  useEffect(() => {
    setUpdateData({
      ...updateData,
      _id: user._id ?? updateData._id,
      memberNick: user.memberNick,
      memberPhone: user.memberPhone,
      memberAddress: user.memberAddress,
      memberImage: user.memberImage,
    });
  }, [user]);

  /** HANDLERS **/
  const uploadImage = async (e: any) => {
    try {
      const image = e.target.files[0];

      const formData = new FormData();
      formData.append(
        "operations",
        JSON.stringify({
          query: `mutation ImageUploader($file: Upload!, $target: String!) {\n            imageUploader(file: $file, target: $target) \n          }`,
          variables: { file: null, target: "member" },
        })
      );
      formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
      formData.append("0", image);

      const response = await axios.post(
        `${REACT_APP_API_URL}/graphql`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "apollo-require-preflight": true,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseImage = response.data.data.imageUploader;
      updateData.memberImage = responseImage;
      setUpdateData({ ...updateData });

      return `${REACT_APP_API_URL}/${responseImage}`;
    } catch (err) {
      console.log("Error, uploadImage:", err);
    }
  };

  const updatePropertyHandler = useCallback(async () => {
    try {
      if (!user?._id) throw new Error(Messages.error2);
      updateData._id = user._id;

      const result = await updateMember({ variables: { input: updateData } });

      // @ts-ignore
      const jwtToken = result.data.updateMember?.accessToken;
      await updateStorage({ jwtToken });
      updateUserInfo(result.data.updateMember?.accessToken);

      await sweetMixinSuccessAlert("Information updated successfully.");
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  }, [updateData]);

  const doDisabledCheck = () => {
    if (
      updateData.memberNick === "" ||
      updateData.memberPhone === "" ||
      updateData.memberAddress === "" ||
      updateData.memberImage === ""
    ) {
      return true;
    }
  };

  return (
    <div id="my-profile-page" className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            My Profile
          </h1>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            We’re glad to see you again!
          </p>
        </div>

        {/* Content card */}
        <div className="space-y-6">
          {/* Photo uploader */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">Photo</h2>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-100">
                <img
                  src={
                    updateData?.memberImage
                      ? `${REACT_APP_API_URL}/${updateData?.memberImage}`
                      : `/img/profile/defaultUser.svg`
                  }
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <input
                  type="file"
                  hidden
                  id="hidden-input"
                  onChange={uploadImage}
                  accept="image/jpg, image/jpeg, image/png"
                />
                <label
                  htmlFor="hidden-input"
                  className="inline-flex cursor-pointer items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Upload Profile Image
                </label>
                <p className="mt-2 text-xs text-gray-500">
                  A photo must be in JPG, JPEG or PNG format.
                </p>
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <label className="text-xs font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                placeholder="Your username"
                value={updateData.memberNick || ""}
                onChange={({ target: { value } }) =>
                  setUpdateData({ ...updateData, memberNick: value })
                }
                className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <label className="text-xs font-medium text-gray-700">Phone</label>
              <input
                type="text"
                placeholder="Your phone"
                value={updateData.memberPhone || ""}
                onChange={({ target: { value } }) =>
                  setUpdateData({ ...updateData, memberPhone: value })
                }
                className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <label className="text-xs font-medium text-gray-700">Address</label>
            <input
              type="text"
              placeholder="Your address"
              value={updateData.memberAddress || ""}
              onChange={({ target: { value } }) =>
                setUpdateData({ ...updateData, memberAddress: value })
              }
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              className="inline-flex items-center rounded-md bg-[#ff6b81] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={updatePropertyHandler}
              disabled={doDisabledCheck()}
            >
              Update Profile
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                className="ml-2"
              >
                <g clipPath="url(#clip0_7065_6985)">
                  <path
                    d="M12.6389 0H4.69446C4.49486 0 4.33334 0.161518 4.33334 0.361122C4.33334 0.560727 4.49486 0.722245 4.69446 0.722245H11.7672L0.105803 12.3836C-0.0352676 12.5247 -0.0352676 12.7532 0.105803 12.8942C0.176321 12.9647 0.268743 13 0.361131 13C0.453519 13 0.545907 12.9647 0.616459 12.8942L12.2778 1.23287V8.30558C12.2778 8.50518 12.4393 8.6667 12.6389 8.6667C12.8385 8.6667 13 8.50518 13 8.30558V0.361122C13 0.161518 12.8385 0 12.6389 0Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_7065_6985">
                    <rect width="13" height="13" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
