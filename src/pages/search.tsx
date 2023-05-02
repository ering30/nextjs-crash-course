import { ChangeEvent, FormEvent, useState, useRef, useEffect } from 'react'
import { NewsArticle } from '../../models/NewsArticles';
import { Button, Form, Spinner } from 'react-bootstrap';
import { NewsArticlesGrid } from '../../components/NewsArticlesGrid';
import Head from 'next/head';
import { debounce } from 'lodash'

export default function SearchNewsPage() {
  const [ searchResults, setSearchResults ] = useState<NewsArticle[] | null >(null);
  const [ searchResultsLoading, setSearchResultsLoading ] = useState(false);
  const [ searchResultsLoadingIsError, setSearchResultsLoadingIsError ] = useState(false);

  // async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   const formData = new FormData(e.target as HTMLFormElement);
  //   const searchQuery = formData.get("searchQuery")?.toString().trim();

  //   if (searchQuery){
  //     try {
  //       setSearchResults(null);
  //       setSearchResultsLoadingIsError(false);
  //       setSearchResultsLoading(true);
  //       const response = await fetch("/api/search-news?q=" + searchQuery)
  //       const articles: NewsArticle[] = await response.json();
  //       setSearchResults(articles)
  //     } catch (error) {
  //       console.error(error);
  //       setSearchResultsLoadingIsError(true);
  //     } finally {
  //       setSearchResultsLoading(false);
  //     }
  //   }
  // }

  async function handleChange(event: ChangeEvent<HTMLInputElement>){
    const searchQuery = event.target.value?.toString().trim();
    debouncedSearch(searchQuery);
  }

  const debouncedSearch = useRef(
    debounce(async (searchQuery) => {
      if (searchQuery){
        try {
          setSearchResultsLoadingIsError(false);
          setSearchResultsLoading(true);
          const response = await fetch("/api/search-news?q=" + searchQuery)
          const articles: NewsArticle[] = await response.json();
          setSearchResults(articles)
        } catch (error) {
          console.error(error);
          setSearchResultsLoadingIsError(true);
        } finally {
          setSearchResultsLoading(false);
        }
      }
    }, 300)
  ).current;
    
  useEffect(()=> {
    return () => {
      debouncedSearch.cancel();
    }
  },[debouncedSearch])

  return (
    <>
    <Head >
      <title key="title">Search News - NextJS News App</title>
    </Head>
    <main>
      <h1>Search News</h1>
      <Form 
      // onSubmit={handleSubmit}
      >
        <Form.Group className='mb-3' controlId='search-input'> 
          <Form.Label>Search query</Form.Label>
          <Form.Control 
          name='searchQuery'
          placeholder='Start typing to search...'
          onChange={handleChange}
          />
        </Form.Group>
        <Button 
        type='submit'
        className='mb-3'
        disabled={searchResultsLoading}
        >
          Search
        </Button>
      </Form>
      <div className='d-flex flex-column align-items-center'>
        {searchResultsLoading && <Spinner animation='border'/>}
        {searchResultsLoadingIsError && <p>Something went wrong. Please try again.</p>}
        {searchResults?.length === 0 && <p>Nothing found. Try a different query.</p>}
        {searchResults && <NewsArticlesGrid articles={searchResults}/>}
      </div>
    </main>
    </>
  )
}
