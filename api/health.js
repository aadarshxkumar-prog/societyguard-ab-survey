export default function handler(req,res){res.setHeader('Cache-Control','no-store');res.status(200).json({ready:!!storageOptions(req)});}
function storageOptions(req) {
 const token = req.headers?.['x-vercel-oidc-token'] || process.env.VERCEL_OIDC_TOKEN;
 if (process.env.BLOB_STORE_ID && typeof token === 'string' && token) return {storeId: process.env.BLOB_STORE_ID, oidcToken: token};
 if (process.env.BLOB_READ_WRITE_TOKEN) return {token: process.env.BLOB_READ_WRITE_TOKEN};
 return null;
}
