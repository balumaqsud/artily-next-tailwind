import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import MyProducts from "../../libs/components/mypage/MyProducts";
import MyFavorites from "../../libs/components/mypage/MyFavorites";
import RecentlyVisited from "../../libs/components/mypage/RecentlyVisited";
import AddProperty from "../../libs/components/mypage/AddNewProduct";
import MyProfile from "../../libs/components/mypage/MyProfile";
import MyArticles from "../../libs/components/mypage/MyArticles";
import { useMutation, useReactiveVar } from "@apollo/client";
import { userVar } from "../../apollo/store";
import MyMenu from "../../libs/components/mypage/MyMenu";
import WriteArticle from "../../libs/components/mypage/WriteArticle";
import MemberFollowers from "../../libs/components/member/MemberFollowers";
import {
  sweetErrorHandling,
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/sweetAlert";
import MemberFollowings from "../../libs/components/member/MemberFollowings";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  LIKE_TARGET_MEMBER,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from "../../apollo/user/mutation";
import { Messages } from "../../libs/config";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const MyPage: NextPage = () => {
  const user = useReactiveVar(userVar);
  const router = useRouter();
  const category: any = router.query?.category ?? "myProfile";

  /** APOLLO REQUESTS **/
  const [subscribe] = useMutation(SUBSCRIBE);
  const [unsubscribe] = useMutation(UNSUBSCRIBE);
  const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

  /** LIFECYCLES **/
  useEffect(() => {
    if (!user._id) router.push("/").then();
  }, [user]);

  /** HANDLERS **/
  const subscribeHandler = async (id: string, refetch: any, query: any) => {
    try {
      console.log("id:", id);
      if (!id) throw new Error(Messages.error1);
      if (!user?._id) throw new Error(Messages.error2);

      await subscribe({
        variables: {
          input: id,
        },
      });

      await sweetTopSmallSuccessAlert("Subscribed!", 800);
      await refetch({ input: query });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
    try {
      if (!id) throw new Error(Messages.error1);
      if (!user?._id) throw new Error(Messages.error2);

      await unsubscribe({
        variables: {
          input: id,
        },
      });

      await sweetTopSmallSuccessAlert("Unsubscribed!", 800);
      await refetch({ input: query });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const likeMemberHandler = async (id: string, refetch: any, query: any) => {
    try {
      if (!id) return;
      if (!user?._id) throw new Error(Messages.error2);

      await likeTargetMember({
        variables: {
          input: id,
        },
      });

      await sweetTopSmallSuccessAlert("Success!", 800);
      await refetch({ input: query });
    } catch (err: any) {
      console.log("ERROR, likeMemberHandler:", err.message);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  const redirectToMemberPageHandler = async (memberId: string) => {
    try {
      if (memberId === user?._id)
        await router.push(`/mypage?memberId=${memberId}`);
      else await router.push(`/member?memberId=${memberId}`);
    } catch (error) {
      await sweetErrorHandling(error);
    }
  };

  return (
    <div id="my-page" className="w-full" style={{ position: "relative" }}>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <aside className="md:col-span-3">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <MyMenu />
            </div>
          </aside>

          <section className="md:col-span-9">
            <div className="space-y-6">
              {category === "addProperty" && <AddProperty />}
              {category === "myProperties" && <MyProducts />}
              {category === "myFavorites" && <MyFavorites />}
              {category === "recentlyVisited" && <RecentlyVisited />}
              {category === "myArticles" && <MyArticles />}
              {category === "writeArticle" && <WriteArticle />}
              {category === "myProfile" && <MyProfile />}
              {category === "followers" && (
                <MemberFollowers
                  subscribeHandler={subscribeHandler}
                  likeMemberHandler={likeMemberHandler}
                  unsubscribeHandler={unsubscribeHandler}
                  redirectToMemberPageHandler={redirectToMemberPageHandler}
                />
              )}
              {category === "followings" && (
                <MemberFollowings
                  likeMemberHandler={likeMemberHandler}
                  subscribeHandler={subscribeHandler}
                  unsubscribeHandler={unsubscribeHandler}
                  redirectToMemberPageHandler={redirectToMemberPageHandler}
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default withLayoutBasic(MyPage);
