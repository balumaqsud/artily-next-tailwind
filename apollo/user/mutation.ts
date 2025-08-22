import { gql } from "@apollo/client";

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
  mutation Signup($input: MemberInput!) {
    signup(input: $input) {
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
      memberProducts
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

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
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
      memberProducts
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

export const UPDATE_MEMBER = gql`
  mutation UpdateMember($input: MemberUpdate!) {
    updateMember(input: $input) {
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
      memberProducts
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

export const LIKE_TARGET_MEMBER = gql`
  mutation LikeTargetMember($input: String!) {
    likeTargetMember(memberId: $input) {
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
      memberWarnings
      memberBlocks
      memberProducts
      memberArticles
      memberFollowers
      memberFollowing
      memberRank
      memberPoints
      memberLikes
      memberViews
      deletedAt
      createdAt
      updatedAt
      accessToken
    }
  }
`;

/**************************
 *        PRODUCT        *
 *************************/

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
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

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: ProductUpdate!) {
    updateProduct(input: $input) {
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

export const LIKE_TARGET_PRODUCT = gql`
  mutation LikeTargetProduct($productId: String!) {
    likeTargetProduct(productId: $productId) {
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
 *      ARTICLE     *
 *************************/

export const CREATE_BOARD_ARTICLE = gql`
  mutation CreateBoardArticle($input: ArticleInput!) {
    createArticle(input: $input) {
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

export const UPDATE_BOARD_ARTICLE = gql`
  mutation UpdateArticle($input: ArticleUpdate!) {
    updateArticle(input: $input) {
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

export const LIKE_TARGET_BOARD_ARTICLE = gql`
  mutation LikeTargetArticle($input: String!) {
    likeTargetArticle(articleId: $input) {
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

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
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

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($input: CommentUpdate!) {
    updateComment(input: $input) {
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

export const REMOVE_COMMENT = gql`
  mutation RemoveComment($input: String!) {
    removeComment(commentId: $input) {
      _id
      commentStatus
      commentGroup
      commentContent
      commentRefId
      commentLikes
      memberId
      parentCommentId
      createdAt
      updatedAt
    }
  }
`;

/**************************
 *         FOLLOW        *
 *************************/

export const SUBSCRIBE = gql`
  mutation Subscribe($input: String!) {
    subscribe(input: $input) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;

export const UNSUBSCRIBE = gql`
  mutation Unsubscribe($input: String!) {
    unsubscribe(input: $input) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      _id
      orderTotal
      orderDelivery
      orderStatus
      memberId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation UpdateOrder($input: OrderUpdateInput!) {
    updateOrder(input: $input) {
      _id
      orderTotal
      orderDelivery
      orderStatus
      memberId
      createdAt
      updatedAt
    }
  }
`;
