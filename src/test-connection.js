const { sequelize } = require('./config/database');

async function testConnection() {
  try {
    console.log('正在測試資料庫連接...');
    
    // 測試連接
    await sequelize.authenticate();
    console.log('✅ 資料庫連接成功！');
    
    // 顯示連接資訊
    const dialect = sequelize.getDialect();
    const databaseName = sequelize.getDatabaseName();
    const host = sequelize.config.host;
    const port = sequelize.config.port;
    
    console.log(`📊 資料庫類型: ${dialect}`);
    console.log(`🏠 主機: ${host}`);
    console.log(`🚪 埠號: ${port}`);
    console.log(`📚 資料庫名稱: ${databaseName}`);
    
    // 測試簡單查詢
    const [results] = await sequelize.query('SELECT version() as version');
    console.log(`🐘 PostgreSQL 版本: ${results[0].version}`);
    
  } catch (error) {
    console.error('❌ 資料庫連接失敗:', error.message);
    
    // 提供一些常見問題的解決方案
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 請檢查主機名稱是否正確');
    } else if (error.message.includes('authentication failed')) {
      console.log('💡 請檢查用戶名稱和密碼是否正確');
    } else if (error.message.includes('SSL')) {
      console.log('💡 請確保 SSL 設定正確 (Neon 需要 SSL)');
    }
  } finally {
    await sequelize.close();
    console.log('🔒 資料庫連接已關閉');
  }
}

// 如果直接執行這個文件，就運行測試
if (require.main === module) {
  testConnection();
}

module.exports = testConnection; 