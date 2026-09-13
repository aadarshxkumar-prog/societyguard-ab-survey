import {put,head,BlobNotFoundError} from '@vercel/blob';
import {validate} from '../lib/validation.js';
export default async function handler(req,res){res.setHeader('Cache-Control','no-store');if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Use POST.'});}if(!(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).json({error:'JSON required.'});if(Buffer.byteLength(JSON.stringify(req.body||{}))>20000)return res.status(413).json({error:'Response too large.'});if(!validate(req.body))return res.status(400).json({error:'Please complete all three tests and ratings.'});
const storage = storageOptions(req);if(!storage)return res.status(503).json({error:'Feedback collection is not connected yet.'});const pathname=`societyguard-v1/${req.body.id}.json`;try{try{await head(pathname, storage);return res.status(200).json({saved:true,id:req.body.id});}catch(e){if(!(e instanceof BlobNotFoundError))throw e;}
const {id,surveyVersion,consent,elapsedMs,answers,overall}=req.body;await put(pathname,JSON.stringify({id,surveyVersion,consent,elapsedMs,answers,overall,receivedAt:new Date().toISOString()}),{...storage,access:'private',addRandomSuffix:false,allowOverwrite:false,contentType:'application/json'});return res.status(201).json({saved:true,id});}catch(e){try{await head(pathname, storage);return res.status(200).json({saved:true,id:req.body.id});}catch{} console.error('Response save failed:',e.name);return res.status(503).json({error:'We could not save your feedback. Please retry shortly.'});}}

function storageOptions(req) {
 const token = req.headers?.['x-vercel-oidc-token'] || process.env.VERCEL_OIDC_TOKEN;
 if (process.env.BLOB_STORE_ID && typeof token === 'string' && token) return {storeId: process.env.BLOB_STORE_ID, oidcToken: token};
 if (process.env.BLOB_READ_WRITE_TOKEN) return {token: process.env.BLOB_READ_WRITE_TOKEN};
 return null;
}
