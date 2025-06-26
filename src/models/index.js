const Administrator = require("./Administrator");
const Announcement = require("./Announcement");
const Event = require("./Event");
const Registration = require("./Registration");

// 定義模型關聯
// 管理員與公告的一對多關係
Administrator.hasMany(Announcement, {
  foreignKey: "administrator_id",
  as: "announcements",
});
Announcement.belongsTo(Administrator, {
  foreignKey: "administrator_id",
  as: "creator",
});

// 管理員與活動的一對多關係
Administrator.hasMany(Event, {
  foreignKey: "administrator_id",
  as: "events",
});
Event.belongsTo(Administrator, {
  foreignKey: "administrator_id",
  as: "creator",
});

// 活動與報名的一對多關係
Event.hasMany(Registration, {
  foreignKey: "event_id",
  as: "registrations",
});
Registration.belongsTo(Event, {
  foreignKey: "event_id",
  as: "event",
});

// 管理員與報名的一對多關係
Administrator.hasMany(Registration, {
  foreignKey: "administrator_id",
  as: "registrations",
});
Registration.belongsTo(Administrator, {
  foreignKey: "administrator_id",
  as: "administrator",
});

module.exports = {
  Administrator,
  Announcement,
  Event,
  Registration,
};
