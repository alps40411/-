'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ============================
    // 1. 創建 administrators 表
    // ============================
    await queryInterface.createTable('administrators', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      birth: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM('M', 'F'),
        allowNull: false,
        defaultValue: 'M',
      },
      line_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // 為 administrators 表建立索引
    await queryInterface.addIndex('administrators', ['username']);
    await queryInterface.addIndex('administrators', ['line_id']);

    // ============================
    // 2. 創建 announcements 表
    // ============================
    await queryInterface.createTable('announcements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
      },
      administrator_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'administrators',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // 為 announcements 表建立索引
    await queryInterface.addIndex('announcements', ['administrator_id']);
    await queryInterface.addIndex('announcements', ['status']);

    // ============================
    // 3. 創建 events 表
    // ============================
    await queryInterface.createTable('events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      is_capacity_limited: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      max_participants: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      current_participants: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      registration_deadline: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('upcoming', 'ongoing', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'upcoming',
      },
      administrator_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'administrators',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // 為 events 表建立索引
    await queryInterface.addIndex('events', ['administrator_id']);
    await queryInterface.addIndex('events', ['status']);
    await queryInterface.addIndex('events', ['start_time']);
    await queryInterface.addIndex('events', ['registration_deadline']);

    // ============================
    // 4. 創建 event_registrations 表
    // ============================
    await queryInterface.createTable('event_registrations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'events',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      administrator_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'administrators',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      participant_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      remark: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      registration_time: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // 為 event_registrations 表建立索引
    await queryInterface.addIndex('event_registrations', ['event_id']);
    await queryInterface.addIndex('event_registrations', ['administrator_id']);
    await queryInterface.addIndex('event_registrations', ['registration_time']);
    
    // 建立複合唯一索引，防止同一管理員重複報名同一活動
    await queryInterface.addIndex('event_registrations', 
      ['event_id', 'administrator_id'], 
      { 
        unique: true,
        name: 'unique_event_administrator_registration'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    // 按照相反順序刪除表（考慮外鍵約束）
    await queryInterface.dropTable('event_registrations');
    await queryInterface.dropTable('events');
    await queryInterface.dropTable('announcements');
    await queryInterface.dropTable('administrators');
  }
}; 