<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <title>RSS Feed - Shubham Rasal</title>
        <style>
          body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 8px; margin-bottom: 2rem; text-align: center; }
          .item { background: white; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .item h2 a { color: #2c3e50; text-decoration: none; }
          .meta { color: #666; font-size: 0.9rem; margin-bottom: 1rem; }
          .content { color: #444; line-height: 1.7; }
          .tag { display: inline-block; background: #e3f2fd; color: #1976d2; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; margin-right: 0.5rem; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>RSS Feed</h1>
          <p>Shubham Rasal - Portfolio & Blog</p>
        </div>
        <xsl:for-each select="rss/channel/item">
          <div class="item">
            <h2><a href="{link}"><xsl:value-of select="title"/></a></h2>
            <div class="meta">
              <span>📅 <xsl:value-of select="pubDate"/></span>
              <xsl:if test="author"><span>👤 <xsl:value-of select="author"/></span></xsl:if>
            </div>
            <div class="content"><xsl:value-of select="content" disable-output-escaping="yes"/></div>
            <xsl:if test="category">
              <div class="tags">
                <xsl:for-each select="category">
                  <span class="tag"><xsl:value-of select="."/></span>
                </xsl:for-each>
              </div>
            </xsl:if>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
