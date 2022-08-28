import React, { useState, useEffect } from 'react'

//hook used to access the information from app.js for name of the article - '/article/:name'
import { useParams } from 'react-router-dom'

//importing the content for articles from articleContent page
import ArticleContent from './ArticleContent'
import CommentsList from '../components/CommentsList'
import AddCommentForm from '../components/AddCommentForm'
import NotFound from './NotFound'

const Article = () => {
    const { name } = useParams(); //destructuring
    
    //matching the article name with the name passed in the url to know which article is to be used/displayed
    const article = ArticleContent.find((article) => article.name === name);

    const [articleInfo,setArticleInfo] = useState({ comments: [] });

    useEffect(()=> {
      const fetchData = async () => {
        const result = await fetch(`api/articles/${name}`);
        const body = await result.json();
        console.log(body);
        setArticleInfo(body);
      }
      fetchData();
    }, [name]);
    //if article does not exist
    if(!article)
      // return <h1>Article does not exist!</h1>
      return <NotFound />
  return (
    <>
      <h1 className='sm:text-4xl text-2xl font-bold my-6 text-gray-900'>
      {/* whatever  URL is passed in /:name it will be displayed in place of {name} */}
        This is { name } Article 
      </h1>
      {
        //mapping the content array of the matched article and printing every paragraph from the content array
        article.content.map((paragraph, index) => {
          return(
          <p className= 'mx-auto leading-relaxed text-base mb-4' key={index}>
            {paragraph}
          </p>
        )})
      }
      <CommentsList comments={articleInfo.comments} />  
      <AddCommentForm articleName={name} setArticleInfo={setArticleInfo} />
    </>
  )
}

export default Article