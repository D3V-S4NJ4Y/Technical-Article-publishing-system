import AuditLog from '../models/AuditLog.js';

export const auditLogger = (action, resourceType) => {
  return async (req, res, next) => {
    // Store original res.json to intercept response
    const originalJson = res.json;
    
    res.json = function(data) {
      // Only log successful operations (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Extract resource ID from response or request
        let resourceId = null;
        if (data && data.article && data.article._id) {
          resourceId = data.article._id;
        } else if (req.params && req.params.id) {
          resourceId = req.params.id;
        }

        // Create audit log entry
        const logEntry = {
          userId: req.user ? req.user._id : null,
          action,
          resourceType,
          resourceId,
          details: {
            method: req.method,
            url: req.originalUrl,
            body: action === 'LOGIN' ? {} : req.body // Don't log sensitive data
          },
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent')
        };

        // Save audit log (don't wait for it to complete)
        AuditLog.create(logEntry).catch(err => {
          console.error('Audit log failed:', err);
        });
      }

      // Call original json method
      return originalJson.call(this, data);
    };

    next();
  };
};

// Direct logging function for manual use
export const logActivity = async (userId, action, details = {}) => {
  try {
    await AuditLog.create({
      userId,
      action,
      resourceType: 'USER',
      details,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Manual audit log failed:', error);
  }
};