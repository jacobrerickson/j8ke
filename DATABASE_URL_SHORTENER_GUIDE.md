# Database-Powered URL Shortener Guide

## 🚀 **Upgraded to MongoDB Database Storage**

The URL shortener now uses MongoDB instead of JSON files, providing:

- **Scalability**: Handle millions of URL mappings
- **Performance**: Fast database queries with indexes
- **Analytics**: Track click counts and access times
- **Reliability**: ACID transactions and data consistency
- **Persistence**: Data survives server restarts

## 📊 **Database Schema**

### **UrlMapping Collection**

```javascript
{
  _id: ObjectId,
  shortCode: "a1b2c3d4",           // 8-character hash
  originalUrl: "https://...",      // Full original URL
  clickCount: 42,                  // Number of times clicked
  lastAccessedAt: Date,            // Last access time
  createdAt: Date,                 // When created
  updatedAt: Date                  // When last updated
}
```

### **Indexes for Performance**

- `shortCode` (unique) - Fast lookups for redirects
- `originalUrl` - Fast duplicate detection

## 🔧 **How It Works**

### **1. URL Shortening Process**

```javascript
// When processing HTML files:
1. Extract URLs from HTML content
2. For each URL:
   - Check if already exists in database
   - If exists: return existing short code
   - If new: create MD5 hash + save to database
3. Replace URLs in HTML with shortened versions
4. Save processed HTML file
```

### **2. Redirect Process**

```javascript
// When user clicks shortened URL:
1. Extract short code from URL
2. Query database for mapping
3. If found:
   - Increment click count
   - Update last accessed time
   - Redirect to original URL
4. If not found: return 404
```

## 🛠 **Database Functions**

### **Core Functions**

- `findShortCodeByUrl(url)` - Find existing short code
- `createUrlMapping(shortCode, url)` - Create new mapping
- `UrlMappingModel.findOne({ shortCode })` - Lookup for redirects

### **Analytics Functions**

- `clickCount` - Track how many times URL was clicked
- `lastAccessedAt` - Track when URL was last used
- `createdAt` - Track when URL was created

## 📈 **Benefits Over JSON File**

| Feature         | JSON File            | MongoDB Database           |
| --------------- | -------------------- | -------------------------- |
| **Scalability** | Limited to file size | Unlimited                  |
| **Performance** | O(n) linear search   | O(1) indexed lookup        |
| **Concurrency** | File locking issues  | ACID transactions          |
| **Analytics**   | None                 | Click tracking, timestamps |
| **Backup**      | Manual file copy     | Database replication       |
| **Querying**    | Not possible         | Complex queries            |

## 🧪 **Testing the Database Integration**

### **1. Start the System**

```bash
# Make sure MongoDB is running
# Start the server
cd packages/server
pnpm dev
```

### **2. Test URL Shortening**

1. Upload an HTML file with URLs
2. Check the database for new entries:
   ```javascript
   // In MongoDB shell or GUI
   db.urlmappings.find();
   ```

### **3. Test Redirects**

1. Get a shortened URL from the results
2. Click it or visit directly
3. Verify it redirects to the original URL
4. Check that `clickCount` increased

### **4. Test Duplicate URLs**

1. Upload another HTML with the same URLs
2. Verify the same short codes are reused
3. Check that no duplicate entries are created

## 📊 **Database Queries for Analytics**

### **Most Clicked URLs**

```javascript
db.urlmappings.find().sort({ clickCount: -1 }).limit(10);
```

### **Recently Created URLs**

```javascript
db.urlmappings.find().sort({ createdAt: -1 }).limit(10);
```

### **Recently Accessed URLs**

```javascript
db.urlmappings.find().sort({ lastAccessedAt: -1 }).limit(10);
```

### **URL Statistics**

```javascript
// Total URLs
db.urlmappings.countDocuments();

// Total clicks
db.urlmappings.aggregate([
  { $group: { _id: null, totalClicks: { $sum: "$clickCount" } } },
]);

// Average clicks per URL
db.urlmappings.aggregate([
  { $group: { _id: null, avgClicks: { $avg: "$clickCount" } } },
]);
```

## 🔒 **Production Considerations**

### **Environment Variables**

```bash
# .env file
DB_URL=mongodb://localhost:27017/your-database
SHORT_DOMAIN=https://your-domain.com
```

### **Database Optimization**

- **Indexes**: Already created for `shortCode` and `originalUrl`
- **Connection Pooling**: MongoDB driver handles this automatically
- **Replica Sets**: For high availability
- **Sharding**: For massive scale

### **Monitoring**

- **Query Performance**: Monitor slow queries
- **Memory Usage**: Track database memory consumption
- **Click Analytics**: Monitor popular URLs
- **Error Rates**: Track failed redirects

## 🚀 **Advanced Features (Future)**

### **URL Expiration**

```javascript
// Add expiration field to schema
expiresAt: Date;
```

### **Custom Short Codes**

```javascript
// Allow users to specify custom short codes
customShortCode: String;
```

### **URL Analytics Dashboard**

- Click tracking over time
- Geographic distribution
- Referrer tracking
- Device/browser analytics

### **Rate Limiting**

- Limit redirects per IP
- Prevent abuse of short URLs
- Implement CAPTCHA for suspicious activity

## 🎯 **Migration from JSON File**

If you have existing JSON mappings:

```javascript
// Migration script
const fs = require("fs");
const mappings = JSON.parse(fs.readFileSync("url-mappings.json"));

for (const [shortCode, originalUrl] of Object.entries(mappings)) {
  await UrlMappingModel.create({
    shortCode,
    originalUrl,
    clickCount: 0,
  });
}
```

The system is now production-ready with database storage! 🎉
