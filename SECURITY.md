# 🔐 Security Guidelines

## API Key Management

### ⚠️ Critical Security Rules

1. **Never commit API keys to version control**
2. **Always use environment variables**
3. **Rotate keys regularly**
4. **Monitor access logs**

### ✅ Correct Implementation

```typescript
// ✅ Good: Use environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
```

### ❌ Incorrect Implementation

```typescript
// ❌ Bad: Hardcoding API keys
const GEMINI_API_KEY = "your_actual_api_key_here";
```

## Environment Variables Setup

### Frontend (.env)
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_API_URL=http://localhost:5000
```

### Backend (server/.env)
```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
SESSION_SECRET=your_secure_session_secret
```

## Security Checklist

### Before Committing Code
- [ ] No API keys in source code
- [ ] All secrets in environment variables
- [ ] `.env` files in `.gitignore`
- [ ] No hardcoded credentials
- [ ] No debug logs with sensitive data

### Deployment Security
- [ ] Environment variables set in deployment platform
- [ ] API keys rotated after deployment
- [ ] Access logs monitored
- [ ] HTTPS enabled
- [ ] CORS properly configured

### API Key Rotation

If you suspect a key has been compromised:

1. **Immediately revoke the key** in Google Cloud Console
2. **Generate a new key**
3. **Update environment variables**
4. **Redeploy application**
5. **Monitor for unauthorized access**

## Google Cloud Console Setup

### Creating API Keys
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Click "Create Credentials" > "API Key"
4. Restrict the key to specific APIs (Generative Language API)
5. Set application restrictions (HTTP referrers)

### Key Restrictions
- **API restrictions**: Only enable Generative Language API
- **Application restrictions**: Set to specific domains
- **Key rotation**: Rotate every 90 days

## Monitoring & Alerts

### Set up monitoring for:
- Unusual API usage patterns
- Failed authentication attempts
- Geographic anomalies
- Rate limit violations

### Recommended Tools:
- Google Cloud Monitoring
- Application logging
- Security scanning tools

## Emergency Response

If you discover a leaked API key:

1. **Immediate Actions**:
   - Revoke the key immediately
   - Check access logs for unauthorized use
   - Generate a new key

2. **Investigation**:
   - Review git history for when the key was exposed
   - Check if the key was used maliciously
   - Update all affected services

3. **Prevention**:
   - Review security practices
   - Implement automated scanning
   - Train team on security best practices

## Resources

- [Google Cloud Security Best Practices](https://cloud.google.com/security/best-practices)
- [API Key Management](https://cloud.google.com/apis/design/security)
- [Environment Variables Best Practices](https://12factor.net/config)

---

**Remember**: Security is everyone's responsibility. When in doubt, ask for help! 