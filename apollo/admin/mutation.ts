import { gql } from "@apollo/client";

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
  mutation UpdateMemberByAdmin($input: MemberUpdate!) {
    updateMemberByAdmin(input: $input) {
      _id
      memberType
      memberStatus
      memberAuthType
      memberPhone
      memberNick
      memberFullName
      memberImage
      memberAddress
      memberDesc
      memberProperties
      memberArticles
      memberFollowers
      memberFollowing
      memberPoints
      memberLikes
      memberViews
      memberComments
      memberRank
      memberWarnings
      memberBlocks
      deletedAt
      createdAt
      updatedAt
      accessToken
    }
  }
`;

/**************************
 *        PROPERTY        *
 *************************/

export const UPDATE_PRODUCT_BY_ADMIN = gql`
  mutation UpdateProductByAdmin($input: ProductUpdate!) {
    updateProductByAdmin(input: $input) {
      _id
      productType
      productCategory
      productStatus
      productTags
      productLocation
      productShippingTime
      productTitle
      productPrice
      productViews
      productLikes
      productComments
      productRank
      productImages
      productMaterials
      productColor
      productDesc
      productShippingCost
      productWrapAvailable
      productPersonalizable
      productStock
      productSlug
      memberId
      soldAt
      deletedAt
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_PROPERTY_BY_ADMIN = gql`
  mutation RemoveProductByAdmin($input: String!) {
    removeProductByAdmin(productId: $input) {
      _id
      productType
      productCategory
      productStatus
      productTags
      productLocation
      productShippingTime
      productTitle
      productPrice
      productViews
      productLikes
      productComments
      productRank
      productImages
      productMaterials
      productColor
      productDesc
      productShippingCost
      productWrapAvailable
      productPersonalizable
      productStock
      productSlug
      memberId
      soldAt
      deletedAt
      createdAt
      updatedAt
    }
  }
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
  mutation UpdateArticleByAdmin($input: ArticleUpdate!) {
    updateArticleByAdmin(input: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
      articleImage
      articleViews
      articleLikes
      articleComments
      memberId
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
  mutation RemoveBoardArticle($input: String!) {
    removeBoardArticle(articleId: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
      articleImage
      articleViews
      articleLikes
      articleComments
      memberId
      createdAt
      updatedAt
    }
  }
`;

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
  mutation RemoveCommentByAdmin($input: String!) {
    removeCommentByAdmin(commentId: $input) {
      _id
      commentStatus
      commentGroup
      commentContent
      commentRefId
      memberId
      createdAt
      updatedAt
    }
  }
`;
