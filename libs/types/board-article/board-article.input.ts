import {
  BoardArticleCategory,
  BoardArticleStatus,
} from "../../enums/board-article.enum";
import { Direction } from "../../enums/common.enum";

export interface BoardArticleInput {
  articleCategory: BoardArticleCategory;
  articleTitle: string;
  articleContent: string;
  articleImage: string;
  memberId?: string;
}

// GraphQL backend expects this interface
export interface ArticleInput {
  articleCategory: BoardArticleCategory;
  articleTitle: string;
  articleContent: string;
  articleImage: string;
}

interface BAISearch {
  articleCategory: BoardArticleCategory;
  text?: string;
}

export interface ArticlesInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: BAISearch;
}

interface ABAISearch {
  articleStatus?: BoardArticleStatus;
  articleCategory?: BoardArticleCategory;
}

export interface AllBoardArticlesInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: ABAISearch;
}
