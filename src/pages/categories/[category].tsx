import { GetStaticPaths, GetStaticProps } from "next";
import { NewsArticle, NewsResponse } from "../../../models/NewsArticles";
import { NewsArticlesGrid } from "../../../components/NewsArticlesGrid";
import { useRouter } from "next/router";
import Head from "next/head";

interface CategoryNewsPageProps {
	newsArticles: NewsArticle[];
}

export const getStaticPaths: GetStaticPaths = () => {
  const categorySlugs = [
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
  ];
  const paths = categorySlugs.map(slug => ({ params: {category: slug} }))

  return {
    paths, 
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<CategoryNewsPageProps> = async ({
	params
}) => {
	const category = params?.category?.toString();
	const response = await fetch(
		`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${process.env.NEWS_API_KEY}`
	);
	const newsResponse: NewsResponse = await response.json();
	return {
		props: { newsArticles: newsResponse.articles },
    revalidate: 5 * 60,
	};
  // let error go to 500 page
};

const CategoryNewsPage = ({ newsArticles }: CategoryNewsPageProps) => {
	
  const router = useRouter();
  const categoryName = router.query.category?.toString();
  const length = categoryName?.length
  const UpperCaseCategoryNameFirst = categoryName?.[0].toUpperCase()
  const endOfCategoryName = categoryName?.slice(1, length)
  const headTitle = UpperCaseCategoryNameFirst?.concat("", endOfCategoryName!)
  const title = "Category: " + headTitle

  return (
  <>
  <Head >
    <title key="title">{`${headTitle} News - NextJs News App`}</title>
  </Head>
  <main>
    <h1>{title}</h1>
    <NewsArticlesGrid articles={newsArticles} />
  </main>
  </>
  );
};

export default CategoryNewsPage;
