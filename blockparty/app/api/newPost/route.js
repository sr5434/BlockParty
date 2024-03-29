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
  const PostID = uuidv4();
  const result = await sql.query`INSERT INTO [Posts].[Post] (PostID, [User], Content, Timestamp) VALUES (${PostID}, ${userId}, ${reqJSON.post}, GETDATE()); INSERT INTO [Likes].[Post] (PostID, Likes) VALUES (${PostID}, 0);`;

  // Sample curl request to test this: curl -X POST -H "Content-Type: application/json" -d '{"post":"..."}' http://localhost:3000/api/newPost
  return NextResponse.json({ result: result });
}