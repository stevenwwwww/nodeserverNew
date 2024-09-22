// middlewares/auth.js

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  
    // 简单的 token 验证逻辑（可以替换成 JWT 或 OAuth 验证）
    if (token === 'valid-token') {
      next();
    } else {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  };
  
  module.exports = authenticate;
  