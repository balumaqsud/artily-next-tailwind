import { gql } from "@apollo/client";

/**************************
 *         MEMBER         *
 *************************/

export const GET_ARTISTS = gql`
  query GetSellers($input: SellersInquiry!) {
    getSellers(input: $input) {
      list {
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
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_MEMBER = gql(`
query GetMember($input: String!) {
    getMember(memberId: $input) {
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
        meLiked {
            memberId
            likeRefId
            myFavorite
        }
        meFollowed {
            followingId
            followerId
            myFollowing
        }
    }
}
`);

/**************************
 *        PRODUCT        *
 *************************/

export const GET_PRODUCT = gql`
  query GetProduct($input: String!) {
    getProduct(productId: $input) {
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
      memberData {
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
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($input: ProductsInquiry!) {
    getProducts(input: $input) {
      list {
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
        memberData {
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
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_ARTIST_PRODUCTS = gql`
  query GetSellerProducts($input: SellerProductsInquiry!) {
    getSellerProducts(input: $input) {
      list {
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
        memberData {
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
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_FAVORITES = gql`
  query GetFavorites($input: OrdinaryInquiry!) {
    getFavorites(input: $input) {
      list {
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
        memberData {
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
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_VISITED = gql`
  query GetVisited($input: OrdinaryInquiry!) {
    getVisited(input: $input) {
      list {
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
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
        memberData {
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
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_BOARD_ARTICLE = gql`
  query GetArticle($input: String!) {
    getArticle(input: $input) {
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
      memberData {
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
      }
    }
  }
`;

export const GET_BOARD_ARTICLES = gql`
  query GetArticles($input: ArticlesInquiry!) {
    getArticles(input: $input) {
      list {
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
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
        memberData {
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
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
  query GetComments($input: CommentsInquiry!) {
    getComments(input: $input) {
      list {
        _id
        commentStatus
        commentGroup
        commentContent
        commentRefId
        memberId
        createdAt
        updatedAt
        replies {
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
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
        memberData {
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
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *         FOLLOW        *
 *************************/
export const GET_MEMBER_FOLLOWERS = gql`
  query GetMemberFollowings($input: FollowInquiry!) {
    getMemberFollowings(input: $input) {
      list {
        _id
        followingId
        followerId
        createdAt
        updatedAt
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
        meFollowed {
          followingId
          followerId
          myFollowing
        }
        followingData {
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
          memberFollowings
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
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_MEMBER_FOLLOWINGS = gql`
  query GetMemberFollowings($input: FollowInquiry!) {
    getMemberFollowings(input: $input) {
      list {
        _id
        followingId
        followerId
        createdAt
        updatedAt
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
        meFollowed {
          followingId
          followerId
          myFollowing
        }
        followingData {
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
          memberFollowings
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
        }
      }
      metaCounter {
        total
      }
    }
  }
`;
