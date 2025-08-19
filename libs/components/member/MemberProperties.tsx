import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { Pagination, Stack, Typography } from "@mui/material";
import { ProductCard } from "../mypage/ProductCard";
import { Product } from "../../types/product/product";
import { ProductsInquiry } from "../../types/product/product.input";
import { T } from "../../types/common";
import { useRouter } from "next/router";
import { GET_PRODUCTS } from "../../../apollo/user/query";
import { useQuery } from "@apollo/client";

const DEFAULT_INPUT: ProductsInquiry = {
  page: 1,
  limit: 5,
  sort: "createdAt",
  search: {
    memberId: "",
  },
};

const MyProperties: NextPage = ({
  initialInput = DEFAULT_INPUT,
  ...props
}: any) => {
  const router = useRouter();
  const { memberId } = router.query;
  const [searchFilter, setSearchFilter] = useState<ProductsInquiry>({
    ...initialInput,
  });
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);

  /** APOLLO REQUESTS **/
  const {
    loading: getPropertiesLoading,
    data: getPropertiesData,
    error: getPropertiesError,
    refetch: getPropertiesRefetch,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
    variables: { input: searchFilter },
    skip: !searchFilter?.search?.memberId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setSellerProducts(data?.getProducts?.list);
      setTotal(data?.getProducts?.metaCounter[0].total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    getPropertiesRefetch().then();
  }, [searchFilter]);

  useEffect(() => {
    if (memberId)
      setSearchFilter({
        ...initialInput,
        search: { ...initialInput.search, memberId: memberId as string },
      });
  }, [memberId]);

  /** HANDLERS **/
  const paginationHandler = (e: T, value: number) => {
    setSearchFilter({ ...searchFilter, page: value });
  };

  return (
    <div id="member-properties-page">
      <Stack className="main-title-box">
        <Stack className="right-box">
          <Typography className="main-title">Properties</Typography>
        </Stack>
      </Stack>
      <Stack className="properties-list-box">
        <Stack className="list-box">
          {sellerProducts?.length > 0 && (
            <Stack className="listing-title-box">
              <Typography className="title-text">Listing title</Typography>
              <Typography className="title-text">Date Published</Typography>
              <Typography className="title-text">Status</Typography>
              <Typography className="title-text">View</Typography>
            </Stack>
          )}
          {sellerProducts?.length === 0 && (
            <div className={"no-data"}>
              <img src="/img/icons/icoAlert.svg" alt="" />
              <p>No Property found!</p>
            </div>
          )}
          {sellerProducts?.map((product: Product) => {
            return (
              <ProductCard
                product={product}
                memberPage={true}
                key={product?._id.toString()}
              />
            );
          })}

          {sellerProducts.length !== 0 && (
            <Stack className="pagination-config">
              <Stack className="pagination-box">
                <Pagination
                  count={Math.ceil(total / searchFilter.limit)}
                  page={searchFilter.page}
                  shape="circular"
                  color="primary"
                  onChange={paginationHandler}
                />
              </Stack>
              <Stack className="total-result">
                <Typography>{total} property available</Typography>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Stack>
    </div>
  );
};

export default MyProperties;
