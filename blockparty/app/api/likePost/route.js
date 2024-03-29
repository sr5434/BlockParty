import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server';
import { v4 as uuidv4, } from 'uuid';
const sql = require('mssql');

export async function POST(req){
  const {userId} = getAuth(req);

  if(!userId){
    return new Response("Unauthorized", { status: 401 });
  }
  let reqJSON = await req?.json();
  //Connect to database
  await sql.connect(process.env.CONN_STR);
  const result = await sql.query`IF EXISTS (SELECT 1 FROM [Likes].[Post] WHERE PostID = ${reqJson.postID}) UPDATE [Likes].[Post] SET Likes+=1 WHERE PostID = ${reqJson.postID} ELSE INSERT INTO [Likes].[Post] (PostID, Likes) VALUES (${reqJson.postID}, 0)`;
  //TODO: Add to list of liked posts
  const result2 = await sql.query``
  // Sample curl request to test this: curl -X POST -H "Content-Type: application/json" -d '{"post":"..."}' http://localhost:3000/api/newPost
  return NextResponse.json({ });
}